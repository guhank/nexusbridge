import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  date: string;
  revenue: number;
  profit: number;
}

export function RevenueChart() {
  const { data: chartData, isLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ["/api/transactions/chart"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/transactions/chart");
      return res.json();
    },
  });

  return (
    <Card className="border border-border">
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-sm font-semibold text-foreground">
          Revenue — Last 30 Days
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        {isLoading || !chartData ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(170 65% 40%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(170 65% 40%)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(185 75% 28%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(185 75% 28%)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="[&_line]:stroke-border" opacity={0.4} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(210 8% 45%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(d: string) => {
                  const date = new Date(d + "T00:00:00");
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(210 8% 45%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v}`}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(210 10% 11%)",
                  border: "1px solid hsl(210 8% 18%)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "hsl(210 12% 92%)",
                }}
                labelFormatter={(d: string) => {
                  const date = new Date(d + "T00:00:00");
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`,
                  name === "revenue" ? "Revenue" : "Profit",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(170 65% 40%)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="hsl(185 75% 28%)"
                strokeWidth={1.5}
                fill="url(#profitGradient)"
                strokeDasharray="4 2"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
