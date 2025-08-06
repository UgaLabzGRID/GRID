import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAgentSchema, insertChatMessageSchema } from "@shared/schema";
import { generateMidnightOracleResponse, generateUgaXRPResponse } from "./openai";
import { seedDocuments } from "./documentSeeder";
import { seedMidnightDocuments } from "./seedDocuments";
import { documentIndexer } from "./documentIndexer";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Agent routes
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const validatedData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(validatedData);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agent data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create agent" });
    }
  });

  app.put("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAgentSchema.partial().parse(req.body);
      const agent = await storage.updateAgent(id, validatedData);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agent data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAgent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete agent" });
    }
  });

  // Chat message routes
  app.get("/api/agents/:id/messages", async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(agentId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/agents/:id/messages", async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        agentId
      });
      
      // Store user message
      const userMessage = await storage.createChatMessage(validatedData);
      
      // Get agent details for AI response
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      // Get conversation history for context
      const previousMessages = await storage.getChatMessages(agentId);
      const conversationHistory = previousMessages.slice(-10).map(msg => ({
        role: msg.sender === "user" ? "user" as const : "assistant" as const,
        content: msg.message
      }));
      
      // Generate AI response
      try {
        const aiResponse = agent.name === "Midnight Oracle" 
          ? await generateMidnightOracleResponse(validatedData.message)
          : agent.name === "Uga XRP"
          ? await generateUgaXRPResponse(validatedData.message) 
          : "Agent system recovery in progress. Please try again shortly.";
        
        // Store AI response
        await storage.createChatMessage({
          agentId,
          message: aiResponse,
          sender: "agent"
        });
      } catch (aiError) {
        console.error("AI response error:", aiError);
        // Store fallback message if AI fails
        await storage.createChatMessage({
          agentId,
          message: "I'm experiencing some technical difficulties right now. Please try again in a moment.",
          sender: "agent"
        });
      }
      
      res.status(201).json(userMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Legacy endpoints removed - system reset complete

  app.post("/api/midnight-oracle", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ 
          error: "Message is required",
          response: "Please provide a question or topic you'd like me to research."
        });
      }

      console.log(`🔮 Midnight Oracle API called with: "${message}"`);
      const response = await generateMidnightOracleResponse(message);
      console.log(`✅ Midnight Oracle response generated`);
      
      res.json({ response });
    } catch (error: any) {
      console.error("Midnight Oracle endpoint error:", error);
      
      // Return confident, helpful error message
      const defaultMessage = "Based on the available information and protocol design patterns, I can provide insights on this topic. However, I'm experiencing some technical difficulties right now.";
      
      res.status(500).json({ 
        error: defaultMessage,
        response: defaultMessage
      });
    }
  });

  app.post("/api/uga-xrp", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ 
          error: "Message is required",
          response: "Uga needs banana... I mean, your question! What do you want to know about XRPL?"
        });
      }

      console.log(`🦍 Uga XRP API called with: "${message}"`);
      const response = await generateUgaXRPResponse(message);
      console.log(`✅ Uga XRP response generated`);
      
      res.json({ response });
    } catch (error: any) {
      console.error("Uga XRP endpoint error:", error);
      
      // Return characteristic Uga error message
      const defaultMessage = "Uga brain temporarily offline! But don't worry - XRPL jungle wisdom says patience brings banana rewards. Try again soon!";
      
      res.status(500).json({ 
        error: defaultMessage,
        response: defaultMessage
      });
    }
  });

  // Document management routes
  app.post("/api/seed-documents", async (req, res) => {
    try {
      await seedDocuments();
      const docCount = await documentIndexer.getIndexedDocumentCount();
      res.json({ 
        message: "Documents seeded successfully", 
        documentCount: docCount 
      });
    } catch (error) {
      console.error("Error seeding documents:", error);
      res.status(500).json({ message: "Failed to seed documents" });
    }
  });

  app.get("/api/document-stats", async (req, res) => {
    try {
      const docCount = await documentIndexer.getIndexedDocumentCount();
      res.json({ documentCount: docCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to get document stats" });
    }
  });

  // Performance benchmarking endpoint
  app.get("/api/benchmark", async (req, res) => {
    try {
      const benchmarks = {
        vectorSearch: 0,
        webSearch: 0,
        total: 0
      };

      const totalStart = Date.now();
      
      // Vector search benchmark
      const vectorStart = Date.now();
      await documentIndexer.searchDocuments("NIGHT token", 3);
      benchmarks.vectorSearch = Date.now() - vectorStart;
      
      // Web search benchmark
      const webStart = Date.now();
      try {
        const webResults = await fetch('https://api.search.brave.com/res/v1/web/search?q=midnight.io&count=1', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
        });
        if (webResults.ok) await webResults.json();
      } catch (e) {
        console.log('Benchmark web search timeout/error (expected)');
      }
      benchmarks.webSearch = Date.now() - webStart;
      
      benchmarks.total = Date.now() - totalStart;
      
      res.json({
        benchmarks,
        target: "< 2000ms",
        status: benchmarks.total < 2000 ? "OPTIMAL" : "NEEDS_OPTIMIZATION",
        breakdown: {
          vectorSearchPercent: Math.round((benchmarks.vectorSearch / benchmarks.total) * 100),
          webSearchPercent: Math.round((benchmarks.webSearch / benchmarks.total) * 100)
        }
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  
  // Seed Midnight documents on startup for dual-mode intelligence (DISABLED for Git setup)
  // seedMidnightDocuments().catch(console.error);
  
  return httpServer;
}
