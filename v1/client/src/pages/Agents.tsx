import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getAgents, getChatMessages, sendMessage } from "@/api/agents";
import { sendMessageToUgaXRP, sendMessageToMidnightOracle } from "@/api/directAgents";
import type { Agent, ChatMessage } from "@shared/schema";
import agentThumbnailPath from "@assets/bfe0fc74-d492-428f-8aa1-b4f6abe5f43d_1751950556077.png";
import assistantAlphaGifPath from "@assets/ahora si cono_1751958683994.gif";
import dataSeerGifPath from "@assets/midnight ready_1751973464818.gif";
import dataSeerAvatarPath from "@assets/f643ac9a-5b6f-4a52-98b8-10e26a73612b_1751974934085.png";
import assistantAlphaAvatarPath from "@assets/1af07243-34ec-491e-9548-f140516d6221_1751975103893.png";
import aiLogoPath from "@assets/afase_1751962561074.png";
import vinemindLogoPath from "@assets/aefaes_1751963873216.png";
import vinemindSectionLogoPath from "@assets/cjh_1751966753445.png";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Agents() {
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isAgentLoading, setIsAgentLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showStarterQuestions, setShowStarterQuestions] = useState(true);
  const [showComponents, setShowComponents] = useState({
    agentGif: false,
    agentName: false,
    agentDescription: false,
    agentButton: false
  });
  
  // Optional flag to test video vs GIF performance (set to false to use GIF)
  const [useVideoMode, setUseVideoMode] = useState(false);

  // Starter questions for GPT-style quick suggestions
  const getStarterQuestions = (agentName: string) => {
    switch (agentName) {
      case "Midnight Oracle":
        return [
          "How do I claim the Midnight airdrop?",
          "What makes Midnight private compared to other blockchains?", 
          "Is there still time to get NIGHT tokens if I missed the snapshot?"
        ];
      case "Uga XRP":
        return [
          "Who is Uga Buga, the primal king?",
          "How do I hunt rewards in the jungle, King?",
          "What's the savage way to lock in jungle profits?"
        ];
      default:
        return [
          "How can you help me today?",
          "What do you specialize in?",
          "Tell me about your capabilities"
        ];
    }
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Function to get agent-specific GIF path
  const getAgentGifPath = (agent: Agent) => {
    switch (agent.name) {
      case "Uga XRP":
        return assistantAlphaGifPath;
      case "Midnight Oracle":
        return dataSeerGifPath;
      default:
        return assistantAlphaGifPath;
    }
  };

  // Function to get agent-specific avatar for agent cards
  const getAgentAvatarPath = (agent: Agent) => {
    switch (agent.avatar) {
      case "ASSISTANT_ALPHA_IMAGE":
        return assistantAlphaAvatarPath;
      case "DATA_SEER_IMAGE":
        return dataSeerAvatarPath;
      case "UGA_XRP_IMAGE":
        return assistantAlphaAvatarPath; // Use same avatar for now, will be updated
      default:
        return agentThumbnailPath;
    }
  };

  // Function to check if agent uses custom image avatar
  const hasCustomImageAvatar = (agent: Agent) => {
    return agent.avatar === "ASSISTANT_ALPHA_IMAGE" || agent.avatar === "DATA_SEER_IMAGE" || agent.avatar === "UGA_XRP_IMAGE";
  };

  // Fetch agents
  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ["/api/agents"],
    queryFn: getAgents,
  });

  // Fetch messages for selected agent
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/agents", selectedAgentId, "messages"],
    queryFn: () => selectedAgentId ? getChatMessages(selectedAgentId) : [],
    enabled: !!selectedAgentId,
  });

  // Auto-select first agent and handle timed loading sequence
  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  // Clear chat history when switching agents
  useEffect(() => {
    setChatHistory([]);
  }, [selectedAgentId]);

  // Timed loading sequence when agent is selected
  useEffect(() => {
    if (selectedAgentId && isAgentLoading) {
      // Reset all component visibility
      setShowComponents({
        agentGif: false,
        agentName: false,
        agentDescription: false,
        agentButton: false
      });

      // Show loading for exactly 1 second
      const loadingTimer = setTimeout(() => {
        setIsAgentLoading(false);
        
        // Fade in components sequentially
        setTimeout(() => setShowComponents(prev => ({ ...prev, agentGif: true })), 0);
        setTimeout(() => setShowComponents(prev => ({ ...prev, agentName: true })), 100);
        setTimeout(() => setShowComponents(prev => ({ ...prev, agentDescription: true })), 200);
        setTimeout(() => setShowComponents(prev => ({ ...prev, agentButton: true })), 300);
      }, 1000);

      return () => clearTimeout(loadingTimer);
    }
  }, [selectedAgentId, isAgentLoading]);



  // Optimized agent messaging with streaming responses
  const directAgentMutation = useMutation({
    mutationFn: async ({ agentName, message }: { agentName: string; message: string }) => {
      if (agentName === "Uga XRP") {
        return await sendMessageToUgaXRP(message);
      } else if (agentName === "Midnight Oracle") {
        return await sendMessageToMidnightOracle(message);
      }
      throw new Error("Unknown agent");
    },
    onMutate: ({ message }) => {
      // Immediately add agent placeholder for streaming response
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'assistant',
        content: "", // Will be updated as stream comes in
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, agentMessage]);
      setMessageInput("");
      return { agentMessageId: agentMessage.id };
    },
    onSuccess: (response, variables, context) => {
      // Update the placeholder message with final response
      setChatHistory(prev => prev.map(msg => 
        msg.id === context?.agentMessageId 
          ? { ...msg, content: response }
          : msg
      ));
    },
    onError: (error, variables, context) => {
      console.error("Direct agent error:", error);
      // Update placeholder with error message
      setChatHistory(prev => prev.map(msg => 
        msg.id === context?.agentMessageId 
          ? { ...msg, content: "Sorry, I'm experiencing technical difficulties right now." }
          : msg
      ));
      toast({ 
        title: "Failed to get response", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Legacy send message mutation for backward compatibility
  const sendMessageMutation = useMutation({
    mutationFn: ({ agentId, message }: { agentId: number; message: string }) => 
      sendMessage(agentId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/agents", selectedAgentId, "messages"] 
      });
      setMessageInput("");
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  // Select first agent by default
  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  // Reset starter questions when agent changes
  useEffect(() => {
    if (selectedAgentId) {
      setChatHistory([]);
      setShowStarterQuestions(true);
      setMessageInput("");
    }
  }, [selectedAgentId]);



  const selectedAgent = agents.find(agent => agent.id === selectedAgentId);
  const starterQuestions = selectedAgent ? getStarterQuestions(selectedAgent.name) : [];



  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgent && messageInput.trim()) {
      // Hide starter questions when user sends a message
      setShowStarterQuestions(false);
      
      // Add user message to chat history first
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageInput.trim(),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, userMessage]);
      
      // Send to agent endpoint
      directAgentMutation.mutate({ 
        agentName: selectedAgent.name, 
        message: messageInput.trim() 
      });
    }
  };

  const handleStarterQuestion = (question: string) => {
    if (selectedAgent) {
      // Hide starter questions
      setShowStarterQuestions(false);
      
      // Set message input and trigger send
      setMessageInput(question);
      
      // Add user message to chat history
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, userMessage]);
      
      // Send to agent endpoint
      directAgentMutation.mutate({ 
        agentName: selectedAgent.name, 
        message: question 
      });
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setShowStarterQuestions(true); // Show starter questions again when chat is cleared
    setMessageInput(""); // Clear the input field
    toast({
      title: "Chat cleared",
      description: "Conversation history has been cleared."
    });
  };

  if (agentsLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="pt-16 h-screen bg-black overflow-hidden font-mono">
      <div className="h-full flex gap-2 p-2"
           style={{
             backgroundImage: `
               linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
               linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
               radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.05) 0%, transparent 50%)
             `,
             backgroundSize: '50px 50px, 50px 50px, 100% 100%, 100% 100%'
           }}>
        
        {/* Panel 1 - Agent Selector (15-18% width) */}
        <div className="w-[18%] bg-black/80 border border-white/20 backdrop-blur-sm p-4 overflow-hidden relative">
          {/* Matrix-style cascading squares background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="matrix-rain">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="matrix-column"
                  style={{
                    left: `${(i * 6.67)}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  {[...Array(25)].map((_, j) => (
                    <div
                      key={j}
                      className="matrix-square"
                      style={{
                        animationDelay: `${j * 0.08 + Math.random() * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* VineMind Section Logo */}
          <div className="flex items-center justify-center py-5 mb-4 relative z-10">
            <img 
              src={vinemindSectionLogoPath}
              alt="VINEMIND"
              className="h-11 w-auto object-contain opacity-90"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-190px)] relative z-10">
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgentId(agent.id);
                    setIsAgentLoading(true);
                  }}
                  className={`group relative flex items-center space-x-3 p-3 rounded cursor-pointer transition-all duration-300 z-10 ${
                    selectedAgentId === agent.id
                      ? "bg-blue-500/20 border border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      : "bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={getAgentAvatarPath(agent)} 
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover"
                      style={hasCustomImageAvatar(agent) ? {} : { filter: 'hue-rotate(200deg) saturate(1.2)' }}
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-black ${
                      agent.status === "online" ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" : "bg-gray-400"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center">
                      <h3 className="text-white font-medium text-sm truncate tracking-wide">{agent.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Panel 2 - Agent Display (ID/Passport Terminal) */}
        <div className="w-[32%] bg-black border-2 border-white/60 backdrop-blur-sm relative overflow-hidden">
          
          {/* Scanning line animation */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60 animate-pulse"></div>
          
          {/* Agent NFT Button - Top Right Position */}
          {selectedAgent && (
            <div className="absolute top-4 right-4 z-20">
              <div className={`transition-opacity duration-500 ${
                showComponents.agentButton ? 'opacity-100' : 'opacity-0'
              }`}>
                <button className="bg-black border-2 border-white/80 px-3 py-1 text-white font-bold tracking-wider text-xs hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-200">
                  [ Agent NFT ]
                </button>
              </div>
            </div>
          )}
          
          {selectedAgent ? (
            <div className="h-full flex flex-col justify-start pt-2">
              {/* Agent Face GIF - Full vertical presence */}
              <div className="w-full flex justify-center flex-1">
                {isAgentLoading ? (
                  <div className="flex items-center justify-center h-full transition-opacity duration-500">
                    <div className="relative">
                      {/* Spinning ring loader */}
                      <div className="w-32 h-32 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                      {/* AI Logo in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                          src={aiLogoPath} 
                          alt="AI"
                          className="w-16 h-16 object-contain opacity-90"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="h-full flex items-center justify-center agent-gif-container"
                  >
                    {useVideoMode ? (
                      // Video rendering option for testing (currently disabled)
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`h-full object-contain transition-opacity duration-500 agent-gif-optimized ${
                          showComponents.agentGif ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ 
                          maxHeight: 'calc(100vh - 250px)',
                          width: 'auto',
                        }}
                      >
                        <source src={getAgentGifPath(selectedAgent)} type="video/mp4" />
                        {/* Fallback to GIF if video fails */}
                        <img src={getAgentGifPath(selectedAgent)} alt="Agent" />
                      </video>
                    ) : (
                      // Optimized GIF rendering (default)
                      <img 
                        src={getAgentGifPath(selectedAgent)} 
                        alt="Agent"
                        className={`h-full object-contain transition-opacity duration-500 agent-gif-optimized ${
                          showComponents.agentGif ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ 
                          maxHeight: 'calc(100vh - 250px)',
                          width: 'auto',
                        }}
                        loading="eager" // Disable lazy loading for immediate display
                        decoding="async" // Asynchronous decoding for better performance
                      />
                    )}
                  </div>
                )}
              </div>
              
              {/* Agent Info Panel - Compact bottom section */}
              <div className="mx-4 mb-4 bg-black/40 border border-white/30 p-3 space-y-2 backdrop-blur-sm">
                <div className={`transition-opacity duration-500 ${
                  showComponents.agentName ? 'opacity-100' : 'opacity-0'
                }`}>
                  <h2 className="text-white font-bold text-sm tracking-wider mb-0.5">NAME</h2>
                  <p className="text-yellow-400 text-base font-medium tracking-wide">{selectedAgent.name}</p>
                </div>
                <div className={`transition-opacity duration-500 ${
                  showComponents.agentDescription ? 'opacity-100' : 'opacity-0'
                }`}>
                  <h3 className="text-white font-bold text-sm tracking-wider mb-0.5">USE CASE</h3>
                  <p className="text-gray-300 text-xs">{selectedAgent.role}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 font-mono tracking-wider">SELECT AGENT TO INITIALIZE</p>
            </div>
          )}
        </div>

        {/* Panel 3 - Chat Area (Largest panel) */}
        <div className="flex-1 bg-black/40 border border-white/20 backdrop-blur-sm flex flex-col relative overflow-hidden">
          
          {/* VINEMIND Logo - Always visible background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
            <img 
              src={vinemindLogoPath} 
              alt="VINEMIND"
              className="w-96 h-auto opacity-80 select-none"
              onLoad={() => console.log('VINEMIND logo loaded successfully')}
              onError={(e) => console.error('VINEMIND logo failed to load:', e)}
            />
          </div>
          
          {selectedAgent ? (
            <>
              
              {/* Chat Area - Conversation History */}
              <ScrollArea className="flex-1 p-4 relative z-[10] bg-transparent">
                <div className="space-y-4">
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`relative max-w-[85%] ${message.role === "user" ? "mr-4" : "ml-4"}`}>
                        {/* Message Bubble */}
                        <div
                          className={`relative p-4 rounded-lg backdrop-blur-sm ${
                            message.role === "user"
                              ? "bg-white/25 text-white border border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                              : "bg-gray-800/95 text-white border border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <img 
                                  src={getAgentAvatarPath(selectedAgent!)} 
                                  alt={selectedAgent?.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-yellow-400 font-bold mb-1 tracking-wide">
                                  {selectedAgent?.name}
                                </div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs text-gray-400 mt-2 font-mono">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-xs text-blue-400 font-bold mb-1 tracking-wide">
                                You
                              </div>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className="text-xs text-gray-400 mt-2 font-mono">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {directAgentMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="relative max-w-[85%] ml-4">
                        <div className="relative p-4 rounded-lg backdrop-blur-sm bg-gray-800/95 text-white border border-white/30">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <img 
                                src={getAgentAvatarPath(selectedAgent!)} 
                                alt={selectedAgent?.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-yellow-400 font-bold tracking-wide">
                                {selectedAgent?.name}
                              </div>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {chatHistory.length === 0 && !directAgentMutation.isPending && (
                    <div className="text-center text-gray-400 font-mono text-sm mt-8">
                      Send a message to start conversation with {selectedAgent?.name}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Starter Questions Panel - GPT style */}
              {showStarterQuestions && chatHistory.length === 0 && !directAgentMutation.isPending && (
                <div className="px-4 py-3 border-t border-white/10 relative z-[20]">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {starterQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleStarterQuestion(question)}
                        className="bg-gray-800/80 hover:bg-gray-700/80 text-white/90 hover:text-white 
                                 border border-white/20 hover:border-white/40 
                                 px-3 py-2 rounded-lg text-sm font-mono
                                 transition-all duration-200 ease-in-out
                                 hover:scale-105 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]
                                 active:scale-95
                                 max-w-[280px] text-center leading-tight
                                 backdrop-blur-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input Panel */}
              <div className="p-4 bg-gray-900/60 border-t border-white/10 relative z-[20]">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  {/* Clear Chat Button */}
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-all duration-200 cursor-pointer focus:outline-none"
                    disabled={directAgentMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="ENTER MESSAGE..."
                    className="flex-1 bg-black/80 border-white/30 text-white placeholder-gray-500 font-mono text-sm focus:border-blue-400/60 focus:shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    disabled={directAgentMutation.isPending}
                  />
                  <Button 
                    type="submit"
                    className="bg-yellow-500/90 text-black hover:bg-blue-400 hover:text-white hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] px-4 transition-all duration-200"
                    disabled={directAgentMutation.isPending || !messageInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center relative z-[10]">
              <p className="text-gray-400 font-mono tracking-wider">INITIALIZE AGENT CONNECTION</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}