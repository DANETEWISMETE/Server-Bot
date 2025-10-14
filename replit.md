# FlowCraft - Workflow Automation Platform

## Overview

FlowCraft is a workflow automation platform designed for creative professionals. It enables users to build custom workflows that connect different applications and services, with detailed analytics and performance tracking. The platform features a visual workflow builder, pre-built templates, integration management, and comprehensive analytics dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Architecture

**Frontend Framework**: React with TypeScript using Vite as the build tool and development server. The application uses client-side routing via Wouter for navigation.

**Backend Framework**: Express.js server with TypeScript, running in development mode with tsx and compiled with esbuild for production.

**Monorepo Structure**: The application follows a monorepo pattern with three main directories:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript types and schemas used by both frontend and backend

### UI Component System

**Design System**: shadcn/ui component library with Radix UI primitives, providing a comprehensive set of accessible, customizable components.

**Styling Approach**: Tailwind CSS with CSS variables for theming, supporting both light and dark modes. The design uses a neutral base color scheme with custom color variables for primary, secondary, accent, and semantic colors.

**Component Architecture**: All UI components are built as reusable React components with TypeScript, using the `cn()` utility function for conditional class merging and `cva` (class-variance-authority) for variant-based styling.

### Data Management

**ORM**: Drizzle ORM configured for PostgreSQL, with schema definitions in `shared/schema.ts` and migrations output to the `migrations/` directory.

**Database Provider**: Neon serverless PostgreSQL (based on `@neondatabase/serverless` dependency).

**Schema Design**: Four main tables:
- `workflows` - Stores workflow definitions with nodes and connections as JSON
- `integrations` - Manages third-party service connections
- `workflowExecutions` - Tracks execution history and performance metrics
- `workflowTemplates` - Pre-built workflow templates for quick setup

**Data Storage Pattern**: The application implements an abstraction layer via the `IStorage` interface, with both in-memory (`MemStorage`) and database implementations possible. This allows for flexible data persistence strategies.

### State Management

**Server State**: TanStack Query (React Query) handles all server state, API calls, caching, and synchronization with configurable options for refetching and stale time.

**API Communication**: Custom `apiRequest` wrapper function handles HTTP requests with automatic error handling and JSON serialization.

**Form State**: React Hook Form with Zod schema validation for type-safe form handling.

### API Architecture

**RESTful Design**: Standard REST endpoints organized by resource type (workflows, integrations, templates, executions, analytics).

**Route Structure**:
- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get single workflow
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow
- `POST /api/workflows/:id/execute` - Execute workflow
- Similar patterns for integrations, templates, and executions

**Validation**: Request body validation using Drizzle-Zod generated schemas from database table definitions.

**Error Handling**: Centralized error middleware that catches and formats errors with appropriate HTTP status codes.

### Development Environment

**Hot Module Replacement**: Vite dev server with custom middleware integration into Express for seamless full-stack development.

**Request Logging**: Custom middleware logs API requests with method, path, status, duration, and response preview.

**Type Safety**: Strict TypeScript configuration across the entire codebase with path aliases for clean imports (@/, @shared/).

**Build Process**: Separate build commands for frontend (Vite) and backend (esbuild), with bundled output to `dist/` directory.

### Visual Workflow Builder

**Node-Based Editor**: Custom React components for rendering workflow nodes with drag-and-drop positioning (nodes contain x, y coordinates).

**Node Types**: Three types of nodes - triggers (workflow start), actions (processing steps), and outputs (workflow completion).

**Connection System**: Visual connections between nodes stored as JSON arrays with from/to node references.

**Workflow Persistence**: Nodes and connections stored as JSONB in PostgreSQL for flexible schema evolution.

## External Dependencies

### UI & Styling
- **Radix UI**: Comprehensive set of unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS for processing
- **class-variance-authority**: Type-safe variant styling for components
- **Embla Carousel**: Carousel/slider functionality

### Data & Forms
- **Drizzle ORM**: TypeScript ORM with PostgreSQL dialect
- **Drizzle-Zod**: Schema validation from Drizzle table definitions
- **Zod**: Runtime type validation
- **React Hook Form**: Form state management with validation

### Server & API
- **Express**: Web server framework
- **Neon Serverless**: PostgreSQL database client optimized for serverless
- **connect-pg-simple**: PostgreSQL session store for Express (though sessions may not be fully implemented)

### Client State & Routing
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation and formatting

### Development Tools
- **Vite**: Frontend build tool and dev server with HMR
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript/TypeScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

### Additional Notes
- There is a standalone `index.js` file that appears to be an unrelated Discord bot for Minecraft server status checking - this is likely leftover code and not part of the FlowCraft application architecture.