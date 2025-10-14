import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Image, 
  MessageSquare, 
  CheckCircle,
  Settings,
  Users,
  BarChart3,
  Folder
} from "lucide-react";

interface Node {
  id: string;
  type: 'trigger' | 'action' | 'output';
  name: string;
  app: string;
  x: number;
  y: number;
}

interface WorkflowNodeProps {
  node: Node;
}

const getNodeIcon = (app: string, type: string) => {
  switch (app.toLowerCase()) {
    case 'google drive':
      return <Folder className="h-5 w-5" />;
    case 'photoshop':
      return <Image className="h-5 w-5" />;
    case 'slack':
      return <MessageSquare className="h-5 w-5" />;
    default:
      if (type === 'trigger') return <Zap className="h-5 w-5" />;
      if (type === 'output') return <CheckCircle className="h-5 w-5" />;
      return <Settings className="h-5 w-5" />;
  }
};

const getNodeColor = (type: string) => {
  switch (type) {
    case 'trigger':
      return 'border-primary bg-primary/5';
    case 'action':
      return 'border-border bg-card';
    case 'output':
      return 'border-border bg-card';
    default:
      return 'border-border bg-card';
  }
};

const getIconBgColor = (app: string, type: string) => {
  if (type === 'trigger') return 'bg-primary text-primary-foreground';
  
  switch (app.toLowerCase()) {
    case 'photoshop':
      return 'bg-secondary/10 text-secondary';
    case 'slack':
      return 'bg-accent/10 text-accent';
    case 'google drive':
      return 'bg-primary/10 text-primary';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function WorkflowNode({ node }: WorkflowNodeProps) {
  const isActive = node.type === 'trigger';

  return (
    <div className={`workflow-node rounded-lg border-2 p-4 w-48 shadow-md ${getNodeColor(node.type)}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBgColor(node.app, node.type)}`}>
          {getNodeIcon(node.app, node.type)}
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
          <p className="font-semibold text-sm">{node.name}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{node.app}</span>
        </div>
        
        {node.type === 'trigger' && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-success bg-success/10">
              Active
            </Badge>
            {isActive && <div className="w-2 h-2 bg-success rounded-full pulse"></div>}
          </div>
        )}
        
        {node.type === 'action' && (
          <div className="text-xs text-muted-foreground">
            <Settings className="inline h-3 w-3 mr-1" />
            Settings configured
          </div>
        )}
        
        {node.type === 'output' && (
          <>
            <div className="text-xs text-muted-foreground">
              <BarChart3 className="inline h-3 w-3 mr-1" />
              Track metrics
            </div>
            <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              Last run: 2 min ago
            </div>
          </>
        )}
      </div>
    </div>
  );
}
