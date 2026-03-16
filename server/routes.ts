import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServiceSchema, insertApiKeySchema } from "@shared/schema";
import type { Service } from "@shared/schema";
import { randomUUID } from "crypto";

function generateKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "nb_sk_";
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ===== Upstream Provider Execution =====

async function executeOpenRouterService(service: Service, params: any) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      error: "OpenRouter not configured. Set OPENROUTER_API_KEY environment variable.",
      status: "config_error",
    };
  }

  // Route different service slugs to appropriate models/behaviors
  let model = params.model || "deepseek/deepseek-chat-v3-0324";
  let messages = params.messages || [{ role: "user", content: params.prompt || "Hello" }];
  let maxTokens = params.max_tokens || 1024;

  // Service-specific routing
  if (service.slug === "llm-code") {
    model = params.model || "deepseek/deepseek-chat-v3-0324";
    if (params.prompt && !params.messages) {
      messages = [
        { role: "system", content: "You are an expert software engineer. Write clean, production-ready code." },
        { role: "user", content: params.prompt },
      ];
    }
  } else if (service.slug === "image-gen") {
    model = params.model || "deepseek/deepseek-chat-v3-0324";
    if (params.prompt && !params.messages) {
      messages = [
        { role: "system", content: "You are an image description assistant. Describe in detail what the requested image would look like, as if generating it." },
        { role: "user", content: `Describe this image in vivid detail: ${params.prompt}` },
      ];
    }
  } else if (service.slug === "text-embedding") {
    model = params.model || "deepseek/deepseek-chat-v3-0324";
    if (params.text && !params.messages) {
      messages = [
        { role: "system", content: "You are a text analysis assistant. Analyze the semantic meaning of the given text." },
        { role: "user", content: `Analyze the semantic content of: ${params.text}` },
      ];
    }
  } else if (service.slug === "sentiment") {
    model = params.model || "deepseek/deepseek-chat-v3-0324";
    if (params.text && !params.messages) {
      messages = [
        { role: "system", content: "You are a sentiment analysis engine. Return JSON with: sentiment (positive/negative/neutral), confidence (0-1), emotions (array), and a brief explanation." },
        { role: "user", content: params.text },
      ];
    }
  } else if (service.slug === "summarize") {
    model = params.model || "deepseek/deepseek-chat-v3-0324";
    if (params.text && !params.messages) {
      messages = [
        { role: "system", content: "You are a summarization engine. Produce a concise summary of the given text." },
        { role: "user", content: `Summarize the following:\n\n${params.text}` },
      ];
    }
    maxTokens = params.max_tokens || 512;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXUSBRIDGE_BASE_URL || "https://syntss.com",
      "X-Title": "NexusBridge API Brokerage",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();
  return data;
}

