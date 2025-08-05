import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Shield, Star, ShoppingCart, TrendingUp } from "lucide-react";

export default function Domains() {
  const [listForSale, setListForSale] = useState(false);
  const [acceptOffers, setAcceptOffers] = useState(false);

  return (
    <div className="pt-16 flex h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-black p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Web3 Domain Management</h1>
          <p className="text-gray-300">Manage your NFT-based Web3 domains with enhanced privacy features</p>
        </div>

        {/* Domain Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white">Owned Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">3</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">$150</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white">Privacy Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">A+</p>
            </CardContent>
          </Card>
        </div>

        {/* Mint New Domain */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Mint New Web3 Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Input 
                placeholder="Enter domain name" 
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-500"
              />
              <Select>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white focus:border-yellow-500">
                  <SelectValue placeholder="TLD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=".web3">.web3</SelectItem>
                  <SelectItem value=".crypto">.crypto</SelectItem>
                  <SelectItem value=".dao">.dao</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400 font-medium">
                Check & Mint
              </Button>
            </div>
            <p className="text-sm text-gray-400">NFT-based ownership with privacy benefits via zero-knowledge proofs</p>
          </CardContent>
        </Card>

        {/* Domain Management Tabs */}
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
            <TabsTrigger 
              value="owned" 
              className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
            >
              Your Domains
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              disabled
            >
              Marketplace (Coming Soon)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owned" className="mt-6">
            {/* Owned Domains Table */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-white">Your Domains</CardTitle>
              </CardHeader>
              <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 text-gray-300">Domain</th>
                    <th className="text-left py-3 text-gray-300">Status</th>
                    <th className="text-left py-3 text-gray-300">Minted</th>
                    <th className="text-left py-3 text-gray-300">Value</th>
                    <th className="text-left py-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-white font-medium">myname.web3</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                    </td>
                    <td className="py-4 text-gray-300">Dec 15, 2023</td>
                    <td className="py-4 text-white">$50</td>
                    <td className="py-4">
                      <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 text-sm">
                        Manage
                      </Button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-white font-medium">alice.crypto</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                    </td>
                    <td className="py-4 text-gray-300">Nov 28, 2023</td>
                    <td className="py-4 text-white">$75</td>
                    <td className="py-4">
                      <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 text-sm">
                        Manage
                      </Button>
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-white font-medium">company.dao</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
                    </td>
                    <td className="py-4 text-gray-300">Dec 20, 2023</td>
                    <td className="py-4 text-white">$25</td>
                    <td className="py-4">
                      <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 text-sm">
                        Manage
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6">
            {/* Domain Marketplace - Coming Soon */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Domain Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-10 h-10 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Marketplace Coming Soon</h3>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    Buy and sell Web3 domains with enhanced privacy features. The marketplace will support instant transactions and zero-knowledge proof verification.
                  </p>

                  {/* Placeholder Controls */}
                  <div className="max-w-md mx-auto space-y-6 mb-8">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-left">
                        <Label className="text-white font-medium">List Domain for Sale</Label>
                        <p className="text-gray-400 text-sm">Enable selling of your domains</p>
                      </div>
                      <Switch 
                        checked={listForSale} 
                        onCheckedChange={setListForSale}
                        disabled
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-left">
                        <Label className="text-white font-medium">Accept Offers</Label>
                        <p className="text-gray-400 text-sm">Allow offers on your domains</p>
                      </div>
                      <Switch 
                        checked={acceptOffers} 
                        onCheckedChange={setAcceptOffers}
                        disabled
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                  </div>

                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
                    Under Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
}
