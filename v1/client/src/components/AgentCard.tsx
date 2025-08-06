import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Agent {
  id: number;
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: string;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AgentCard({ 
  agent, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}: AgentCardProps) {
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
    <Card 
      className={`cursor-pointer p-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border transition-all group hover:border-yellow-500/40 ${
        isSelected ? "border-yellow-500/50 bg-yellow-500/10" : "border-white/10"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${getColorClasses(agent.color)} rounded-full flex items-center justify-center ring-2 group-hover:ring-opacity-50 transition-all`}>
          <span className={`${getTextColor(agent.color)} font-bold text-sm`}>
            {agent.avatar}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{agent.name}</h3>
          <p className="text-gray-400 text-xs">{agent.role}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            agent.status === "online" ? "bg-green-400 animate-pulse" : "bg-gray-400"
          }`}></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEdit}>Edit Agent</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400">
                Delete Agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
