import { apiRequest } from "@/lib/queryClient";
import type { Agent, InsertAgent, ChatMessage, InsertChatMessage } from "@shared/schema";

export async function getAgents(): Promise<Agent[]> {
  const response = await fetch("/api/agents");
  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }
  return response.json();
}

export async function getAgent(id: number): Promise<Agent> {
  const response = await fetch(`/api/agents/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch agent");
  }
  return response.json();
}

export async function createAgent(agent: InsertAgent): Promise<Agent> {
  const response = await apiRequest("POST", "/api/agents", agent);
  return response.json();
}

export async function updateAgent(id: number, agent: Partial<InsertAgent>): Promise<Agent> {
  const response = await apiRequest("PUT", `/api/agents/${id}`, agent);
  return response.json();
}

export async function deleteAgent(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/agents/${id}`);
}

export async function getChatMessages(agentId: number): Promise<ChatMessage[]> {
  const response = await fetch(`/api/agents/${agentId}/messages`);
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
}

export async function sendMessage(agentId: number, message: string): Promise<ChatMessage> {
  const messageData: InsertChatMessage = {
    agentId,
    message,
    sender: "user",
  };
  const response = await apiRequest("POST", `/api/agents/${agentId}/messages`, messageData);
  return response.json();
}
