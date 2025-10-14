import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  GitBranch, 
  Puzzle, 
  Layers, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Zap,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Workflows", href: "/workflows", icon: GitBranch },
  { name: "Integrations", href: "/integrations", icon: Puzzle },
  { name: "Templates", href: "/templates", icon: Layers },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
];

export default function Sidebar({ mobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const [location] = useLocation();

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">FlowCraft</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden"
          onClick={onMobileMenuClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => onMobileMenuClose()}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-border space-y-2">
          {secondaryNavigation.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => onMobileMenuClose()}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Jane Designer</p>
            <p className="text-xs text-muted-foreground">jane@creative.co</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-card border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={onMobileMenuClose}>
          <aside 
            className="bg-card w-64 h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
