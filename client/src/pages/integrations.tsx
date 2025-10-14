import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Integration } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Settings, 
  Plug,
  PowerOff
} from "lucide-react";

export default function Integrations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: integrations, isLoading } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const toggleConnectionMutation = useMutation({
    mutationFn: async ({ id, isConnected }: { id: number; isConnected: boolean }) => {
      const response = await apiRequest("PUT", `/api/integrations/${id}`, { 
        isConnected: !isConnected 
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: variables.isConnected ? "Integration Disconnected" : "Integration Connected",
        description: `The integration has been ${variables.isConnected ? 'disconnected' : 'connected'} successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to update the integration connection.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integrations</h1>
            <p className="text-muted-foreground">Connect your favorite creative tools</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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

  const connectedIntegrations = integrations?.filter(i => i.isConnected) || [];
  const availableIntegrations = integrations?.filter(i => !i.isConnected) || [];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite creative tools</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Connected Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Connected Apps ({connectedIntegrations.length})</h2>
        {connectedIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {integration.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">
                          {integration.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-success bg-success/10">
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleConnectionMutation.mutate({
                        id: integration.id,
                        isConnected: integration.isConnected
                      })}
                      disabled={toggleConnectionMutation.isPending}
                    >
                      <PowerOff className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Plug className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No connected integrations</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Apps ({availableIntegrations.length})</h2>
        {availableIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground font-bold text-lg">
                          {integration.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">
                          {integration.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    size="sm"
                    onClick={() => toggleConnectionMutation.mutate({
                      id: integration.id,
                      isConnected: integration.isConnected
                    })}
                    disabled={toggleConnectionMutation.isPending}
                  >
                    <Plug className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Plug className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">All available integrations are connected</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
