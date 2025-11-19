# Gemini Agent Creation

To create a custom agent for the Gemini CLI, you need to build a Gemini CLI extension. This involves scaffolding a new extension and then configuring it with your agent's specific prompt and tools.

## Steps to Create an Agent:

1.  **Scaffold a New Extension:**
    Open your terminal and run the following command. Replace `[your-extension-name]` with a suitable name for your agent (e.g., `mermaid-agent`):
    ```bash
    gemini extensions new [your-extension-name] mcp-server
    ```
    This command creates a new directory with the basic structure for your extension.

2.  **Understand the Extension Structure:**
    The scaffolded directory will contain files like `gemini-extension.json` (the manifest) and an MCP server implementation file (e.g., `example.ts`). These files define your extension's metadata and the custom tools your agent will expose.

3.  **Implement Your Agent's Logic:**
    You will then need to modify the MCP server implementation file to define your agent's behavior, including its prompt and any custom tools it might use. The agent's prompt can often be included directly in a `GEMINI.md` file within the extension itself, or embedded in the tool definitions.

4.  **Configure and Test:**
    Configure `gemini-extension.json` to correctly point to your MCP server. You can link your local extension for testing using `gemini extensions link <path-to-your-extension>`.

---

# Project Overview

Iris is a notification system designed to bridge the communication gap between universities and students. It captures official emails from the university, processes them, and delivers them as concise and clear WhatsApp notifications to subscribed students. The system is being developed with a focus on functionality, sustainability, maintainability, and clarity.

The system has two main flows:
1.  **Subscription:** Students can subscribe to notifications for specific subjects through a web interface.
2.  **Notification:** When the university sends an email, the system identifies the relevant subscribed students, uses an AI service (OpenRouter) to rephrase the content for clarity, and sends it as a WhatsApp message.

## Main Technologies

The project is built on a containerized microservices architecture using Docker.

-   **Frontend:** React (served with Nginx)
-   **Backend:** FastAPI (Python)
-   **Database:** PostgreSQL (for storing subscriptions and session data)
-   **Orchestration/Automation:** n8n
-   **WhatsApp Integration:** Evolution API
-   **AI Content Processing:** OpenRouter

## Building and Running

The project is designed to run with Docker Compose.

**TODO:** Add detailed instructions on how to configure and run the project using Docker Compose. A `docker-compose.yml` file will be the entry point for starting the application.

```bash
# Example command to start the system
docker-compose up -d
```

## Development Conventions

**TODO:** Define and document coding styles, testing practices, and contribution guidelines for the project.