import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  nodes: jsonb("nodes").notNull(),
  connections: jsonb("connections").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  isConnected: boolean("is_connected").default(false).notNull(),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workflowExecutions = pgTable("workflow_executions", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => workflows.id).notNull(),
  status: text("status").notNull(), // 'running', 'success', 'failed', 'pending'
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // in milliseconds
  errorMessage: text("error_message"),
  executionData: jsonb("execution_data"),
});

export const workflowTemplates = pgTable("workflow_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  nodes: jsonb("nodes").notNull(),
  connections: jsonb("connections").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
});

export const insertWorkflowExecutionSchema = createInsertSchema(workflowExecutions).omit({
  id: true,
  startedAt: true,
});

export const insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates).omit({
  id: true,
  createdAt: true,
});

// Types
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;

export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type InsertWorkflowExecution = z.infer<typeof insertWorkflowExecutionSchema>;

export type WorkflowTemplate = typeof workflowTemplates.$inferSelect;
export type InsertWorkflowTemplate = z.infer<typeof insertWorkflowTemplateSchema>;

// Analytics types
export type AnalyticsData = {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  todayExecutions: number;
  successRate: number;
  avgExecutionTime: number;
  executionTrend: { date: string; successful: number; failed: number; }[];
  recentActivity: {
    id: number;
    workflowName: string;
    status: string;
    executedAt: string;
    duration?: number;
  }[];
};
