import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Key, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ApiKey } from "@shared/schema";

function maskKey(key: string): string {
  if (key.length <= 10) return key;
  return key.slice(0, 6) + "****..." + key.slice(-4);
}

const agentTypeLabels: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  custom: "Custom",
};

const creditAmounts = [10, 25, 50, 100];

export function ApiKeysTable() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [selectedKeyName, setSelectedKeyName] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");

  const { data: apiKeys, isLoading } = useQuery<ApiKey[]>({
    queryKey: ["/api/api-keys"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/api-keys");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/api-keys", body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      setDialogOpen(false);
      toast({ title: "API key generated" });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({ amount, apiKeyId }: { amount: number; apiKeyId: string }) => {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", { amount, apiKeyId });
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        setCreditsDialogOpen(false);
        toast({ title: "Stripe Checkout opened in new tab" });
      } else if (data.error) {
        toast({ title: "Stripe not configured", description: data.error, variant: "destructive" });
      }
    },
    onError: () => {
      toast({ title: "Failed to create checkout", description: "Stripe may not be configured.", variant: "destructive" });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      name: fd.get("name") as string,
      agentType: fd.get("agentType") as string,
      creditBalance: parseFloat(fd.get("creditBalance") as string) || 0,
    });
  };

  const handleBuyCredits = (apiKeyId: string, name: string) => {
    setSelectedKeyId(apiKeyId);
    setSelectedKeyName(name);
    setCustomAmount("");
    setCreditsDialogOpen(true);
  };

  const handleCheckout = (amount: number) => {
    checkoutMutation.mutate({ amount, apiKeyId: selectedKeyId });
  };

  return (
    <Card className="border border-border">
      <CardHeader className="px-5 pt-4 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-foreground">API Keys</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" data-testid="button-generate-key">
              <Key className="w-3.5 h-3.5" />
              Generate Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Generate API Key</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Create a new API key for an AI agent.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <Label htmlFor="key-name" className="text-xs">Agent Name</Label>
                <Input id="key-name" name="name" required data-testid="input-key-name" className="h-8 text-sm" />
              </div>
              <div>
                <Label htmlFor="key-type" className="text-xs">Agent Type</Label>
                <Select name="agentType" required defaultValue="custom">
                  <SelectTrigger className="h-8 text-sm" data-testid="select-key-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="key-balance" className="text-xs">Initial Credits ($)</Label>
                <Input id="key-balance" name="creditBalance" type="number" step="0.01" defaultValue="0" data-testid="input-key-balance" className="h-8 text-sm" />
              </div>
              <Button type="submit" className="w-full h-8 text-sm" disabled={createMutation.isPending} data-testid="button-submit-key">
                {createMutation.isPending ? "Generating..." : "Generate Key"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="px-5 pb-4 space-y-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left font-medium px-5 py-2">Name</th>
                  <th className="text-left font-medium px-2 py-2">Type</th>
                  <th className="text-left font-medium px-2 py-2">Key</th>
                  <th className="text-right font-medium px-2 py-2">Credits</th>
                  <th className="text-center font-medium px-2 py-2">Status</th>
                  <th className="text-left font-medium px-2 py-2">Created</th>
                  <th className="text-center font-medium px-5 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys?.map((ak) => (
                  <tr key={ak.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`row-api-key-${ak.id}`}>
                    <td className="px-5 py-2 font-medium text-foreground whitespace-nowrap">{ak.name}</td>
                    <td className="px-2 py-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                        {agentTypeLabels[ak.agentType] ?? ak.agentType}
                      </Badge>
                    </td>
                    <td className="px-2 py-2 font-mono text-muted-foreground">{maskKey(ak.key)}</td>
                    <td className="text-right px-2 py-2 font-mono text-foreground">${ak.creditBalance.toFixed(2)}</td>
                    <td className="text-center px-2 py-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${
                          ak.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {ak.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-2 py-2 text-muted-foreground">
                      {ak.createdAt ? new Date(ak.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }) : "—"}
                    </td>
                    <td className="text-center px-5 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] gap-1 px-2"
                        onClick={() => handleBuyCredits(ak.id, ak.name)}
                        data-testid={`button-buy-credits-${ak.id}`}
                      >
                        <CreditCard className="w-3 h-3" />
                        Buy Credits
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Buy Credits Dialog */}
      <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Buy Credits</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add credits to <span className="font-medium text-foreground">{selectedKeyName}</span> via Stripe Checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {creditAmounts.map(amt => (
                <Button
                  key={amt}
                  variant="outline"
                  className="h-12 flex flex-col gap-0.5"
                  onClick={() => handleCheckout(amt)}
                  disabled={checkoutMutation.isPending}
                  data-testid={`button-credits-${amt}`}
                >
                  <span className="text-sm font-semibold">${amt}</span>
                  <span className="text-[10px] text-muted-foreground">{Math.floor(amt / 0.005).toLocaleString()} calls</span>
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="Custom amount ($)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="h-8 text-sm"
                data-testid="input-custom-credits"
              />
              <Button
                size="sm"
                className="h-8 text-xs shrink-0"
                onClick={() => {
                  const amt = parseFloat(customAmount);
                  if (amt > 0) handleCheckout(amt);
                }}
                disabled={!customAmount || parseFloat(customAmount) <= 0 || checkoutMutation.isPending}
                data-testid="button-custom-checkout"
              >
                {checkoutMutation.isPending ? "..." : "Pay"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
