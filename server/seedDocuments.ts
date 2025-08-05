import { documentIndexer } from './documentIndexer.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function seedMidnightDocuments(): Promise<void> {
  console.log('🌱 Starting document seeding process...');
  
  try {
    // Define the documents to index
    const documents = [
      {
        filename: 'Midnight_Vision_Architecture.txt',
        path: join(__dirname, '../attached_assets/Midnight_1752068476256.txt')
      },
      {
        filename: 'Midnight_Tokenomics_Whitepaper.txt',
        path: join(__dirname, '../attached_assets/Midnight-Tokenomics-And-Incentives-Whitepaper_1752068479205.pdf')
      },
      {
        filename: 'Midnight_Airdrop_Guide.txt',
        path: join(__dirname, '../attached_assets/Comprehensive Step-by-Step Guide How to Claim the Midnight NIGHT Airdrop_1752068482192.txt')
      },
      {
        filename: 'Cardano_Whitepaper.txt',
        path: join(__dirname, '../attached_assets/Cardano WhitePaper_1752068483674.txt')
      },
      {
        filename: 'Midnight_Blockchain_Architecture.txt',
        path: join(__dirname, '../attached_assets/Midnight Blockchain Vision, Architecture, and Societal Role_1752068480695.txt')
      },
      {
        filename: 'Minotaur_Consensus_Protocol.txt',
        path: join(__dirname, '../attached_assets/Minotaur Multi-Resource Blockchain Consensus_1752068477811.pdf')
      }
    ];

    // Process each document
    let processedCount = 0;
    for (const doc of documents) {
      try {
        console.log(`📄 Processing: ${doc.filename}`);
        
        // Read the document content
        const content = readFileSync(doc.path, 'utf-8');
        
        // Clean and prepare content (remove excessive whitespace, normalize line endings, handle binary content)
        const cleanContent = content
          .replace(/\r\n/g, '\n')
          .replace(/\n\s*\n/g, '\n\n')
          .replace(/\0/g, '') // Remove null bytes that cause PostgreSQL issues
          .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters that might cause encoding issues
          .trim();
        
        // Index the document
        await documentIndexer.indexDocument(doc.filename, cleanContent);
        
        processedCount++;
        console.log(`✅ Successfully indexed: ${doc.filename}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${doc.filename}:`, error);
        // Continue with other documents even if one fails
      }
    }
    
    // Get final count
    const totalChunks = await documentIndexer.getIndexedDocumentCount();
    
    console.log(`🎉 Document seeding complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Documents processed: ${processedCount}/${documents.length}`);
    console.log(`   - Total chunks indexed: ${totalChunks}`);
    console.log(`   - Vector memory ready for search`);
    
  } catch (error) {
    console.error('💥 Critical error during document seeding:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly (DISABLED for Git setup)
// if (import.meta.url === `file://${process.argv[1]}`) {
//   seedMidnightDocuments().catch(console.error);
// }