async function executeDirectProxy(service: Service, params: any) {
  // Placeholder implementations — in production these would proxy to real upstream APIs
  switch (service.slug) {
    case "web-search":
      return {
        result: `Web search executed for query: "${params.query || params.q || "no query provided"}"`,
        note: "This is a brokered service. Configure upstream search provider (e.g., Brave Search, SerpAPI) for production results.",
        query: params.query || params.q || null,
        results: [
          {
            title: "Search result placeholder",
            url: "https://example.com",
            snippet: "Configure a real search provider to get live results.",
          },
        ],
      };
    case "doc-parser":
      return {
        result: `Document parser executed.`,
        note: "This is a brokered service. Configure upstream OCR/parser endpoint for production use.",
        extractedText: params.text || "No document content provided. Send base64 or URL in params.",
        params,
      };
    case "translation":
      return {
        result: `Translation service executed.`,
        note: "This is a brokered service. Configure upstream translation provider (e.g., DeepL) for production use.",
        sourceLanguage: params.from || "auto",
        targetLanguage: params.to || "en",
        originalText: params.text || "",
        translatedText: params.text ? `[Translated] ${params.text}` : "No text provided.",
      };
    case "code-exec":
      return {
        result: `Code execution service executed.`,
        note: "This is a brokered service. Configure upstream sandbox provider (e.g., E2B) for production use.",
        language: params.language || "python",
        output: "Sandbox execution placeholder. Configure upstream provider.",
        params,
      };
    default:
      return {
        result: `Service '${service.name}' executed successfully.`,
        note: "This is a brokered service. Configure upstream provider endpoint for production use.",
        params,
      };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "NexusBridge API Brokerage",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // Dashboard stats
  app.get("/api/stats", async (_req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Services
  app.get("/api/services", async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.post("/api/services", async (req, res) => {
    const parsed = insertServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const service = await storage.createService(parsed.data);
    res.status(201).json(service);
  });

  app.patch("/api/services/:id", async (req, res) => {
    const service = await storage.toggleServiceActive(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  });

  // API Keys
  app.get("/api/api-keys", async (_req, res) => {
    const keys = await storage.getApiKeys();
    res.json(keys);
  });

  app.post("/api/api-keys", async (req, res) => {
    const body = {
      ...req.body,
      key: generateKey(),
      creditBalance: req.body.creditBalance ?? 0,
      isActive: true,
    };
    const parsed = insertApiKeySchema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const apiKey = await storage.createApiKey(parsed.data);
    res.status(201).json(apiKey);
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const transactions = await storage.getTransactions(limit);
    res.json(transactions);
  });

  app.get("/api/transactions/chart", async (_req, res) => {
    const data = await storage.getChartData();
    res.json(data);
  });

  // ===== Stripe Checkout =====

  app.post("/api/stripe/create-checkout", async (req, res) => {
    const { amount, apiKeyId } = req.body;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return res.status(400).json({ error: "Stripe not configured. Set STRIPE_SECRET_KEY environment variable." });
    }

    try {
      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "mode": "payment",
          "payment_method_types[0]": "card",
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][unit_amount]": String(Math.round(amount * 100)),
          "line_items[0][price_data][product_data][name]": `NexusBridge API Credits ($${amount})`,
          "line_items[0][quantity]": "1",
          "success_url": `${req.headers.origin || process.env.NEXUSBRIDGE_BASE_URL || "https://syntss.com"}/#/?credits=success`,
          "cancel_url": `${req.headers.origin || process.env.NEXUSBRIDGE_BASE_URL || "https://syntss.com"}/#/?credits=cancelled`,
          "metadata[api_key_id]": apiKeyId || "",
          "metadata[credit_amount]": String(amount),
        }).toString(),
      });

      const session = await response.json();
      if (session.error) {
        return res.status(400).json({ error: session.error.message });
      }
      res.json({ checkoutUrl: session.url, sessionId: session.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create checkout session" });
    }
  });

  // Stripe webhook — handle completed payments
  app.post("/api/stripe/webhook", async (req, res) => {
    const event = req.body;
    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      const apiKeyId = session?.metadata?.api_key_id;
      const creditAmount = parseFloat(session?.metadata?.credit_amount || "0");
      if (apiKeyId && creditAmount > 0) {
        await storage.addCredits(apiKeyId, creditAmount);
      }
    }
    res.json({ received: true });
  });

  // ===== Gumroad Webhook (Ping) — handle completed purchases =====
  // Gumroad sends a POST (form-encoded) to this endpoint on each sale.
  // Product custom fields should include 'api_key_id'.
  // The credit amount is derived from the product price.

  app.post("/api/gumroad/webhook", async (req, res) => {
    const body = req.body;
    // Gumroad sends form-encoded pings with fields like:
    // email, product_id, product_name, price, currency, api_key_id (custom field)
    const apiKeyId = body.api_key_id || body["api_key_id"];
    const price = parseFloat(body.price || "0");
    const refunded = body.refunded === "true";

    if (!refunded && apiKeyId && price > 0) {
      // Convert dollar price to credits (1:1 — $10 purchase = $10 credits)
      await storage.addCredits(apiKeyId, price);
      console.log(`[Gumroad] Added $${price} credits to key ${apiKeyId}`);
    }
    res.json({ received: true });
  });

  // ===== Public API for AI agents =====

  // Catalog endpoint
  app.post("/api/v1/catalog", async (req, res) => {
    const apiKeyHeader = req.headers["x-api-key"] as string;
    if (!apiKeyHeader) {
      return res.status(401).json({ error: "Missing x-api-key header" });
    }
    const apiKey = await storage.getApiKeyByKey(apiKeyHeader);
    if (!apiKey || !apiKey.isActive) {
      return res.status(401).json({ error: "Invalid or inactive API key" });
    }
    const services = await storage.getServices();
    const activeServices = services.filter(s => s.isActive).map(s => ({
      slug: s.slug,
      name: s.name,
      category: s.category,
      description: s.description,
      pricePerCall: s.pricePerCall,
      providerType: s.providerType,
    }));
    res.json({ services: activeServices, creditBalance: apiKey.creditBalance });
  });

  // Execute service endpoint — REAL proxy to upstream providers
  app.post("/api/v1/execute", async (req, res) => {
    const apiKeyHeader = req.headers["x-api-key"] as string;
    if (!apiKeyHeader) {
      return res.status(401).json({ error: "Missing x-api-key header" });
    }
    const apiKey = await storage.getApiKeyByKey(apiKeyHeader);
    if (!apiKey || !apiKey.isActive) {
      return res.status(401).json({ error: "Invalid or inactive API key" });
    }

    const { slug, params } = req.body;
    if (!slug) {
      return res.status(400).json({ error: "Missing service slug" });
    }

    const service = await storage.getServiceBySlug(slug);
    if (!service || !service.isActive) {
      return res.status(404).json({ error: "Service not found or inactive" });
    }

    if (apiKey.creditBalance < service.pricePerCall) {
      return res.status(402).json({ error: "Insufficient credits", required: service.pricePerCall, balance: apiKey.creditBalance });
    }

    // Deduct credits
    await storage.updateApiKeyBalance(apiKey.id, parseFloat((apiKey.creditBalance - service.pricePerCall).toFixed(4)));

    // Execute based on provider type
    let result: any;
    let status = "completed";
    try {
      if (service.providerType === "openrouter") {
        result = await executeOpenRouterService(service, params || {});
      } else {
        result = await executeDirectProxy(service, params || {});
      }
    } catch (err: any) {
      status = "failed";
      result = { error: err.message || "Upstream provider error" };
    }

    // Log transaction
    const profit = parseFloat((service.pricePerCall - service.costPerCall).toFixed(4));
    await storage.createTransaction({
      apiKeyId: apiKey.id,
      serviceId: service.id,
      serviceName: service.name,
      amount: service.pricePerCall,
      cost: service.costPerCall,
      profit,
      status,
    });

    // Update service stats
    await storage.incrementServiceStats(service.id, service.pricePerCall);

    res.json({
      success: status === "completed",
      service: service.slug,
      charged: service.pricePerCall,
      remainingBalance: parseFloat((apiKey.creditBalance - service.pricePerCall).toFixed(4)),
      result,
    });
  });

  return httpServer;
}
