import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Workflows from "@/pages/workflows";
import Integrations from "@/pages/integrations";
import Templates from "@/pages/templates";
import Analytics from "@/pages/analytics";
import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { Menu, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

function AppHeader({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
  return (
    <header className="bg-card border-b border-border p-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="lg:hidden" 
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your workflow overview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="hidden md:flex" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuClose={() => setMobileMenuOpen(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          
          <main className="flex-1 overflow-y-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/workflows" component={Workflows} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/templates" component={Templates} />
              <Route path="/analytics" component={Analytics} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
