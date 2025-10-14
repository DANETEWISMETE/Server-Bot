import { useState, useCallback } from "react";
import WorkflowNode from "./workflow-node";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Node {
  id: string;
  type: 'trigger' | 'action' | 'output';
  name: string;
  app: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

const initialNodes: Node[] = [
  { id: "1", type: "trigger", name: "New File Upload", app: "Google Drive", x: 100, y: 100 },
  { id: "2", type: "action", name: "Optimize Image", app: "Photoshop", x: 400, y: 100 },
  { id: "3", type: "action", name: "Share to Team", app: "Slack", x: 700, y: 100 },
  { id: "4", type: "output", name: "Workflow Complete", app: "", x: 1000, y: 100 }
];

const initialConnections: Connection[] = [
  { from: "1", to: "2" },
  { from: "2", to: "3" },
  { from: "3", to: "4" }
];

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);

  const getConnectionPath = useCallback((from: Node, to: Node) => {
    const fromX = from.x + 192; // Node width
    const fromY = from.y + 60; // Half node height
    const toX = to.x;
    const toY = to.y + 60;
    
    const midX = fromX + (toX - fromX) / 2;
    
    return `M ${fromX} ${fromY} Q ${midX} ${fromY}, ${toX} ${toY}`;
  }, []);

  const addNode = () => {
    const newNode: Node = {
      id: String(nodes.length + 1),
      type: "action",
      name: "New Action",
      app: "Select App",
      x: 400 + nodes.length * 100,
      y: 200,
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="p-8 bg-muted/30 min-h-[500px] relative overflow-auto">
      {/* SVG for connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <path
              key={index}
              d={getConnectionPath(fromNode, toNode)}
              className="connection-line"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          );
        })}
      </svg>
      
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{ left: node.x, top: node.y }}
          >
            <WorkflowNode node={node} />
          </div>
        ))}
        
        {/* Add Node Button */}
        <Button
          onClick={addNode}
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
