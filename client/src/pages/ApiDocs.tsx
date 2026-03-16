import { useState } from "react";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { cn } from "@/lib/utils";
import { BookOpen, Key, Search, Play, Server, Code, CreditCard, Cpu } from "lucide-react";

const PYTHON_EXAMPLE = [
  'import requests',
  '',
  'API_KEY = "nb_sk_your_key_here"',
  'BASE = "https://syntss.com/api/v1"',
  'headers = {"x-api-key": API_KEY, "Content-Type": "application/json"}',
  '',
  '# Discover available services',
  'catalog = requests.post(BASE + "/catalog", headers=headers).json()',
  'for svc in catalog["services"]:',
  '    print(f"{svc[\'slug\']:20s} ${svc[\'pricePerCall\']}/call")',
  '',
  '# Chat completion via OpenRouter',
  'result = requests.post(BASE + "/execute", headers=headers, json={',
  '    "slug": "llm-chat",',
  '    "params": {',
  '        "model": "deepseek/deepseek-chat-v3-0324",',
  '        "messages": [{"role": "user", "content": "Explain API brokerages in 2 sentences."}]',
  '    }',
  '}).json()',
  '',
  'print("Charged:", result["charged"])',
  'print("Response:", result["result"]["choices"][0]["message"]["content"])',
].join('\n');

