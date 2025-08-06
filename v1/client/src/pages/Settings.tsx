import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="pt-16 flex h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-black p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-300 mt-1">Manage your account and preferences</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-black" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Profile Settings */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input 
                  id="username"
                  value="agility_user_2024"
                  readOnly
                  className="bg-white/5 border-white/10 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input 
                  id="email"
                  value="user@agilityapp.com"
                  readOnly
                  className="bg-white/5 border-white/10 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">KYC Status</Label>
                <div className="mt-1">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Verified
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Preferences */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Theme</Label>
                  <p className="text-gray-400 text-sm">Choose your interface theme</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Light</span>
                  <Switch className="data-[state=checked]:bg-yellow-500" />
                  <span className="text-white text-sm">Dark</span>
                </div>
              </div>
              
              <div>
                <Label className="text-white">Notification Preferences</Label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="transaction-alerts"
                      className="border-white/20 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                    />
                    <Label htmlFor="transaction-alerts" className="text-gray-300">
                      Transaction Alerts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="privacy-alerts"
                      className="border-white/20 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                    />
                    <Label htmlFor="privacy-alerts" className="text-gray-300">
                      Privacy Alerts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="updates"
                      className="border-white/20 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                    />
                    <Label htmlFor="updates" className="text-gray-300">
                      Updates
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Security */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Two-Factor Authentication</Label>
                  <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                </div>
                <Switch className="data-[state=checked]:bg-yellow-500" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Backup Keys</Label>
                  <p className="text-gray-400 text-sm">Download recovery keys for your wallet</p>
                </div>
                <Button 
                  disabled
                  className="bg-gray-600 text-gray-400 cursor-not-allowed"
                >
                  Download Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}