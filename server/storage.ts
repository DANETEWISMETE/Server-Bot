import { workflows, integrations, workflowExecutions, workflowTemplates, type Workflow, type InsertWorkflow, type Integration, type InsertIntegration, type WorkflowExecution, type InsertWorkflowExecution, type WorkflowTemplate, type InsertWorkflowTemplate, type AnalyticsData } from "@shared/schema";

export interface IStorage {
  // Workflows
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflows(): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow>;
  deleteWorkflow(id: number): Promise<void>;

  // Integrations
  getIntegration(id: number): Promise<Integration | undefined>;
  getIntegrations(): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, integration: Partial<InsertIntegration>): Promise<Integration>;
  deleteIntegration(id: number): Promise<void>;

  // Workflow Executions
  getWorkflowExecution(id: number): Promise<WorkflowExecution | undefined>;
  getWorkflowExecutions(workflowId?: number): Promise<WorkflowExecution[]>;
  createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution>;
  updateWorkflowExecution(id: number, execution: Partial<InsertWorkflowExecution>): Promise<WorkflowExecution>;

  // Workflow Templates
  getWorkflowTemplate(id: number): Promise<WorkflowTemplate | undefined>;
  getWorkflowTemplates(): Promise<WorkflowTemplate[]>;
  createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate>;

  // Analytics
  getAnalyticsData(): Promise<AnalyticsData>;
}

export class MemStorage implements IStorage {
  private workflows: Map<number, Workflow>;
  private integrations: Map<number, Integration>;
  private workflowExecutions: Map<number, WorkflowExecution>;
  private workflowTemplates: Map<number, WorkflowTemplate>;
  private currentWorkflowId: number;
  private currentIntegrationId: number;
  private currentExecutionId: number;
  private currentTemplateId: number;

  constructor() {
    this.workflows = new Map();
    this.integrations = new Map();
    this.workflowExecutions = new Map();
    this.workflowTemplates = new Map();
    this.currentWorkflowId = 1;
    this.currentIntegrationId = 1;
    this.currentExecutionId = 1;
    this.currentTemplateId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample integrations
    const sampleIntegrations = [
      { name: "Adobe Photoshop", type: "image_processing", isConnected: true, config: {} },
      { name: "Figma", type: "design", isConnected: true, config: {} },
      { name: "Slack", type: "communication", isConnected: true, config: {} },
      { name: "Google Drive", type: "storage", isConnected: true, config: {} },
      { name: "Notion", type: "workspace", isConnected: true, config: {} },
      { name: "Premiere Pro", type: "video_editing", isConnected: true, config: {} },
      { name: "Dropbox", type: "storage", isConnected: false, config: {} },
      { name: "After Effects", type: "animation", isConnected: false, config: {} },
    ];

    sampleIntegrations.forEach((integration) => {
      const id = this.currentIntegrationId++;
      this.integrations.set(id, {
        ...integration,
        id,
        createdAt: new Date(),
      });
    });

    // Sample workflow templates
    const sampleTemplates = [
      {
        name: "Auto Image Optimizer",
        description: "Automatically optimize and resize images uploaded to your drive",
        category: "image_processing",
        isPopular: true,
        nodes: [
          { id: "1", type: "trigger", name: "New File Upload", app: "Google Drive" },
          { id: "2", type: "action", name: "Optimize Image", app: "Photoshop" }
        ],
        connections: [{ from: "1", to: "2" }],
        tags: ["Drive", "Photoshop"]
      },
      {
        name: "Social Media Publisher",
        description: "Share your designs across all social platforms automatically",
        category: "social_media",
        isPopular: false,
        nodes: [
          { id: "1", type: "trigger", name: "Design Ready", app: "Figma" },
          { id: "2", type: "action", name: "Publish", app: "Social Media" }
        ],
        connections: [{ from: "1", to: "2" }],
        tags: ["Figma", "Social"]
      },
      {
        name: "Video Render Pipeline",
        description: "Automate rendering and uploading of video content",
        category: "video_processing",
        isPopular: true,
        nodes: [
          { id: "1", type: "trigger", name: "Video Complete", app: "Premiere Pro" },
          { id: "2", type: "action", name: "Upload", app: "YouTube" }
        ],
        connections: [{ from: "1", to: "2" }],
        tags: ["Premiere", "YouTube"]
      }
    ];

    sampleTemplates.forEach((template) => {
      const id = this.currentTemplateId++;
      this.workflowTemplates.set(id, {
        ...template,
        id,
        createdAt: new Date(),
      });
    });

    // Sample workflow
    const sampleWorkflow = {
      name: "Image Processing Pipeline",
      description: "Process uploaded images through optimization and sharing",
      isActive: true,
      nodes: [
        { id: "1", type: "trigger", name: "New File Upload", app: "Google Drive", x: 100, y: 100 },
        { id: "2", type: "action", name: "Optimize Image", app: "Photoshop", x: 400, y: 100 },
        { id: "3", type: "action", name: "Share to Team", app: "Slack", x: 700, y: 100 },
        { id: "4", type: "output", name: "Workflow Complete", app: "", x: 1000, y: 100 }
      ],
      connections: [
        { from: "1", to: "2" },
        { from: "2", to: "3" },
        { from: "3", to: "4" }
      ]
    };

    const workflowId = this.currentWorkflowId++;
    this.workflows.set(workflowId, {
      ...sampleWorkflow,
      id: workflowId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample executions
    const now = new Date();
    const sampleExecutions = [
      {
        workflowId: workflowId,
        status: "success",
        startedAt: new Date(now.getTime() - 2 * 60 * 1000),
        completedAt: new Date(now.getTime() - 2 * 60 * 1000 + 5000),
        duration: 5000,
        executionData: {}
      },
      {
        workflowId: workflowId,
        status: "success",
        startedAt: new Date(now.getTime() - 15 * 60 * 1000),
        completedAt: new Date(now.getTime() - 15 * 60 * 1000 + 3000),
        duration: 3000,
        executionData: {}
      },
      {
        workflowId: workflowId,
        status: "failed",
        startedAt: new Date(now.getTime() - 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 60 * 60 * 1000 + 2000),
        duration: 2000,
        errorMessage: "API rate limit exceeded",
        executionData: {}
      },
      {
        workflowId: workflowId,
        status: "running",
        startedAt: new Date(),
        executionData: {}
      }
    ];

    sampleExecutions.forEach((execution) => {
      const id = this.currentExecutionId++;
      this.workflowExecutions.set(id, {
        ...execution,
        id,
      });
    });
  }

  // Workflow methods
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async getWorkflows(): Promise<Workflow[]> {
    return Array.from(this.workflows.values());
  }

  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const id = this.currentWorkflowId++;
    const newWorkflow: Workflow = {
      ...workflow,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.workflows.set(id, newWorkflow);
    return newWorkflow;
  }

  async updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow> {
    const existing = this.workflows.get(id);
    if (!existing) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    const updated: Workflow = {
      ...existing,
      ...workflow,
      updatedAt: new Date(),
    };
    this.workflows.set(id, updated);
    return updated;
  }

  async deleteWorkflow(id: number): Promise<void> {
    if (!this.workflows.has(id)) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    this.workflows.delete(id);
  }

  // Integration methods
  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const id = this.currentIntegrationId++;
    const newIntegration: Integration = {
      ...integration,
      id,
      createdAt: new Date(),
    };
    this.integrations.set(id, newIntegration);
    return newIntegration;
  }

  async updateIntegration(id: number, integration: Partial<InsertIntegration>): Promise<Integration> {
    const existing = this.integrations.get(id);
    if (!existing) {
      throw new Error(`Integration with id ${id} not found`);
    }
    const updated: Integration = {
      ...existing,
      ...integration,
    };
    this.integrations.set(id, updated);
    return updated;
  }

  async deleteIntegration(id: number): Promise<void> {
    if (!this.integrations.has(id)) {
      throw new Error(`Integration with id ${id} not found`);
    }
    this.integrations.delete(id);
  }

  // Workflow Execution methods
  async getWorkflowExecution(id: number): Promise<WorkflowExecution | undefined> {
    return this.workflowExecutions.get(id);
  }

  async getWorkflowExecutions(workflowId?: number): Promise<WorkflowExecution[]> {
    const executions = Array.from(this.workflowExecutions.values());
    if (workflowId) {
      return executions.filter(e => e.workflowId === workflowId);
    }
    return executions;
  }

  async createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution> {
    const id = this.currentExecutionId++;
    const newExecution: WorkflowExecution = {
      ...execution,
      id,
      startedAt: new Date(),
    };
    this.workflowExecutions.set(id, newExecution);
    return newExecution;
  }

  async updateWorkflowExecution(id: number, execution: Partial<InsertWorkflowExecution>): Promise<WorkflowExecution> {
    const existing = this.workflowExecutions.get(id);
    if (!existing) {
      throw new Error(`Workflow execution with id ${id} not found`);
    }
    const updated: WorkflowExecution = {
      ...existing,
      ...execution,
    };
    this.workflowExecutions.set(id, updated);
    return updated;
  }

  // Template methods
  async getWorkflowTemplate(id: number): Promise<WorkflowTemplate | undefined> {
    return this.workflowTemplates.get(id);
  }

  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    return Array.from(this.workflowTemplates.values());
  }

