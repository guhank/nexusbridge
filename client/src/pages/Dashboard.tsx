import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { StatsCards } from "@/components/StatsCards";
import { RevenueChart } from "@/components/RevenueChart";
import { ServiceCatalog } from "@/components/ServiceCatalog";
import { RecentTransactions } from "@/components/RecentTransactions";
import { ApiKeysTable } from "@/components/ApiKeysTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="font-display font-bold text-xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monitor your API brokerage performance
        </p>
      </div>

      <StatsCards />
      <RevenueChart />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ServiceCatalog />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>

      <ApiKeysTable />
      <PerplexityAttribution />
    </div>
  );
}
