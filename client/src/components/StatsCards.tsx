import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Activity, Bot } from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalProfit: number;
  totalTransactions: number;
  activeAgents: number;
}

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/stats");
      return res.json();
    },
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const margin = stats.totalRevenue > 0
    ? ((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)
    : "0";

  const items = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      testId: "stat-total-revenue",
    },
    {
      label: "Total Profit",
      value: `$${stats.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `${margin}% margin`,
      icon: TrendingUp,
      testId: "stat-total-profit",
    },
    {
      label: "Total API Calls",
      value: stats.totalTransactions.toLocaleString(),
      icon: Activity,
      testId: "stat-total-calls",
    },
    {
      label: "Active AI Agents",
      value: stats.activeAgents.toString(),
      icon: Bot,
      testId: "stat-active-agents",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {item.label}
              </span>
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-lg font-semibold text-foreground font-display" data-testid={item.testId}>
              {item.value}
            </div>
            {item.sub && (
              <span className="text-xs text-accent">{item.sub}</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