  async createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate> {
    const id = this.currentTemplateId++;
    const newTemplate: WorkflowTemplate = {
      ...template,
      id,
      createdAt: new Date(),
    };
    this.workflowTemplates.set(id, newTemplate);
    return newTemplate;
  }

  // Analytics method
  async getAnalyticsData(): Promise<AnalyticsData> {
    const workflows = Array.from(this.workflows.values());
    const executions = Array.from(this.workflowExecutions.values());
    
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.isActive).length;
    const totalExecutions = executions.length;
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayExecutions = executions.filter(e => 
      e.startedAt >= todayStart
    ).length;

    const completedExecutions = executions.filter(e => e.status === 'success' || e.status === 'failed');
    const successfulExecutions = executions.filter(e => e.status === 'success');
    const successRate = completedExecutions.length > 0 
      ? (successfulExecutions.length / completedExecutions.length) * 100 
      : 0;

    const executionsWithDuration = executions.filter(e => e.duration);
    const avgExecutionTime = executionsWithDuration.length > 0
      ? executionsWithDuration.reduce((sum, e) => sum + (e.duration || 0), 0) / executionsWithDuration.length
      : 0;

    // Generate trend data for last 7 days
    const executionTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExecutions = executions.filter(e => {
        const execDate = e.startedAt.toISOString().split('T')[0];
        return execDate === dateStr;
      });

      executionTrend.push({
        date: dateStr,
        successful: dayExecutions.filter(e => e.status === 'success').length,
        failed: dayExecutions.filter(e => e.status === 'failed').length,
      });
    }

    // Recent activity
    const recentActivity = executions
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 10)
      .map(e => {
        const workflow = workflows.find(w => w.id === e.workflowId);
        return {
          id: e.id,
          workflowName: workflow?.name || 'Unknown Workflow',
          status: e.status,
          executedAt: e.startedAt.toISOString(),
          duration: e.duration,
        };
      });

    return {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      todayExecutions,
      successRate,
      avgExecutionTime: avgExecutionTime / 1000, // Convert to seconds
      executionTrend,
      recentActivity,
    };
  }
}

export const storage = new MemStorage();
