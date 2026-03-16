import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

const categoryColors: Record<string, string> = {
  "data": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "compute": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "ai-models": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "tools": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "storage": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function ServiceCatalog() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/services");
      return res.json();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/services/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/services", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setDialogOpen(false);
      toast({ title: "Service created" });
    },
  });

  const handleCreateService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      name: fd.get("name") as string,
      slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      category: fd.get("category") as string,
      description: fd.get("description") as string,
      pricePerCall: parseFloat(fd.get("pricePerCall") as string),
      costPerCall: parseFloat(fd.get("costPerCall") as string),
      provider: fd.get("provider") as string,
      providerType: fd.get("providerType") as string || "direct-proxy",
      providerEndpoint: (fd.get("providerEndpoint") as string) || null,
      isActive: true,
    });
  };

  return (
    <Card className="border border-border">
      <CardHeader className="px-5 pt-4 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-foreground">Service Catalog</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" data-testid="button-add-service">
              <Plus className="w-3.5 h-3.5" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Add New Service</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Add a new service to the brokerage catalog.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <Label htmlFor="svc-name" className="text-xs">Name</Label>
                <Input id="svc-name" name="name" required data-testid="input-service-name" className="h-8 text-sm" />
              </div>
              <div>
                <Label htmlFor="svc-category" className="text-xs">Category</Label>
                <Select name="category" required defaultValue="data">
                  <SelectTrigger className="h-8 text-sm" data-testid="select-service-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="compute">Compute</SelectItem>
                    <SelectItem value="ai-models">AI Models</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="svc-desc" className="text-xs">Description</Label>
                <Input id="svc-desc" name="description" required data-testid="input-service-description" className="h-8 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="svc-price" className="text-xs">Price/Call ($)</Label>
                  <Input id="svc-price" name="pricePerCall" type="number" step="0.001" required data-testid="input-service-price" className="h-8 text-sm" />
                </div>
                <div>
                  <Label htmlFor="svc-cost" className="text-xs">Cost/Call ($)</Label>
                  <Input id="svc-cost" name="costPerCall" type="number" step="0.001" required data-testid="input-service-cost" className="h-8 text-sm" />
                </div>
              </div>
              <div>
                <Label htmlFor="svc-provider" className="text-xs">Provider</Label>
                <Input id="svc-provider" name="provider" required defaultValue="NexusBridge" data-testid="input-service-provider" className="h-8 text-sm" />
              </div>
              <div>
                <Label htmlFor="svc-provider-type" className="text-xs">Provider Type</Label>
                <Select name="providerType" required defaultValue="direct-proxy">
                  <SelectTrigger className="h-8 text-sm" data-testid="select-provider-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                    <SelectItem value="direct-proxy">Direct Proxy</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="svc-endpoint" className="text-xs">Provider Endpoint (optional)</Label>
                <Input id="svc-endpoint" name="providerEndpoint" data-testid="input-service-endpoint" className="h-8 text-sm" />
              </div>
              <Button type="submit" className="w-full h-8 text-sm" disabled={createMutation.isPending} data-testid="button-submit-service">
                {createMutation.isPending ? "Creating..." : "Create Service"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="px-5 pb-4 space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        ) : (
          <ScrollArea className="h-[360px]" type="always">
            <table className="w-full text-xs min-w-[640px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-medium px-5 py-2">Service</th>
                  <th className="text-left font-medium px-2 py-2">Category</th>
                  <th className="text-right font-medium px-2 py-2">Price</th>
                  <th className="text-right font-medium px-2 py-2">Cost</th>
                  <th className="text-right font-medium px-2 py-2">Margin</th>
                  <th className="text-right font-medium px-2 py-2">Calls</th>
                  <th className="text-right font-medium px-2 py-2">Revenue</th>
                  <th className="text-center font-medium px-3 py-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {services?.map((s) => {
                  const margin = s.pricePerCall > 0
                    ? (((s.pricePerCall - s.costPerCall) / s.pricePerCall) * 100).toFixed(0)
                    : "0";
                  return (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`row-service-${s.id}`}>
                      <td className="px-5 py-2 font-medium text-foreground whitespace-nowrap">{s.name}</td>
                      <td className="px-2 py-2">
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 font-medium ${categoryColors[s.category] ?? ""}`}>
                          {s.category}
                        </Badge>
                      </td>
                      <td className="text-right px-2 py-2 font-mono text-muted-foreground">${s.pricePerCall.toFixed(3)}</td>
                      <td className="text-right px-2 py-2 font-mono text-muted-foreground">${s.costPerCall.toFixed(3)}</td>
                      <td className="text-right px-2 py-2 font-mono text-accent">{margin}%</td>
                      <td className="text-right px-2 py-2 font-mono text-muted-foreground">{s.totalCalls.toLocaleString()}</td>
                      <td className="text-right px-2 py-2 font-mono text-foreground">${s.totalRevenue.toFixed(2)}</td>
                      <td className="text-center px-3 py-2">
                        <Switch
                          checked={s.isActive}
                          onCheckedChange={() => toggleMutation.mutate(s.id)}
                          className="scale-75"
                          data-testid={`switch-service-${s.id}`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
