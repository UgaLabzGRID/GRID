import { Link, useLocation } from "wouter";
import { Home, CreditCard, Send, Shield, Settings, BarChart3 } from "lucide-react";
import agilityLogoPath from "@assets/LOGOTIPO_1752048692652.png";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/wallet", icon: CreditCard, label: "Wallet" },
    { href: "/domains", icon: Shield, label: "Domains & Privacy" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-gray-900/50 border-r border-white/20 backdrop-blur-md">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-white/30 p-1">
            <img 
              src={agilityLogoPath} 
              alt="AGILITY" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-white">Agility</h2>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-white/20 text-white border border-white/30" 
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
