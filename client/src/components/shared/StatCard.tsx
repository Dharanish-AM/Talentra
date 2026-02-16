import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  delay?: number;
}

export default function StatCard({ label, value, change, trend, icon, delay = 0 }: StatCardProps) {
  return (
    <div
      className="rounded-xl border border-border bg-card p-6 shadow-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-card-foreground">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-success" />}
              {trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
              {trend === 'neutral' && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className={trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
