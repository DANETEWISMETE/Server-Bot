import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnalyticsChart from "@/components/analytics-chart";
import { AnalyticsData } from "@shared/schema";
import { 
  GitBranch, 
  Play, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertCircle,
  BarChart3
} from "lucide-react";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your workflow performance and usage</p>
          </div>
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your workflow performance and usage</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics?.totalWorkflows || 0}</h3>
            <p className="text-sm text-muted-foreground">Total Workflows</p>
            <p className="text-xs text-success mt-1">{analytics?.activeWorkflows || 0} active</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Play className="h-6 w-6 text-secondary" />
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics?.totalExecutions || 0}</h3>
            <p className="text-sm text-muted-foreground">Total Executions</p>
            <p className="text-xs text-success mt-1">{analytics?.todayExecutions || 0} today</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
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
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {analytics?.avgExecutionTime ? `${analytics.avgExecutionTime.toFixed(1)}s` : '0s'}
            </h3>
            <p className="text-sm text-muted-foreground">Avg. Execution Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Execution Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Execution Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Daily workflow execution activity</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={analytics?.executionTrend || []} />
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {analytics?.executionTrend?.reduce((sum, day) => sum + day.successful, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Successful Executions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {analytics?.executionTrend?.reduce((sum, day) => sum + day.failed, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Failed Executions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {((analytics?.executionTrend?.reduce((sum, day) => sum + day.successful, 0) || 0) / 
                    Math.max(1, (analytics?.executionTrend?.reduce((sum, day) => sum + day.successful + day.failed, 0) || 0)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate (7 days)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Execution Activity</CardTitle>
          <p className="text-sm text-muted-foreground">Latest workflow execution logs</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.recentActivity?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-success/10' :
                  activity.status === 'failed' ? 'bg-destructive/10' :
                  'bg-primary/10'
                }`}>
                  {activity.status === 'success' && <CheckCircle className="h-5 w-5 text-success" />}
                  {activity.status === 'failed' && <AlertCircle className="h-5 w-5 text-destructive" />}
                  {activity.status === 'running' && <Play className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.workflowName}</p>
                  <p className="text-xs text-muted-foreground">
                    Executed at {new Date(activity.executedAt).toLocaleString()}
                  </p>
                  {activity.duration && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {(activity.duration / 1000).toFixed(2)}s
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={activity.status === 'success' ? 'secondary' : 
                            activity.status === 'failed' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID: {activity.id}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p>No activity data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