const sections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "authentication", label: "Authentication", icon: Key },
  { id: "catalog", label: "Service Catalog", icon: Search },
  { id: "execute", label: "Execute Service", icon: Play },
  { id: "models", label: "Supported Models", icon: Cpu },
  { id: "credits", label: "Buying Credits", icon: CreditCard },
  { id: "mcp", label: "MCP Server", icon: Server },
  { id: "examples", label: "Code Examples", icon: Code },
  { id: "pricing", label: "Pricing Table", icon: CreditCard },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-card border border-border rounded-md p-4 overflow-x-auto text-xs font-mono leading-relaxed text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function ApiDocs() {
  const [activeSection, setActiveSection] = useState("overview");

  const handleNav = (id: string) => {
    setActiveSection(id);
    scrollToSection(id);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar nav */}
      <nav className="w-48 shrink-0 border-r border-border py-6 px-3 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          API Reference
        </div>
        <div className="space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleNav(s.id)}
              data-testid={`nav-doc-${s.id}`}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-left",
                activeSection === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <s.icon className="w-3.5 h-3.5 shrink-0" />
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 p-8 max-w-3xl space-y-12 overflow-y-auto">
        {/* Overview */}
        <section id="overview">
          <h1 className="font-display font-bold text-xl text-foreground mb-2">NexusBridge API</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            NexusBridge is a production API brokerage for AI agents. It provides a unified REST endpoint
            that proxies to upstream providers like OpenRouter (200+ LLMs), search APIs, document parsers,
            and compute services. All calls are authenticated, metered, and billed via a credits system.
          </p>
          <div className="mt-4 p-3 bg-card border border-border rounded-md">
            <div className="text-xs font-medium text-muted-foreground mb-1">Base URL</div>
            <code className="text-sm font-mono text-primary">https://syntss.com/api/v1</code>
          </div>
          <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-md">
            <div className="text-xs font-medium text-primary">
              OpenRouter models are available through NexusBridge — use <code className="font-mono bg-muted px-1 rounded">llm-chat</code> with any model slug from OpenRouter's catalog.
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">Authentication</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            All API requests require an API key passed in the <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">x-api-key</code> header.
            API keys are generated from the dashboard and carry a credit balance.
          </p>
          <CodeBlock>{`# Include in every request
curl -X POST https://syntss.com/api/v1/catalog \\
  -H "x-api-key: nb_sk_your_key_here" \\
  -H "Content-Type: application/json"`}</CodeBlock>
          <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-md">
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Keep your API key secret. Do not expose it in client-side code or public repositories.
            </div>
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">Service Catalog</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Discover all available services and their pricing. Returns only active services.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">POST</span>
            <code className="text-sm font-mono text-foreground">/api/v1/catalog</code>
          </div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Response</div>
          <CodeBlock>{`{
  "services": [
    {
      "slug": "llm-chat",
      "name": "LLM Chat Completion",
      "category": "ai-models",
      "description": "General-purpose chat completions via OpenRouter...",
      "pricePerCall": 0.005,
      "providerType": "openrouter"
    },
    {
      "slug": "web-search",
      "name": "Web Search",
      "category": "tools",
      "description": "Search the web and return structured results...",
      "pricePerCall": 0.01,
      "providerType": "direct-proxy"
    }
  ],
  "creditBalance": 245.80
}`}</CodeBlock>
        </section>

        {/* Execute */}
        <section id="execute">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">Execute Service</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Execute a service call. Credits are automatically deducted. For OpenRouter services,
            the request is proxied directly to the upstream model. For direct-proxy services,
            NexusBridge handles the execution.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">POST</span>
            <code className="text-sm font-mono text-foreground">/api/v1/execute</code>
          </div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Request — LLM Chat (OpenRouter)</div>
          <CodeBlock>{`{
  "slug": "llm-chat",
  "params": {
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [
      {"role": "user", "content": "What is an API brokerage?"}
    ],
    "max_tokens": 512
  }
}`}</CodeBlock>
          <div className="text-xs font-medium text-muted-foreground mt-4 mb-2">Response</div>
          <CodeBlock>{`{
  "success": true,
  "service": "llm-chat",
  "charged": 0.005,
  "remainingBalance": 245.795,
  "result": {
    "id": "gen-...",
    "choices": [{
      "message": {
        "role": "assistant",
        "content": "An API brokerage is a platform that..."
      }
    }],
    "model": "deepseek/deepseek-chat-v3-0324",
    "usage": { "prompt_tokens": 12, "completion_tokens": 87 }
  }
}`}</CodeBlock>
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <div><strong className="text-foreground">402</strong> — Insufficient credits</div>
            <div><strong className="text-foreground">404</strong> — Service not found or inactive</div>
            <div><strong className="text-foreground">401</strong> — Invalid or missing API key</div>
          </div>
        </section>

        {/* Supported Models */}
        <section id="models">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">Supported Models</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            NexusBridge proxies to OpenRouter, giving you access to 200+ models. Pass any model slug
            in the <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">params.model</code> field. Popular options:
          </p>
          <div className="space-y-1">
            {[
              { model: "deepseek/deepseek-chat-v3-0324", desc: "DeepSeek V3 — fast, cheap, excellent quality" },
              { model: "anthropic/claude-3.5-sonnet", desc: "Claude 3.5 Sonnet — top-tier reasoning" },
              { model: "openai/gpt-4o", desc: "GPT-4o — strong all-round performance" },
              { model: "google/gemini-2.0-flash-001", desc: "Gemini 2.0 Flash — fast and capable" },
              { model: "meta-llama/llama-3.3-70b-instruct", desc: "Llama 3.3 70B — open-source powerhouse" },
              { model: "qwen/qwen-2.5-coder-32b-instruct", desc: "Qwen 2.5 Coder — specialized for code" },
            ].map(({ model, desc }) => (
              <div key={model} className="flex items-start gap-3 p-2 bg-card border border-border/50 rounded-md">
                <code className="text-xs font-mono text-primary whitespace-nowrap shrink-0">{model}</code>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-card border border-border rounded-md">
            <div className="text-xs text-muted-foreground">
              Default model: <code className="font-mono text-foreground">deepseek/deepseek-chat-v3-0324</code> — excellent quality at the lowest cost.
              See <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter Models</a> for the full catalog.
            </div>
          </div>
        </section>

        {/* Buying Credits */}
        <section id="credits">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">Buying Credits</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Credits are purchased via Stripe Checkout. You can buy credits from the dashboard or via the API.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">POST</span>
            <code className="text-sm font-mono text-foreground">/api/stripe/create-checkout</code>
          </div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Request Body</div>
          <CodeBlock>{`{
  "amount": 25,
  "apiKeyId": "your-api-key-id"
}`}</CodeBlock>
          <div className="text-xs font-medium text-muted-foreground mt-4 mb-2">Response</div>
          <CodeBlock>{`{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/...",
  "sessionId": "cs_live_..."
}`}</CodeBlock>
          <p className="text-xs text-muted-foreground mt-3">
            Redirect the user to <code className="font-mono bg-muted px-1 rounded">checkoutUrl</code> to complete payment.
            Credits are automatically added to the API key balance upon successful payment via webhook.
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map(amt => (
              <div key={amt} className="p-2 bg-card border border-border rounded-md text-center">
                <div className="text-sm font-semibold text-foreground">${amt}</div>
                <div className="text-[10px] text-muted-foreground">{Math.floor(amt / 0.005).toLocaleString()} chat calls</div>
              </div>
            ))}
          </div>
        </section>

        {/* MCP */}
        <section id="mcp">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">MCP Server</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            NexusBridge exposes a Model Context Protocol (MCP) server for Smithery and Claude Desktop, allowing AI agents to discover
            and use all brokered services as native MCP tools.
          </p>
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-md mb-3">
            <p className="text-xs text-primary leading-relaxed">
              GitHub: <a href="https://github.com/guhank/nexusbridge-mcp-server" target="_blank" rel="noopener noreferrer" className="underline font-medium">github.com/guhank/nexusbridge-mcp-server</a>
            </p>
          </div>
          <div className="p-3 bg-card border border-border rounded-md space-y-2">
            <div>
              <div className="text-xs font-medium text-muted-foreground">MCP Tools</div>
              <div className="text-xs font-mono text-foreground space-y-0.5 mt-1">
                <div><span className="text-primary">nexusbridge_catalog</span> — List available services and pricing</div>
                <div><span className="text-primary">nexusbridge_execute</span> — Execute any brokered service</div>
                <div><span className="text-primary">nexusbridge_balance</span> — Check credit balance</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Protocol</div>
              <code className="text-sm font-mono text-foreground">JSON-RPC 2.0 over stdio</code>
            </div>
          </div>
          <CodeBlock>{`# Claude Desktop — claude_desktop_config.json
{
  "mcpServers": {
    "nexusbridge": {
      "command": "npx",
      "args": ["tsx", "/path/to/nexusbridge-mcp-server/index.ts"],
      "env": {
        "NEXUSBRIDGE_API_KEY": "nb_sk_your_key_here",
        "NEXUSBRIDGE_BASE_URL": "https://syntss.com"
      }
    }
  }
}`}</CodeBlock>
        </section>

        {/* Code Examples */}
        <section id="examples">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">Code Examples</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Python — Full Flow</h3>
              <CodeBlock>{PYTHON_EXAMPLE}</CodeBlock>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">curl — Chat Completion</h3>
              <CodeBlock>{`# Execute LLM chat via NexusBridge
curl -X POST https://syntss.com/api/v1/execute \\
  -H "x-api-key: nb_sk_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "slug": "llm-chat",
    "params": {
      "messages": [{"role": "user", "content": "Hello, NexusBridge!"}],
      "model": "deepseek/deepseek-chat-v3-0324"
    }
  }'`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">curl — Sentiment Analysis</h3>
              <CodeBlock>{`curl -X POST https://syntss.com/api/v1/execute \\
  -H "x-api-key: nb_sk_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "slug": "sentiment",
    "params": {"text": "NexusBridge makes AI agent development effortless!"}
  }'`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section id="pricing">
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">Pricing Table</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Pay-per-call pricing. Credits are pre-purchased via Stripe and deducted on each successful execution.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-md">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium px-3 py-2 text-muted-foreground">Service</th>
                  <th className="text-left font-medium px-3 py-2 text-muted-foreground">Category</th>
                  <th className="text-right font-medium px-3 py-2 text-muted-foreground">Price/Call</th>
                  <th className="text-left font-medium px-3 py-2 text-muted-foreground">Provider</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "LLM Chat Completion", cat: "ai-models", price: "$0.005", provider: "OpenRouter" },
                  { name: "LLM Code Generation", cat: "ai-models", price: "$0.008", provider: "OpenRouter" },
                  { name: "Image Generation", cat: "ai-models", price: "$0.050", provider: "OpenRouter" },
                  { name: "Text Embedding", cat: "ai-models", price: "$0.001", provider: "OpenRouter" },
                  { name: "Sentiment Analysis", cat: "ai-models", price: "$0.003", provider: "OpenRouter" },
                  { name: "Summarization", cat: "ai-models", price: "$0.008", provider: "OpenRouter" },
                  { name: "Web Search", cat: "tools", price: "$0.010", provider: "NexusBridge" },
                  { name: "Document Parser", cat: "tools", price: "$0.020", provider: "NexusBridge" },
                  { name: "Translation", cat: "tools", price: "$0.005", provider: "NexusBridge" },
                  { name: "Code Execution", cat: "compute", price: "$0.015", provider: "NexusBridge" },
                ].map(({ name, cat, price, provider }) => (
                  <tr key={name} className="border-b border-border/50">
                    <td className="px-3 py-2 font-medium text-foreground">{name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{cat}</td>
                    <td className="text-right px-3 py-2 font-mono text-foreground">{price}</td>
                    <td className="px-3 py-2 text-muted-foreground">{provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <PerplexityAttribution />
      </div>
    </div>
  );
}
