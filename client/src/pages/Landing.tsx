import { Link } from "wouter";
import {
  MessageSquare,
  Code,
  Image,
  Hash,
  Search,
  FileText,
  Brain,
  Languages,
  BookOpen,
  Terminal,
  ArrowRight,
  Zap,
  DollarSign,
  Shield,
  Bot,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const STRIPE_LINKS = {
  10: "https://buy.stripe.com/5kQ4gsgVo9Rm04JgkR93y00",
  25: "https://buy.stripe.com/eVqdR29sWfbGcRv5Gd93y02",
  50: "https://buy.stripe.com/14A28kax06Fa9Fj0lT93y03",
  100: "https://buy.stripe.com/7sY00c8oS1kQcRv7Ol93y01",
} as const;

const services = [
  { name: "LLM Chat", price: "$0.005/call", desc: "GPT-4o, Claude, Gemini, DeepSeek, 200+ models", icon: MessageSquare },
  { name: "Code Generation", price: "$0.008/call", desc: "Generate, refactor, and complete code", icon: Code },
  { name: "Image Generation", price: "$0.05/call", desc: "Create images from text prompts", icon: Image },
  { name: "Text Embedding", price: "$0.001/call", desc: "Vector embeddings for search and RAG", icon: Hash },
  { name: "Web Search", price: "$0.01/call", desc: "Search the web, return structured results", icon: Search },
  { name: "Document Parser", price: "$0.02/call", desc: "Extract text and data from documents", icon: FileText },
  { name: "Sentiment Analysis", price: "$0.003/call", desc: "Classify text sentiment and emotion", icon: Brain },
  { name: "Translation", price: "$0.005/call", desc: "Translate between 50+ languages", icon: Languages },
  { name: "Summarization", price: "$0.008/call", desc: "Condense long text into key points", icon: BookOpen },
  { name: "Code Execution", price: "$0.015/call", desc: "Run code in a sandboxed environment", icon: Terminal },
];

const pricingTiers = [
  { amount: 10, label: "Starter", calls: "2,000", highlight: false },
  { amount: 25, label: "Builder", calls: "5,000", highlight: true },
  { amount: 50, label: "Pro", calls: "10,000", highlight: false },
  { amount: 100, label: "Scale", calls: "20,000", highlight: false },
];

const codeLines = [
  { text: 'import', cls: 'text-purple-400' },
  { text: ' requests', cls: 'text-foreground' },
  { text: '', cls: '' },
  { text: 'result ', cls: 'text-foreground' },
  { text: '= ', cls: 'text-muted-foreground' },
  { text: 'requests', cls: 'text-foreground' },
  { text: '.', cls: 'text-muted-foreground' },
  { text: 'post', cls: 'text-teal-400' },
  { text: '(', cls: 'text-muted-foreground' },
  { text: '"https://syntss.com/api/v1/execute"', cls: 'text-emerald-400' },
  { text: ',', cls: 'text-muted-foreground' },
];

function HeroCodeBlock() {
  return (
    <div className="bg-[hsl(210_12%_6%)] border border-white/10 rounded-lg p-5 font-mono text-sm leading-relaxed">
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500/70"></span>
        <span className="w-3 h-3 rounded-full bg-green-500/70"></span>
        <span className="ml-3 text-xs text-white/30">example.py</span>
      </div>
      <code className="text-white/90">
        <div>
          <span className="text-purple-400">import</span>
          <span className="text-white"> requests</span>
        </div>
        <div className="h-3"></div>
        <div>
          <span className="text-white">result </span>
          <span className="text-white/50">= </span>
          <span className="text-white">requests</span>
          <span className="text-white/50">.</span>
          <span className="text-teal-400">post</span>
          <span className="text-white/50">(</span>
        </div>
        <div className="pl-4">
          <span className="text-emerald-400">"https://syntss.com/api/v1/execute"</span>
          <span className="text-white/50">,</span>
        </div>
        <div className="pl-4">
          <span className="text-white">headers</span>
          <span className="text-white/50">={"{"}</span>
          <span className="text-emerald-400">"x-api-key"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"nb_sk_..."</span>
          <span className="text-white/50">{"}"}</span>
          <span className="text-white/50">,</span>
        </div>
        <div className="pl-4">
          <span className="text-white">json</span>
          <span className="text-white/50">={"{"}</span>
          <span className="text-emerald-400">"slug"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"llm-chat"</span>
          <span className="text-white/50">,</span>
        </div>
        <div className="pl-8">
          <span className="text-emerald-400">"params"</span>
          <span className="text-white/50">: {"{"}</span>
          <span className="text-emerald-400">"messages"</span>
          <span className="text-white/50">: [{"{"}</span>
          <span className="text-emerald-400">"role"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"user"</span>
          <span className="text-white/50">, </span>
          <span className="text-emerald-400">"content"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"Hello!"</span>
          <span className="text-white/50">{"}]}"}</span>
        </div>
        <div className="pl-4">
          <span className="text-white/50">{"}"}</span>
        </div>
        <div>
          <span className="text-white/50">)</span>
        </div>
        <div className="h-3"></div>
        <div>
          <span className="text-teal-400">print</span>
          <span className="text-white/50">(</span>
          <span className="text-white">result</span>
          <span className="text-white/50">.</span>
          <span className="text-teal-400">json</span>
          <span className="text-white/50">()[</span>
          <span className="text-emerald-400">"result"</span>
          <span className="text-white/50">])</span>
        </div>
      </code>
      <div className="mt-4 pt-3 border-t border-white/5 text-xs text-white/30">
        → {"{"}"choices": [{"{"}"message": {"{"}"content": "Hello! How can I help you?"{"}"}{"}"}]{"}"}
      </div>
    </div>
  );
}

function FullCodeExample() {
  return (
    <div className="bg-[hsl(210_12%_6%)] border border-white/10 rounded-lg p-5 font-mono text-xs leading-relaxed overflow-x-auto">
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500/70"></span>
        <span className="w-3 h-3 rounded-full bg-green-500/70"></span>
        <span className="ml-3 text-[10px] text-white/30">nexusbridge_demo.py</span>
      </div>
      <code className="text-white/90">
        <div>
          <span className="text-purple-400">import</span>
          <span className="text-white"> requests</span>
        </div>
        <div className="h-2"></div>
        <div>
          <span className="text-white">API_KEY </span>
          <span className="text-white/50">= </span>
          <span className="text-emerald-400">"nb_sk_your_key_here"</span>
        </div>
        <div>
          <span className="text-white">BASE </span>
          <span className="text-white/50">= </span>
          <span className="text-emerald-400">"https://syntss.com/api/v1"</span>
        </div>
        <div>
          <span className="text-white">headers </span>
          <span className="text-white/50">= {"{"}</span>
          <span className="text-emerald-400">"x-api-key"</span>
          <span className="text-white/50">: </span>
          <span className="text-white">API_KEY</span>
          <span className="text-white/50">, </span>
          <span className="text-emerald-400">"Content-Type"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"application/json"</span>
          <span className="text-white/50">{"}"}</span>
        </div>
        <div className="h-2"></div>
        <div>
          <span className="text-white/30"># Discover available services</span>
        </div>
        <div>
          <span className="text-white">catalog </span>
          <span className="text-white/50">= </span>
          <span className="text-white">requests</span>
          <span className="text-white/50">.</span>
          <span className="text-teal-400">post</span>
          <span className="text-white/50">(</span>
          <span className="text-white">BASE </span>
          <span className="text-white/50">+ </span>
          <span className="text-emerald-400">"/catalog"</span>
          <span className="text-white/50">, </span>
          <span className="text-white">headers</span>
          <span className="text-white/50">=</span>
          <span className="text-white">headers</span>
          <span className="text-white/50">).</span>
          <span className="text-teal-400">json</span>
          <span className="text-white/50">()</span>
        </div>
        <div>
          <span className="text-purple-400">for</span>
          <span className="text-white"> svc </span>
          <span className="text-purple-400">in</span>
          <span className="text-white"> catalog</span>
          <span className="text-white/50">[</span>
          <span className="text-emerald-400">"services"</span>
          <span className="text-white/50">]:</span>
        </div>
        <div className="pl-4">
          <span className="text-teal-400">print</span>
          <span className="text-white/50">(</span>
          <span className="text-orange-400">f"</span>
          <span className="text-orange-400">{"{"}svc['slug']:20s{"}"}</span>
          <span className="text-orange-400"> ${"{"}svc['pricePerCall']{"}"}/call</span>
          <span className="text-orange-400">"</span>
          <span className="text-white/50">)</span>
        </div>
        <div className="h-2"></div>
        <div>
          <span className="text-white/30"># Chat completion via OpenRouter</span>
        </div>
        <div>
          <span className="text-white">result </span>
          <span className="text-white/50">= </span>
          <span className="text-white">requests</span>
          <span className="text-white/50">.</span>
          <span className="text-teal-400">post</span>
          <span className="text-white/50">(</span>
          <span className="text-white">BASE </span>
          <span className="text-white/50">+ </span>
          <span className="text-emerald-400">"/execute"</span>
          <span className="text-white/50">, </span>
          <span className="text-white">headers</span>
          <span className="text-white/50">=</span>
          <span className="text-white">headers</span>
          <span className="text-white/50">, </span>
          <span className="text-white">json</span>
          <span className="text-white/50">={"{"}</span>
        </div>
        <div className="pl-4">
          <span className="text-emerald-400">"slug"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"llm-chat"</span>
          <span className="text-white/50">,</span>
        </div>
        <div className="pl-4">
          <span className="text-emerald-400">"params"</span>
          <span className="text-white/50">: {"{"}</span>
        </div>
        <div className="pl-8">
          <span className="text-emerald-400">"model"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"deepseek/deepseek-chat-v3-0324"</span>
          <span className="text-white/50">,</span>
        </div>
        <div className="pl-8">
          <span className="text-emerald-400">"messages"</span>
          <span className="text-white/50">: [{"{"}</span>
          <span className="text-emerald-400">"role"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"user"</span>
          <span className="text-white/50">, </span>
          <span className="text-emerald-400">"content"</span>
          <span className="text-white/50">: </span>
          <span className="text-emerald-400">"Explain API brokerages in 2 sentences."</span>
          <span className="text-white/50">{"}]"}</span>
        </div>
        <div className="pl-4">
          <span className="text-white/50">{"}"}</span>
        </div>
        <div>
          <span className="text-white/50">{"}"}).</span>
          <span className="text-teal-400">json</span>
          <span className="text-white/50">()</span>
        </div>
        <div className="h-2"></div>
        <div>
          <span className="text-teal-400">print</span>
          <span className="text-white/50">(</span>
          <span className="text-emerald-400">"Charged:"</span>
          <span className="text-white/50">, </span>
          <span className="text-white">result</span>
          <span className="text-white/50">[</span>
          <span className="text-emerald-400">"charged"</span>
          <span className="text-white/50">])</span>
        </div>
        <div>
          <span className="text-teal-400">print</span>
          <span className="text-white/50">(</span>
          <span className="text-emerald-400">"Response:"</span>
          <span className="text-white/50">, </span>
          <span className="text-white">result</span>
          <span className="text-white/50">[</span>
          <span className="text-emerald-400">"result"</span>
          <span className="text-white/50">][</span>
          <span className="text-emerald-400">"choices"</span>
          <span className="text-white/50">][</span>
          <span className="text-orange-400">0</span>
          <span className="text-white/50">][</span>
          <span className="text-emerald-400">"message"</span>
          <span className="text-white/50">][</span>
          <span className="text-emerald-400">"content"</span>
          <span className="text-white/50">])</span>
        </div>
      </code>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl tracking-tight text-foreground leading-tight">
              One API. 200+ AI Models.{" "}
              <span className="text-primary">Pay Only for What You Use.</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
              NexusBridge routes your AI agent's requests to the best upstream providers — OpenRouter, search engines, document parsers, and more. No vendor lock-in. No minimum spend. Credits start at $10.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={STRIPE_LINKS[10]} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 font-semibold">
                  Get API Key — Free to Start
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="gap-2">
                  View API Docs
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroCodeBlock />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "200+", label: "Models" },
            { value: "10", label: "Service Categories" },
            { value: "$0.005", label: "Per LLM Call" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Get Your API Key",
                desc: "Purchase credits via Stripe. Receive your API key instantly. Start at just $10.",
              },
              {
                step: "2",
                title: "Make API Calls",
                desc: "One unified endpoint for chat, code, images, search, and more. Standard REST — works with any language.",
              },
              {
                step: "3",
                title: "Pay Per Call",
                desc: "Credits deducted automatically. No subscriptions. No surprises. See every charge in your dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Catalog */}
      <section className="px-6 py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-center text-foreground mb-3">
            Service Catalog
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            10 services, one API key. Every call metered and billed transparently.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {services.map((svc) => (
              <Card key={svc.name} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svc.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground truncate">{svc.name}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{svc.desc}</p>
                  <div className="text-xs font-mono text-primary font-medium">{svc.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why NexusBridge */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-center text-foreground mb-12">
            Why NexusBridge
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "No Vendor Lock-in",
                desc: "Switch models and providers anytime. Your code stays the same. One integration, zero migration headaches.",
              },
              {
                icon: DollarSign,
                title: "Transparent Pricing",
                desc: "No subscriptions, no minimums, no hidden fees. Pay per call, see every charge. Linear and predictable.",
              },
              {
                icon: Zap,
                title: "One Integration",
                desc: "One API key, one endpoint, 200+ models. Stop managing 10 different provider SDKs and API keys.",
              },
              {
                icon: Bot,
                title: "Built for AI Agents",
                desc: "MCP server included. Your AI agents can discover and consume services autonomously via the Model Context Protocol.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-lg border border-border bg-card">
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="px-6 py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-center text-foreground mb-3">
            Simple to Integrate
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-md mx-auto">
            Standard REST API. Works with any language. Here's the full flow in Python.
          </p>
          <FullCodeExample />
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-center text-foreground mb-3">
            Pricing
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-12 max-w-md mx-auto">
            Pre-purchase credits. No subscriptions. No expiration. Use them whenever you need.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.amount}
                className={
                  tier.highlight
                    ? "border-primary bg-primary/5 relative"
                    : "border-border bg-card"
                }
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-semibold px-3 py-0.5 rounded-full">
                    Popular
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className="text-xs text-muted-foreground font-medium mb-1">{tier.label}</div>
                  <div className="text-3xl font-display font-bold text-foreground mb-1">${tier.amount}</div>
                  <div className="text-xs text-muted-foreground mb-5">
                    ~{tier.calls} LLM calls
                  </div>
                  <a
                    href={STRIPE_LINKS[tier.amount as keyof typeof STRIPE_LINKS]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant={tier.highlight ? "default" : "outline"}
                      size="sm"
                      className="w-full gap-1.5"
                    >
                      Buy Credits
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm font-display font-semibold text-foreground">
              NexusBridge
              <span className="text-muted-foreground font-normal ml-2 text-xs">AI-to-AI API Brokerage</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/docs" className="hover:text-foreground transition-colors">
                API Docs
              </Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <a
                href="https://github.com/guhank/nexusbridge-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={STRIPE_LINKS[10]}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Buy Credits
              </a>
            </div>
          </div>
          <div className="mt-6">
            <PerplexityAttribution />
          </div>
        </div>
      </footer>
    </div>
  );
}
