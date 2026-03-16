import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// API keys for AI agent clients
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  agentType: text("agent_type").notNull(),
  creditBalance: real("credit_balance").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Available services in the catalog
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  pricePerCall: real("price_per_call").notNull(),
  costPerCall: real("cost_per_call").notNull(),
  provider: text("provider").notNull(),
  providerType: text("provider_type").notNull(), // "openrouter" | "direct-proxy" | "internal"
  providerEndpoint: text("provider_endpoint"),
  isActive: boolean("is_active").notNull().default(true),
  totalCalls: integer("total_calls").notNull().default(0),
  totalRevenue: real("total_revenue").notNull().default(0),
});

// Transaction log
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKeyId: varchar("api_key_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  amount: real("amount").notNull(),
  cost: real("cost").notNull(),
  profit: real("profit").notNull(),
  status: text("status").notNull().default("completed"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Create insert schemas and types
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, totalCalls: true, totalRevenue: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
