import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, 
  Play, 
  CheckCircle, 
  Clock,
  Save,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import WorkflowBuilder from "@/components/workflow-builder";
import AnalyticsChart from "@/components/analytics-chart";
import { AnalyticsData, Integration, WorkflowExecution, WorkflowTemplate } from "@shared/schema";

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  const { data: integrations } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const { data: templates } = useQuery<WorkflowTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const { data: recentExecutions } = useQuery<WorkflowExecution[]>({
    queryKey: ["/api/executions"],
  });

  if (analyticsLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="secondary" className="text-success bg-success/10">
                +12%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics?.activeWorkflows || 0}</h3>
            <p className="text-sm text-muted-foreground">Active Workflows</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Play className="h-6 w-6 text-secondary" />
              </div>
              <Badge variant="secondary" className="text-success bg-success/10">
                +8%
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics?.todayExecutions || 0}</h3>
            <p className="text-sm text-muted-foreground">Executions Today</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <Badge variant="secondary" className="text-success bg-success/10">
                {analytics?.successRate ? `${analytics.successRate.toFixed(1)}%` : '0%'}
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {analytics?.successRate ? `${analytics.successRate.toFixed(1)}%` : '0%'}
            </h3>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-destructive" />
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                -3s
              </Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {analytics?.avgExecutionTime ? `${analytics.avgExecutionTime.toFixed(1)}s` : '0s'}
            </h3>
            <p className="text-sm text-muted-foreground">Avg. Execution Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Builder Section */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Workflow Builder</CardTitle>
              <p className="text-sm text-muted-foreground">Create and manage your automation workflows</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Test Run
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <WorkflowBuilder />
        </CardContent>
      </Card>

      {/* Analytics and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Workflow Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Last 7 days execution trends</p>
              </div>
              <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics?.executionTrend || []} />
            
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-success">
                  {analytics?.executionTrend?.reduce((sum, day) => sum + day.successful, 0) || 0}
                </p>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {analytics?.executionTrend?.reduce((sum, day) => sum + day.failed, 0) || 0}
                </p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">0</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Latest workflow executions</p>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.recentActivity?.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-success/10' :
                    activity.status === 'failed' ? 'bg-destructive/10' :
                    'bg-primary/10'
                  }`}>
                    {activity.status === 'success' && <CheckCircle className="h-5 w-5 text-success" />}
                    {activity.status === 'failed' && <X className="h-5 w-5 text-destructive" />}
                    {activity.status === 'running' && <Clock className="h-5 w-5 text-primary animate-spin" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.workflowName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.executedAt).toRelativeTimeString()}
                    </p>
                  </div>
                  <Badge 
                    variant={activity.status === 'success' ? 'secondary' : 
                            activity.status === 'failed' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </Badge>
                </div>
              )) || (
                <div className="text-center text-muted-foreground py-8">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Connected Integrations</CardTitle>
              <p className="text-sm text-muted-foreground">Apps currently connected to your workflows</p>
            </div>
            <Button variant="outline" size="sm">
              <ArrowRight className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrations?.map((integration) => (
              <div 
                key={integration.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {integration.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{integration.name}</p>
                  <p className="text-xs text-muted-foreground">{integration.type.replace('_', ' ')}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${integration.isConnected ? 'bg-success' : 'bg-muted'}`}></div>
              </div>
            )) || (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No integrations connected
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Workflow Templates</CardTitle>
              <p className="text-sm text-muted-foreground">Pre-built workflows to get you started quickly</p>
            </div>
            <Button variant="ghost" size="sm">
              Browse All Templates
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates?.slice(0, 3).map((template) => (
              <Card key={template.id} className="hover:border-primary transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    {template.isPopular && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                  <h4 className="font-semibold mb-2">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {template.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                    variant="outline"
                    size="sm"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No templates available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
