
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  target?: string | number;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  status, 
  target, 
  trend,
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("metric-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <StatusIndicator status={status} label={status === 'normal' ? 'Normal' : status === 'warning' ? 'Attention' : 'Critique'} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        {target && (
          <p className="text-xs text-gray-500 mt-1">
            Cible: {target}{unit}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-xs",
              {
                "text-green-600": trend === 'up' && status === 'normal',
                "text-red-600": trend === 'down' && status === 'critical',
                "text-gray-600": trend === 'stable'
              }
            )}>
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} 
              {trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
