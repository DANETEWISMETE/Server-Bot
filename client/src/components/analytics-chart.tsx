interface AnalyticsChartProps {
  data: Array<{
    date: string;
    successful: number;
    failed: number;
  }>;
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.successful + d.failed));

  return (
    <div className="chart-container relative">
      <div className="absolute inset-0 flex items-end justify-around gap-2 px-4 pb-8">
        {data.map((day, index) => {
          const total = day.successful + day.failed;
          const height = total > 0 ? (total / maxValue) * 100 : 5;
          
          return (
            <div 
              key={day.date}
              className="flex-1 bg-primary/20 rounded-t hover:bg-primary/30 transition-colors cursor-pointer group relative"
              style={{ height: `${height}%`, minHeight: '8px' }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div>Success: {day.successful}</div>
                <div>Failed: {day.failed}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-around text-xs text-muted-foreground px-4">
        {data.map((day) => (
          <span key={day.date}>
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
        ))}
      </div>
    </div>
  );
}
