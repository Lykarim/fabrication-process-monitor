
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'normal' | 'warning' | 'critical';
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "status-indicator",
        {
          "status-normal": status === 'normal',
          "status-warning": status === 'warning',
          "status-critical": status === 'critical',
        },
        className
      )}
    >
      <span className={cn(
        "w-2 h-2 rounded-full",
        {
          "bg-green-500": status === 'normal',
          "bg-yellow-500": status === 'warning',
          "bg-red-500": status === 'critical',
        }
      )} />
      {label}
    </span>
  );
}
