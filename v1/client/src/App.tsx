import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Domains from "@/pages/Domains";
import Agents from "@/pages/Agents";
import Wallet from "@/pages/Wallet";
import Settings from "@/pages/Settings";
import Analytics from "@/pages/Analytics";
import AgilityGate from "@/pages/AgilityGate";
import Services from "@/pages/Services";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="min-h-screen border-l border-r border-white/15 bg-black text-white w-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/agility" component={AgilityGate} />
          <Route path="/services" component={Services} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/domains" component={Domains} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/agents" component={Agents} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
