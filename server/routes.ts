import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkflowSchema, insertIntegrationSchema, insertWorkflowExecutionSchema, insertWorkflowTemplateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Workflow routes
  app.get("/api/workflows", async (req, res) => {
    try {
      const workflows = await storage.getWorkflows();
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.get("/api/workflows/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(id);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workflow" });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const validatedData = insertWorkflowSchema.parse(req.body);
      const workflow = await storage.createWorkflow(validatedData);
      res.status(201).json(workflow);
    } catch (error) {
      res.status(400).json({ message: "Invalid workflow data" });
    }
  });

  app.put("/api/workflows/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWorkflowSchema.partial().parse(req.body);
      const workflow = await storage.updateWorkflow(id, validatedData);
      res.json(workflow);
    } catch (error) {
      res.status(400).json({ message: "Failed to update workflow" });
    }
  });

  app.delete("/api/workflows/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteWorkflow(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to delete workflow" });
    }
  });

  // Integration routes
  app.get("/api/integrations", async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      res.status(400).json({ message: "Invalid integration data" });
    }
  });

  app.put("/api/integrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertIntegrationSchema.partial().parse(req.body);
      const integration = await storage.updateIntegration(id, validatedData);
      res.json(integration);
    } catch (error) {
      res.status(400).json({ message: "Failed to update integration" });
    }
  });

  // Workflow execution routes
  app.get("/api/executions", async (req, res) => {
    try {
      const workflowId = req.query.workflowId ? parseInt(req.query.workflowId as string) : undefined;
      const executions = await storage.getWorkflowExecutions(workflowId);
      res.json(executions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch executions" });
    }
  });

  app.post("/api/executions", async (req, res) => {
    try {
      const validatedData = insertWorkflowExecutionSchema.parse(req.body);
      const execution = await storage.createWorkflowExecution(validatedData);
      res.status(201).json(execution);
    } catch (error) {
      res.status(400).json({ message: "Invalid execution data" });
    }
  });

  app.put("/api/executions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWorkflowExecutionSchema.partial().parse(req.body);
      const execution = await storage.updateWorkflowExecution(id, validatedData);
      res.json(execution);
    } catch (error) {
      res.status(400).json({ message: "Failed to update execution" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getWorkflowTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertWorkflowTemplateSchema.parse(req.body);
      const template = await storage.createWorkflowTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  // Analytics route
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalyticsData();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Workflow execution trigger
  app.post("/api/workflows/:id/execute", async (req, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(workflowId);
      
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      if (!workflow.isActive) {
        return res.status(400).json({ message: "Workflow is not active" });
      }

      const execution = await storage.createWorkflowExecution({
        workflowId,
        status: "running",
        executionData: req.body || {}
      });

      // Simulate execution completion after a delay
      setTimeout(async () => {
        const success = Math.random() > 0.1; // 90% success rate
        await storage.updateWorkflowExecution(execution.id, {
          status: success ? "success" : "failed",
          completedAt: new Date(),
          duration: Math.floor(Math.random() * 10000) + 1000, // 1-11 seconds
          errorMessage: success ? undefined : "Simulated execution error"
        });
      }, 2000);

      res.status(201).json(execution);
    } catch (error) {
      res.status(500).json({ message: "Failed to execute workflow" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
