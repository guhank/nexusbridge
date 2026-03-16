import { randomUUID } from "crypto";
import type {
  ApiKey, InsertApiKey,
  Service, InsertService,
  Transaction, InsertTransaction,
} from "@shared/schema";

export interface IStorage {
  // API Keys
  getApiKeys(): Promise<ApiKey[]>;
  getApiKey(id: string): Promise<ApiKey | undefined>;
  getApiKeyByKey(key: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKeyBalance(id: string, newBalance: number): Promise<void>;
  addCredits(apiKeyId: string, amount: number): Promise<void>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  toggleServiceActive(id: string): Promise<Service | undefined>;
  incrementServiceStats(id: string, revenue: number): Promise<void>;

  // Transactions
  getTransactions(limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getChartData(): Promise<{ date: string; revenue: number; profit: number }[]>;

  // Stats
  getStats(): Promise<{
    totalRevenue: number;
    totalProfit: number;
    totalTransactions: number;
    activeAgents: number;
    topServices: { name: string; revenue: number; calls: number }[];
  }>;
}

function generateKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "nb_sk_";
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export class MemStorage implements IStorage {
  private apiKeysMap: Map<string, ApiKey>;
  private servicesMap: Map<string, Service>;
  private transactionsMap: Map<string, Transaction>;

  constructor() {
    this.apiKeysMap = new Map();
    this.servicesMap = new Map();
    this.transactionsMap = new Map();
    this.seed();
  }

  private seed() {
    // Seed services — all brokered, no direct services
    const serviceData: InsertService[] = [
      {
        name: "LLM Chat Completion",
        slug: "llm-chat",
        category: "ai-models",
        description: "General-purpose chat completions via OpenRouter. Supports GPT-4o, Claude, Gemini, DeepSeek, and 200+ models. Pass messages array and optional model parameter.",
        pricePerCall: 0.005,
        costPerCall: 0.003,
        provider: "OpenRouter",
        providerType: "openrouter",
        providerEndpoint: "https://openrouter.ai/api/v1/chat/completions",
        isActive: true,
      },
      {
        name: "LLM Code Generation",
        slug: "llm-code",
        category: "ai-models",
        description: "Optimized code generation and completion. Routes to top coding models like DeepSeek Coder, Claude 3.5 Sonnet, and GPT-4o via OpenRouter.",
        pricePerCall: 0.008,
        costPerCall: 0.005,
        provider: "OpenRouter",
        providerType: "openrouter",
        providerEndpoint: "https://openrouter.ai/api/v1/chat/completions",
        isActive: true,
      },
      {
        name: "Image Generation",
        slug: "image-gen",
        category: "ai-models",
        description: "Generate images from text prompts. Routes to DALL-E 3, Stable Diffusion XL, and Flux models via OpenRouter. Returns base64 or URL.",
        pricePerCall: 0.05,
        costPerCall: 0.03,
        provider: "OpenRouter",
        providerType: "openrouter",
        providerEndpoint: "https://openrouter.ai/api/v1/chat/completions",
        isActive: true,
      },
      {
        name: "Text Embedding",
        slug: "text-embedding",
        category: "ai-models",
        description: "Generate high-dimensional vector embeddings for text. Compatible with all major vector databases. Uses top embedding models via OpenRouter.",
        pricePerCall: 0.001,
        costPerCall: 0.0005,
        provider: "OpenRouter",
        providerType: "openrouter",
        providerEndpoint: "https://openrouter.ai/api/v1/chat/completions",
        isActive: true,
      },
      {
        name: "Web Search",
        slug: "web-search",
        category: "tools",
        description: "Search the web and return structured results with snippets, URLs, and relevance scores. Ideal for research agents and RAG pipelines.",
        pricePerCall: 0.01,
        costPerCall: 0.005,
        provider: "NexusBridge",
        providerType: "direct-proxy",
        providerEndpoint: null,
        isActive: true,
      },
      {
        name: "Document Parser",
        slug: "doc-parser",
        category: "tools",
        description: "Extract structured data from PDFs, images, and scanned documents. OCR pipeline returns clean text, tables, and metadata.",
        pricePerCall: 0.02,
        costPerCall: 0.01,
        provider: "NexusBridge",
        providerType: "direct-proxy",
        providerEndpoint: null,
        isActive: true,
      },
      {
        name: "Sentiment Analysis",
        slug: "sentiment",
        category: "ai-models",
        description: "Multi-language sentiment analysis with entity-level granularity. Returns sentiment scores, emotions, and aspect-based analysis.",
        pricePerCall: 0.003,
        costPerCall: 0.001,
        provider: "OpenRouter",
        providerType: "openrouter",
        providerEndpoint: "https://openrouter.ai/api/v1/chat/completions",
        isActive: true,
      },
      {
        name: "Translation",
        slug: "translation",
        category: "tools",
        description: "Neural machine translation for 100+ languages. Supports document translation, glossary customization, and formality levels.",
        pricePerCall: 0.005,
        costPerCall: 0.002,
        provider: "NexusBridge",
        providerType: "direct-proxy",
        providerEndpoint: null,
        isActive: true,
      },
      {
        name: "Summarization",
        slug: "summarize",
        category: "ai-models",
        description: "Intelligent text summarization. Produces concise summaries of articles, documents, and conversations with configurable length.",
        pricePerCall: 0.008,
        costPerCall: 0.004,
        provider: "OpenRouter",
        providerType: "openrouter",
        providerEndpoint: "https://openrouter.ai/api/v1/chat/completions",
        isActive: true,
      },
      {
        name: "Code Execution",
        slug: "code-exec",
        category: "compute",
        description: "Secure sandboxed code execution in Python, Node.js, and Go. 30s timeout, 512MB memory, network-isolated environment.",
        pricePerCall: 0.015,
        costPerCall: 0.008,
        provider: "NexusBridge",
        providerType: "direct-proxy",
        providerEndpoint: null,
        isActive: true,
      },
    ];

    const seededServices: Service[] = [];
    for (const s of serviceData) {
      const id = randomUUID();
      const totalCalls = Math.floor(Math.random() * 8000) + 500;
      const totalRevenue = parseFloat((totalCalls * s.pricePerCall).toFixed(2));
      const service: Service = {
        ...s,
        id,
        totalCalls,
        totalRevenue,
      };
      this.servicesMap.set(id, service);
      seededServices.push(service);
    }

    // Seed 5 API keys with realistic AI agent names
    const apiKeyData: { name: string; agentType: string; creditBalance: number }[] = [
      { name: "Ares Research Agent", agentType: "custom", creditBalance: 245.80 },
      { name: "Codex Autonomous Coder", agentType: "openai", creditBalance: 189.50 },
      { name: "Athena RAG Pipeline", agentType: "anthropic", creditBalance: 512.30 },
      { name: "Mercury Data Collector", agentType: "custom", creditBalance: 78.20 },
      { name: "Hermes Multi-Agent Swarm", agentType: "custom", creditBalance: 340.00 },
    ];

    const seededApiKeys: ApiKey[] = [];
    for (const ak of apiKeyData) {
      const id = randomUUID();
      const apiKey: ApiKey = {
        id,
        name: ak.name,
        key: generateKey(),
        agentType: ak.agentType,
        creditBalance: ak.creditBalance,
        isActive: true,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      };
      this.apiKeysMap.set(id, apiKey);
      seededApiKeys.push(apiKey);
    }

    // Seed 30 sample transactions (last 14 days)
    const statuses = ["completed", "completed", "completed", "completed", "completed", "failed"];
    const activeServices = seededServices.filter(s => s.isActive);

    for (let i = 0; i < 30; i++) {
      const service = activeServices[Math.floor(Math.random() * activeServices.length)];
      const apiKey = seededApiKeys[Math.floor(Math.random() * seededApiKeys.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = service.pricePerCall;
      const cost = service.costPerCall;
      const profit = parseFloat((amount - cost).toFixed(4));
      const daysAgo = Math.random() * 14;
      const hoursAgo = daysAgo * 24;
      const ts = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      const id = randomUUID();
      const transaction: Transaction = {
        id,
        apiKeyId: apiKey.id,
        serviceId: service.id,
        serviceName: service.name,
        amount,
        cost,
        profit,
        status,
        timestamp: ts,
      };
      this.transactionsMap.set(id, transaction);
    }
  }

  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    return Array.from(this.apiKeysMap.values()).sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    );
  }

  async getApiKey(id: string): Promise<ApiKey | undefined> {
    return this.apiKeysMap.get(id);
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeysMap.values()).find(ak => ak.key === key);
  }

  async createApiKey(insert: InsertApiKey): Promise<ApiKey> {
    const id = randomUUID();
    const apiKey: ApiKey = {
      id,
      name: insert.name,
      key: insert.key ?? generateKey(),
      agentType: insert.agentType,
      creditBalance: insert.creditBalance ?? 0,
      isActive: insert.isActive ?? true,
      createdAt: new Date(),
    };
    this.apiKeysMap.set(id, apiKey);
    return apiKey;
  }

  async updateApiKeyBalance(id: string, newBalance: number): Promise<void> {
    const ak = this.apiKeysMap.get(id);
    if (ak) {
      ak.creditBalance = newBalance;
    }
  }

  async addCredits(apiKeyId: string, amount: number): Promise<void> {
    const ak = this.apiKeysMap.get(apiKeyId);
    if (ak) {
      ak.creditBalance = parseFloat((ak.creditBalance + amount).toFixed(2));
    }
  }

  // Services
  async getServices(): Promise<Service[]> {
    return Array.from(this.servicesMap.values());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.servicesMap.get(id);
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.servicesMap.values()).find(s => s.slug === slug);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.servicesMap.values()).filter(s => s.category === category);
  }

  async createService(insert: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      ...insert,
      id,
      totalCalls: 0,
      totalRevenue: 0,
    };
    this.servicesMap.set(id, service);
    return service;
  }

  async toggleServiceActive(id: string): Promise<Service | undefined> {
    const service = this.servicesMap.get(id);
    if (service) {
      service.isActive = !service.isActive;
      return service;
    }
    return undefined;
  }

  async incrementServiceStats(id: string, revenue: number): Promise<void> {
    const service = this.servicesMap.get(id);
    if (service) {
      service.totalCalls += 1;
      service.totalRevenue = parseFloat((service.totalRevenue + revenue).toFixed(2));
    }
  }

  // Transactions
  async getTransactions(limit?: number): Promise<Transaction[]> {
    const sorted = Array.from(this.transactionsMap.values()).sort(
      (a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0)
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  async createTransaction(insert: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insert,
      id,
      timestamp: new Date(),
    };
    this.transactionsMap.set(id, transaction);
    return transaction;
  }

  async getChartData(): Promise<{ date: string; revenue: number; profit: number }[]> {
    const txns = Array.from(this.transactionsMap.values());
    const dayMap = new Map<string, { revenue: number; profit: number }>();

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dayMap.set(key, { revenue: 0, profit: 0 });
    }

    for (const txn of txns) {
      if (txn.status !== "completed") continue;
      const key = txn.timestamp?.toISOString().split("T")[0];
      if (key && dayMap.has(key)) {
        const entry = dayMap.get(key)!;
        entry.revenue = parseFloat((entry.revenue + txn.amount).toFixed(2));
        entry.profit = parseFloat((entry.profit + txn.profit).toFixed(2));
      }
    }

    return Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));
  }

  // Stats
  async getStats() {
    const txns = Array.from(this.transactionsMap.values());
    const completedTxns = txns.filter(t => t.status === "completed");

    const totalRevenue = parseFloat(completedTxns.reduce((sum, t) => sum + t.amount, 0).toFixed(2));
    const totalProfit = parseFloat(completedTxns.reduce((sum, t) => sum + t.profit, 0).toFixed(2));
    const totalTransactions = txns.length;
    const activeAgents = Array.from(this.apiKeysMap.values()).filter(ak => ak.isActive).length;

    // Top services by revenue
    const serviceRevMap = new Map<string, { name: string; revenue: number; calls: number }>();
    for (const t of completedTxns) {
      const existing = serviceRevMap.get(t.serviceId) ?? { name: t.serviceName, revenue: 0, calls: 0 };
      existing.revenue = parseFloat((existing.revenue + t.amount).toFixed(2));
      existing.calls += 1;
      serviceRevMap.set(t.serviceId, existing);
    }
    const topServices = Array.from(serviceRevMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { totalRevenue, totalProfit, totalTransactions, activeAgents, topServices };
  }
}

export const storage = new MemStorage();
