import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, DollarSign, Shield, Activity, Eye, EyeOff, Plus, Filter, User, MessageSquare, Brain } from "lucide-react";

export default function Dashboard() {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7d");
  const [quickSendOpen, setQuickSendOpen] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // Mock data for profiles
  const domainProfiles = [
    {
      domain: "user@domain.web3",
      avatar: "🏢",
      nickname: "Business Partner",
      tags: ["Vendor", "Trusted"],
      notes: "Regular supplier for office equipment"
    },
    {
      domain: "alice.crypto",
      avatar: "👩",
      nickname: "Alice",
      tags: ["Friend", "Personal"],
      notes: "College friend, monthly dinner payments"
    }
  ];

  // Keyboard shortcut for privacy mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'P') {
        setPrivacyMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const maskValue = (value: string) => privacyMode ? "••••••" : value;
  const blurClass = privacyMode ? "blur-sm" : "";

  return (
    <div className="pt-16 flex h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-black p-8 overflow-y-auto relative">
        {/* Top Bar with Privacy Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
            <p className="text-gray-300 mt-1">Monitor your payments and privacy metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Privacy Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="privacy-mode" className="text-gray-300 text-sm">Privacy Mode</Label>
              <Switch
                id="privacy-mode"
                checked={privacyMode}
                onCheckedChange={setPrivacyMode}
                className="data-[state=checked]:bg-yellow-500"
              />
              {privacyMode ? <EyeOff className="w-4 h-4 text-yellow-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              KYC Verified
            </Badge>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-black font-semibold text-sm">U</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Transaction Summary */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Transaction Summary</span>
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Sent</p>
                  <p className="text-2xl font-bold text-white">{maskValue("$12,450")}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Received</p>
                  <p className="text-2xl font-bold text-white">{maskValue("$8,920")}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-lg font-semibold text-yellow-400">{maskValue("+$2,340")}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Transactions</p>
                  <p className="text-lg font-semibold text-white">147</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Score */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Privacy Score</span>
                <Shield className="w-6 h-6 text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700"/>
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" className="text-yellow-400" strokeDasharray="251.2" strokeDashoffset="62.8"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">92</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">Excellent privacy protection</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity with Filters */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <div className="flex items-center space-x-3">
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="domains">Domains</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-24 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7d</SelectItem>
                    <SelectItem value="30d">30d</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Payment Sent</p>
                    <p className={`text-gray-400 text-sm ${blurClass}`}>To: user@domain.web3</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-yellow-400 hover:text-yellow-300"
                        onClick={() => setSelectedProfile(domainProfiles[0])}
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <div className="text-right">
                    <p className="text-white font-semibold">{maskValue("-$250.00")}</p>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Payment Received</p>
                    <p className={`text-gray-400 text-sm ${blurClass}`}>From: alice@crypto.web3</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-yellow-400 hover:text-yellow-300"
                        onClick={() => setSelectedProfile(domainProfiles[1])}
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">{maskValue("+$500.00")}</p>
                    <p className="text-gray-400 text-sm">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Send FAB */}
        <Dialog open={quickSendOpen} onOpenChange={setQuickSendOpen}>
          <DialogTrigger asChild>
            <Button 
              className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg hover:shadow-xl transition-all duration-200"
              size="sm"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-yellow-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Quick Send</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-gray-300">Recipient</Label>
                <Input 
                  id="recipient"
                  placeholder="wallet address or domain.web3"
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                  <Input 
                    id="amount"
                    placeholder="0.00"
                    className="bg-white/10 border-white/20 text-white mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-gray-300">Currency</Label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                      <SelectValue placeholder="XRP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xrp">XRP</SelectItem>
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="ilp">ILP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="note" className="text-gray-300">Note (Optional)</Label>
                <Textarea 
                  id="note"
                  placeholder="Payment description..."
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium">
                Send Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* VineMind Agent Integration */}
        <Dialog open={agentModalOpen} onOpenChange={setAgentModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className="fixed bottom-8 right-24 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg"
              variant="outline"
            >
              <Brain className="w-4 h-4 mr-2" />
              Ask VineMind
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-purple-500/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-purple-400 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                VineMind Assistant
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                <p className="text-gray-300 text-sm mb-3">How can I help you today?</p>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-purple-500/20">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Explain my last transaction
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-purple-500/20">
                    <Activity className="w-4 h-4 mr-2" />
                    Generate payment request link
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-purple-500/20">
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy & security advice
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-purple-500/20">
                    <User className="w-4 h-4 mr-2" />
                    KYC compliance check
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Modal */}
        <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
          <DialogContent className="bg-gray-900 border-yellow-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Domain Profile</DialogTitle>
            </DialogHeader>
            {selectedProfile && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl">
                    {selectedProfile.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{selectedProfile.nickname}</h3>
                    <p className="text-gray-400">{selectedProfile.domain}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Tags</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedProfile.tags.map((tag: string, index: number) => (
                      <Badge key={index} className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Notes</Label>
                  <Textarea 
                    value={selectedProfile.notes}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    readOnly
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
