import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Send, Download, TrendingUp, TrendingDown } from "lucide-react";
import xrpLogoPath from "@assets/16_1751901233689.png";
import adaLogoPath from "@assets/17_1751901235401.png";
import nightLogoPath from "@assets/18_1751901236989.png";

export default function WalletPage() {
  const tokens = [
    {
      symbol: "XRP",
      name: "XRP Ledger",
      balance: "2,847.52",
      usdValue: "$1,563.21",
      change: "+2.4%",
      changePositive: true,
      color: "text-blue-400",
      logo: xrpLogoPath
    },
    {
      symbol: "ADA", 
      name: "Cardano",
      balance: "125.89",
      usdValue: "$45.67",
      change: "-1.2%",
      changePositive: false,
      color: "text-purple-400",
      logo: adaLogoPath
    },
    {
      symbol: "NIGHT",
      name: "Midnight",
      balance: "89.14",
      usdValue: "$267.42",
      change: "+5.7%", 
      changePositive: true,
      color: "text-indigo-400",
      logo: nightLogoPath
    }
  ];

  const totalBalance = "3,280 XRP";
  const totalUsdValue = "$1,876.30";

  return (
    <div className="pt-16 flex h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-black p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Wallet</h1>
            <p className="text-gray-300 mt-1">Manage your digital assets</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Connected
            </Badge>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" />
            </div>
          </div>
        </div>

        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">{totalBalance}</h2>
              <p className="text-xl text-gray-300">{totalUsdValue}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button className="bg-yellow-500 text-black hover:bg-yellow-400 transition-all h-14 text-lg font-semibold">
            <Send className="w-5 h-5 mr-2" />
            Send Payment
          </Button>
          <Button className="bg-black text-white border border-yellow-500 hover:bg-yellow-500/10 hover:shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all h-14 text-lg font-semibold">
            <Download className="w-5 h-5 mr-2" />
            Receive Payment
          </Button>
        </div>

        {/* Token List */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-white">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tokens.map((token) => (
                <div 
                  key={token.symbol}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-yellow-500/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center p-2">
                      <img 
                        src={token.logo} 
                        alt={token.symbol} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{token.symbol}</h3>
                      <p className="text-gray-400 text-sm">{token.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-semibold">{token.balance}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-400 text-sm">{token.usdValue}</p>
                      <div className={`flex items-center space-x-1 ${
                        token.changePositive ? "text-green-400" : "text-red-400"
                      }`}>
                        {token.changePositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="text-xs">{token.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}