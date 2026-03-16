import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@shared/schema";

function relativeTime(ts: string | Date): string {
  const now = Date.now();
  const then = new Date(ts).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/transactions?limit=30");
      return res.json();
    },
  });

  return (
    <Card className="border border-border">
      <CardHeader className="px-5 pt-4 pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="px-5 pb-4 space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <ScrollArea className="h-[360px]">
            <div className="divide-y divide-border/50">
              {transactions?.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                  data-testid={`row-transaction-${t.id}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-foreground truncate">{t.serviceName}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {relativeTime(t.timestamp!)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <div className="text-xs font-mono font-medium text-foreground">${t.amount.toFixed(3)}</div>
                      <div className="text-[10px] font-mono text-accent">+${t.profit.toFixed(3)}</div>
                    </div>
                    <Badge
                      variant={t.status === "completed" ? "secondary" : "destructive"}
                      className={`text-[10px] px-1.5 py-0 ${
                        t.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : ""
                      }`}
                    >
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
