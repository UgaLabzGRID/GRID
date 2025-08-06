import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: string;
}

interface ChatMessage {
  id: number;
  message: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface ChatInterfaceProps {
  agent: Agent;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInterface({ 
  agent, 
  messages, 
  onSendMessage, 
  isLoading = false 
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      yellow: "from-yellow-400/30 to-yellow-600/30 ring-yellow-500/30",
      blue: "from-blue-400/30 to-blue-600/30 ring-blue-500/30",
      purple: "from-purple-400/30 to-purple-600/30 ring-purple-500/30",
      green: "from-green-400/30 to-green-600/30 ring-green-500/30",
      red: "from-red-400/30 to-red-600/30 ring-red-500/30",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.yellow;
  };

  const getTextColor = (color: string) => {
    const colorMap = {
      yellow: "text-yellow-300",
      blue: "text-blue-300",
      purple: "text-purple-300",
      green: "text-green-300",
      red: "text-red-300",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.yellow;
  };

  return (
    <main className="flex-1 flex flex-col bg-black">
      {/* Agent Header */}
      <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border-b border-yellow-500/20 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(agent.color)} rounded-full flex items-center justify-center ring-4 animate-pulse-slow`}>
              <span className={`${getTextColor(agent.color)} font-bold text-lg`}>
                {agent.avatar}
              </span>
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
              agent.status === "online" ? "bg-green-400 animate-pulse" : "bg-gray-400"
            }`}></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{agent.name}</h2>
            <p className="text-gray-300">{agent.role}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex space-x-3 ${message.sender === "user" ? "justify-end" : ""}`}
              >
                {message.sender === "agent" && (
                  <div className={`w-8 h-8 bg-gradient-to-br ${getColorClasses(agent.color)} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className={`${getTextColor(agent.color)} font-bold text-xs`}>
                      {agent.avatar}
                    </span>
                  </div>
                )}
                
                <div className={`flex-1 ${message.sender === "user" ? "max-w-xs lg:max-w-md" : ""}`}>
                  <div className={`p-4 rounded-2xl ${
                    message.sender === "agent" 
                      ? "bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-tl-sm" 
                      : "bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-tr-sm"
                  }`}>
                    <p className={message.sender === "agent" ? "text-white" : "text-black"}>
                      {message.message}
                    </p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${
                    message.sender === "user" ? "text-right mr-4" : "ml-4"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">U</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border-t border-yellow-500/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4 items-end">
            <div className="flex-1">
              <Textarea 
                placeholder="Type your message..." 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-yellow-500 text-black hover:bg-yellow-400 font-medium flex items-center space-x-2 px-6 py-3 h-auto"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
