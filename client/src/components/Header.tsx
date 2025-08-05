import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wallet, Book } from "lucide-react";
import { SiX } from "react-icons/si";
import gridLogoPath from "@assets/erwg_1751978812200.png";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 p-3">
      {/* Full border box wrapper around entire navbar - Webring style */}
      <div className="w-full border border-white/20 bg-black px-3 py-2 flex items-center justify-between rounded-sm">
        
        {/* Left side: GRID Logo + Navigation Menu */}
        <div className="flex items-center gap-6">
          {/* GRID Logo (Home Button) */}
          <Link href="/" className="inline-block hover:border-b hover:border-white hover:drop-shadow-[0_0_4px_#ffffff] transition-all duration-150 ease-in-out">
            <img 
              src={gridLogoPath} 
              alt="GRID"
              className="h-8 w-auto object-contain cursor-pointer"
            />
          </Link>
          
          {/* Navigation Menu */}
          <nav className="flex items-center gap-6">
            <Link href="/agility" className={`font-semibold transition-all duration-150 ease-in-out hover:border-b hover:border-white hover:drop-shadow-[0_0_4px_#ffffff] ${location === "/agility" ? "text-white border-b border-white drop-shadow-[0_0_4px_#ffffff]" : "text-gray-300 hover:text-white"}`}>
              Agility
            </Link>
            <Link href="/services" className={`font-semibold transition-all duration-150 ease-in-out hover:border-b hover:border-white hover:drop-shadow-[0_0_4px_#ffffff] ${location === "/services" ? "text-white border-b border-white drop-shadow-[0_0_4px_#ffffff]" : "text-gray-300 hover:text-white"}`}>
              Services
            </Link>
            <Link href="/agents" className={`font-semibold transition-all duration-150 ease-in-out hover:border-b hover:border-white hover:drop-shadow-[0_0_4px_#ffffff] ${location === "/agents" ? "text-white border-b border-white drop-shadow-[0_0_4px_#ffffff]" : "text-gray-300 hover:text-white"}`}>
              VineMind
            </Link>
          </nav>
        </div>
        
        {/* Right side buttons */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {/* X.com Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="https://x.com/GridXRPL" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-transparent text-white border-[0.5px] border-white/70 hover:bg-white/10 hover:shadow-[0_0_8px_rgba(255,255,255,0.6)] px-3 py-2 rounded-md transition-all duration-200 flex items-center justify-center"
                >
                  <SiX className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black border border-white/30 text-white px-3 py-2 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                Follow us on X
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Docs Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-transparent text-white border-[0.5px] border-white/70 hover:bg-white/10 hover:shadow-[0_0_8px_rgba(255,255,255,0.6)] font-medium text-sm px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Docs
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black border border-white/30 text-white px-3 py-2 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                Documentation
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Connect Wallet */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-transparent text-white border-[0.5px] border-white/70 hover:bg-white/10 hover:shadow-[0_0_8px_rgba(255,255,255,0.6)] font-medium text-sm px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-black border border-white/30 text-white px-3 py-2 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                Coming Soon
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
