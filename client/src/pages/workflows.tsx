import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Workflow } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Plus,
  GitBranch,
  Clock
} from "lucide-react";

export default function Workflows() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: workflows, isLoading } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
  });

  const executeWorkflowMutation = useMutation({
    mutationFn: async (workflowId: number) => {
      const response = await apiRequest("POST", `/api/workflows/${workflowId}/execute`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/executions"] });
      toast({
        title: "Workflow Executed",
        description: "The workflow has been started successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Execution Failed",
        description: "Failed to execute the workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/workflows/${id}`, { isActive: !isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      toast({
        title: "Workflow Updated",
        description: "The workflow status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update the workflow status.",
        variant: "destructive",
      });
    },
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/workflows/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      toast({
        title: "Workflow Deleted",
        description: "The workflow has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the workflow.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Workflows</h1>
            <p className="text-muted-foreground">Manage your automation workflows</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your automation workflows</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {workflows && workflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    {workflow.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {workflow.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={workflow.isActive ? "default" : "secondary"}>
                    {workflow.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {Array.isArray(workflow.nodes) ? workflow.nodes.length : 0} nodes
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => executeWorkflowMutation.mutate(workflow.id)}
                    disabled={!workflow.isActive || executeWorkflowMutation.isPending}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Execute
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWorkflowMutation.mutate({ 
                      id: workflow.id, 
                      isActive: workflow.isActive 
                    })}
                    disabled={toggleWorkflowMutation.isPending}
                  >
                    {workflow.isActive ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteWorkflowMutation.mutate(workflow.id)}
                    disabled={deleteWorkflowMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first workflow to get started with automation
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
