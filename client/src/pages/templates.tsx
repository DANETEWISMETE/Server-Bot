import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowTemplate } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus,
  Layers,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";

export default function Templates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery<WorkflowTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const createFromTemplateMutation = useMutation({
    mutationFn: async (template: WorkflowTemplate) => {
      const response = await apiRequest("POST", "/api/workflows", {
        name: `${template.name} (Copy)`,
        description: template.description,
        nodes: template.nodes,
        connections: template.connections,
        isActive: false
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      toast({
        title: "Workflow Created",
        description: "A new workflow has been created from the template.",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create workflow from template.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Templates</h1>
            <p className="text-muted-foreground">Pre-built workflows to get you started quickly</p>
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

  const popularTemplates = templates?.filter(t => t.isPopular) || [];
  const otherTemplates = templates?.filter(t => !t.isPopular) || [];

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'image_processing':
        return <TrendingUp className="h-6 w-6 text-white" />;
      case 'social_media':
        return <Zap className="h-6 w-6 text-white" />;
      case 'video_processing':
        return <Star className="h-6 w-6 text-white" />;
      default:
        return <Layers className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Pre-built workflows to get you started quickly</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Popular Templates */}
      {popularTemplates.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Popular Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map((template) => (
              <Card key={template.id} className="hover:border-primary transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      {getTemplateIcon(template.category)}
                    </div>
                    <Badge variant="secondary" className="text-yellow-600 bg-yellow-100">
                      Popular
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {template.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                    variant="outline"
                    onClick={() => createFromTemplateMutation.mutate(template)}
                    disabled={createFromTemplateMutation.isPending}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          All Templates ({templates?.length || 0})
        </h2>
        {otherTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherTemplates.map((template) => (
              <Card key={template.id} className="hover:border-primary transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      {getTemplateIcon(template.category)}
                    </div>
                    <Badge variant="outline">
                      {template.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {template.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                    variant="outline"
                    onClick={() => createFromTemplateMutation.mutate(template)}
                    disabled={createFromTemplateMutation.isPending}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Layers className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first template to share workflows with others
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
