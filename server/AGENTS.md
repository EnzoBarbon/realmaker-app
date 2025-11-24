# Server Architecture

This server uses Deno and relies on a modular architecture to handle API requests and background message processing.

## Core Stack

- **Deno**: Runtime for TypeScript execution.
- **Prisma**: ORM for database interactions (PostgreSQL).
- **Kafka (via KafkaJS)**: Message broker for async communication between services.
- **Lucia**: Authentication library (implied by `deno.json` imports, though custom auth logic exists).

## Services

The server is split into multiple runnable services defined in `deno.json`:

1.  **API Service** (`src/api/main/index.ts`):
    -   Handles HTTP requests.
    -   Uses a custom `EdgeFunctionPipeline` for routing and middleware.
    -   Auto-registers endpoints from `src/api/endpoints/`.
2.  **Webhook Service** (`src/messages-pipeline/webhook/index.ts`):
    -   Receives external webhooks (e.g., WhatsApp).
    -   Produces messages to Kafka topics.
3.  **AI Engine Service** (`src/messages-pipeline/ai-engine/index.ts`):
    -   Consumes messages from Kafka.
    -   Processes business logic (AI responses).
4.  **Sender Service** (`src/messages-pipeline/sender/index.ts`):
    -   Consumes messages from Kafka.
    -   Handles egress communication (sending messages back to users).

## Key Patterns

- **Pipeline Architecture**: The `EdgeFunctionPipeline` class (`src/api/_shared/pipeline.ts`) manages request flow, middleware (Auth, Error), and endpoint execution.
- **Endpoint Discovery**: Endpoints are auto-discovered by scanning the `endpoints` directory.
- **Shared Modules**:
    -   `api/_shared`: Auth middleware, pipeline logic.
    -   `shared`: Database (Prisma), Kafka helpers, Logger.
- **Kafka Topics**: Communication is event-driven using defined topics in `shared/types.ts`.

## Database Schema

- **User/Auth**: Users, Sessions, Keys (Lucia-compatible structure).
- **Tenancy**: `Company` model links users and subscriptions.
- **Messaging**: `Contact`, `Conversation`, `Message` models for the chat functionality.

