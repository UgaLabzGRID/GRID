import { users, agents, chatMessages, type User, type InsertUser, type Agent, type InsertAgent, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: number): Promise<boolean>;
  
  // Chat operations
  getChatMessages(agentId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private agents: Map<number, Agent>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentAgentId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.agents = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentAgentId = 1;
    this.currentMessageId = 1;
    
    // Initialize with default agents
    this.initializeAgents();
  }

  private initializeAgents() {
    const defaultAgents: InsertAgent[] = [
      {
        name: "Midnight Oracle",
        role: "Midnight Protocol Consultant",
        avatar: "DATA_SEER_IMAGE",
        color: "blue",
        description: "Fully internet-enabled research agent combining live web search with document memory. Confident, professional Midnight/Cardano-focused oracle.",
        status: "online"
      },
      {
        name: "Uga XRP",
        role: "XRPL Jungle King",
        avatar: "UGA_XRP_IMAGE",
        color: "green",
        description: "XRPL Specialist and King of the Jungle. Master of liquidity, AMMs, and esoteric memetics from the sacred banana realm.",
        status: "online"
      }
    ];

    defaultAgents.forEach(agent => {
      const id = this.currentAgentId++;
      const newAgent: Agent = { 
        ...agent, 
        id, 
        createdAt: new Date(),
        description: agent.description || null,
        status: agent.status || "online"
      };
      this.agents.set(id, newAgent);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = this.currentAgentId++;
    const agent: Agent = { 
      ...insertAgent, 
      id, 
      createdAt: new Date(),
      description: insertAgent.description || null,
      status: insertAgent.status || "online"
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: number, updates: Partial<InsertAgent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...updates };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: number): Promise<boolean> {
    return this.agents.delete(id);
  }

  async getChatMessages(agentId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      message => message.agentId === agentId
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      agentId: insertMessage.agentId || null
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
