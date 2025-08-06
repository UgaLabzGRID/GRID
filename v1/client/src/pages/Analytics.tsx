import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Shield, Globe, DollarSign } from "lucide-react";

export default function Analytics() {
  // Mock data for analytics
  const monthlyData = [
    { month: "Jan", sent: 2400, received: 1800 },
    { month: "Feb", sent: 1900, received: 2200 },
    { month: "Mar", sent: 3200, received: 2800 },
    { month: "Apr", sent: 2800, received: 3100 },
    { month: "May", sent: 3600, received: 2900 },
    { month: "Jun", sent: 4200, received: 3800 }
  ];

  const topDomains = [
    { domain: "business.web3", transactions: 45, value: "$12,450" },
    { domain: "alice.crypto", transactions: 32, value: "$8,920" },
    { domain: "supplier.dao", transactions: 28, value: "$6,780" },
    { domain: "friend.web3", transactions: 21, value: "$4,320" },
    { domain: "vendor.crypto", transactions: 18, value: "$3,150" }
  ];

  const privacyScoreHistory = [
    { month: "Jan", score: 85 },
    { month: "Feb", score: 88 },
    { month: "Mar", score: 90 },
    { month: "Apr", score: 91 },
    { month: "May", score: 92 },
    { month: "Jun", score: 92 }
  ];

  return (
    <div className="pt-16 flex h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-black p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-300 mt-1">Comprehensive insights into your payment activity</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold text-white">$47,890</p>
                  <p className="text-green-400 text-sm">+12.5% this month</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Transactions</p>
                  <p className="text-2xl font-bold text-white">342</p>
                  <p className="text-green-400 text-sm">+8.2% this month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Privacy Score</p>
                  <p className="text-2xl font-bold text-white">92</p>
                  <p className="text-yellow-400 text-sm">Excellent</p>
                </div>
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Domains</p>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-blue-400 text-sm">3 new this month</p>
                </div>
                <Globe className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Volume Chart */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white">Monthly Transaction Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-300 w-8">{data.month}</span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-700 rounded">
                            <div 
                              className="h-2 bg-green-400 rounded" 
                              style={{ width: `${(data.sent / 5000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-green-400 text-sm">${data.sent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-700 rounded">
                            <div 
                              className="h-2 bg-blue-400 rounded" 
                              style={{ width: `${(data.received / 5000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-blue-400 text-sm">${data.received.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-sm mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-gray-300">Sent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span className="text-gray-300">Received</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Score Trend */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white">Privacy Score Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privacyScoreHistory.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300 w-8">{data.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full h-4 bg-gray-700 rounded">
                        <div 
                          className="h-4 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded" 
                          style={{ width: `${data.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-semibold w-8">{data.score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 5 Domains */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white">Top 5 Domains Interacted With</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDomains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-yellow-400 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{domain.domain}</p>
                        <p className="text-gray-400 text-sm">{domain.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{domain.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Domain Valuation History (Coming Soon) */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white">Domain Valuation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Coming Soon</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Domain valuation tracking will be available when market data becomes accessible.
                </p>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Under Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}