import OpenAI from "openai";
import { db } from "./db";
import { documentChunks } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface DocumentChunk {
  filename: string;
  content: string;
  pageNumber?: number;
  chunkIndex: number;
}

// Optimal chunk size for dual-mode intelligence (ultra-safe for 8192 token limit)
const CHUNK_SIZE = 150; // words (≈ 200 tokens - ultra-safe for embedding)
const OVERLAP_SIZE = 20; // words overlap between chunks

export class DocumentIndexer {
  // Chunk text into smaller segments
  private chunkText(text: string, filename: string): DocumentChunk[] {
    const words = text.split(/\s+/);
    const chunks: DocumentChunk[] = [];
    let chunkIndex = 0;

    for (let i = 0; i < words.length; i += CHUNK_SIZE - OVERLAP_SIZE) {
      const chunkWords = words.slice(i, i + CHUNK_SIZE);
      const chunkContent = chunkWords.join(' ');
      
      if (chunkContent.trim().length > 0) {
        chunks.push({
          filename,
          content: chunkContent.trim(),
          chunkIndex: chunkIndex++,
        });
      }
    }

    return chunks;
  }

  // Generate embeddings using OpenAI text-embedding-3-large
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: text,
        dimensions: 3072,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  // Index a document by chunking and storing embeddings
  async indexDocument(filename: string, content: string): Promise<void> {
    console.log(`Indexing document: ${filename}`);
    
    // First, remove any existing chunks for this document
    await db.delete(documentChunks).where(eq(documentChunks.filename, filename));

    // Chunk the document
    const chunks = this.chunkText(content, filename);
    console.log(`Created ${chunks.length} chunks for ${filename}`);

    // Process chunks and generate embeddings
    for (const chunk of chunks) {
      try {
        const embedding = await this.generateEmbedding(chunk.content);
        
        await db.insert(documentChunks).values({
          filename: chunk.filename,
          content: chunk.content,
          pageNumber: chunk.pageNumber,
          chunkIndex: chunk.chunkIndex,
          embedding: JSON.stringify(embedding),
        });
        
        console.log(`Indexed chunk ${chunk.chunkIndex} for ${filename}`);
      } catch (error) {
        console.error(`Error indexing chunk ${chunk.chunkIndex} for ${filename}:`, error);
      }
    }
  }

  // Search for relevant document chunks using cosine similarity
  async searchDocuments(query: string, limit: number = 5): Promise<Array<{
    content: string;
    filename: string;
    pageNumber?: number;
    similarity: number;
  }>> {
    try {
      // Validate input
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        console.log("Invalid query provided to searchDocuments");
        return [];
      }
      
      // Generate embedding for the query with error handling
      let queryEmbedding: number[];
      try {
        queryEmbedding = await this.generateEmbedding(query.trim());
      } catch (embeddingError) {
        console.error("Failed to generate query embedding:", embeddingError);
        return [];
      }
      
      // Get all chunks with database error handling
      let allChunks;
      try {
        allChunks = await db.select().from(documentChunks);
      } catch (dbError) {
        console.error("Database error when fetching chunks:", dbError);
        return [];
      }
      
      if (!allChunks || allChunks.length === 0) {
        console.log("No document chunks found in database");
        return [];
      }
      
      const results = allChunks
        .map(chunk => {
          // Validate chunk data
          if (!chunk || !chunk.embedding || !chunk.content || !chunk.filename) {
            return null;
          }
          
          try {
            // Parse embedding with validation
            const embeddingStr = chunk.embedding;
            if (typeof embeddingStr !== 'string') {
              console.warn(`Invalid embedding format for chunk in ${chunk.filename}`);
              return null;
            }
            
            const chunkEmbedding = JSON.parse(embeddingStr);
            
            // Validate embedding is an array of numbers
            if (!Array.isArray(chunkEmbedding) || chunkEmbedding.length === 0) {
              console.warn(`Invalid embedding array for chunk in ${chunk.filename}`);
              return null;
            }
            
            // Check if all elements are numbers
            if (!chunkEmbedding.every(val => typeof val === 'number' && !isNaN(val))) {
              console.warn(`Non-numeric values in embedding for chunk in ${chunk.filename}`);
              return null;
            }
            
            // Calculate similarity with validation
            const similarity = this.cosineSimilarity(queryEmbedding, chunkEmbedding);
            
            if (isNaN(similarity)) {
              console.warn(`Invalid similarity calculated for chunk in ${chunk.filename}`);
              return null;
            }
            
            return {
              content: chunk.content.substring(0, 2000), // Limit content length
              filename: chunk.filename,
              pageNumber: chunk.pageNumber || undefined,
              similarity: similarity,
            };
          } catch (parseError) {
            console.warn(`Error processing chunk from ${chunk.filename}:`, parseError);
            return null;
          }
        })
        .filter((result): result is NonNullable<typeof result> => result !== null)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, Math.max(1, Math.min(limit, 10))); // Ensure reasonable limit

      return results;
    } catch (error) {
      console.error("Error searching documents:", error);
      return [];
    }
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Get indexed document count
  async getIndexedDocumentCount(): Promise<number> {
    const result = await db.execute(sql`
      SELECT COUNT(DISTINCT filename) as count
      FROM document_chunks
    `);
    
    return result.rows[0]?.count as number || 0;
  }
}

// Export a singleton instance
export const documentIndexer = new DocumentIndexer();

// Export the standalone function for embedding generation
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      dimensions: 3072,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}