# Iris Project

## Project Overview

Iris is a communication tool that simplifies and summarizes academic emails, sending concise notifications to users via WhatsApp. It is designed to extract the essential information from lengthy and often cluttered university emails, providing students and faculty with clear and actionable updates.

The project is containerized using Docker and orchestrated with Docker Compose. It consists of the following services:

*   **Frontend**: A React application that provides a user interface for subscribing to notifications for specific subjects.
*   **Backend**: A FastAPI application that manages user subscriptions and exposes an API for the frontend.
*   **PostgreSQL**: A relational database to store user and subscription data.
*   **pgAdmin**: A web-based administration tool for the PostgreSQL database.
*   **n8n**: A workflow automation tool that orchestrates the process of fetching emails, summarizing them using a large language model, and sending concise notifications via WhatsApp.
*   **Redis**: An in-memory data store.
*   **Evolution API**: A service for interacting with the WhatsApp API.

## System Architecture

The target architecture for this project is based on a microservices model. For a detailed explanation of the services, their responsibilities, and the interaction flows, please see the official architecture document:

*   **[System Architecture Design](./documentation/architecture.md)**

## Building and Running

The project is designed to be run with Docker and Docker Compose.

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop/)
*   Docker Compose

### 1. Initial Configuration

1.  Copy the `.env.example` file to `.env`.
2.  Update the `.env` file with your specific configurations, including database credentials and API keys.

### 2. Starting the Application

Use the provided scripts in the `scripts/` directory to start the application:

*   **Windows**: `.\scripts\start.bat`
*   **Linux/macOS**: `./scripts/start.sh`

These scripts will build the necessary Docker images and start all the services in detached mode.

### 3. Stopping the Application

To stop the application and remove the containers, you can use the `docker-compose down` command. For a safe shutdown that includes backing up the database, use the provided scripts:

*   **Windows**: `.\scripts\safe-down.bat`
*   **Linux/macOS**: `./scripts/safe-down.sh`

## Development Conventions

### Backend

The backend is a Python application built with the [FastAPI](https://fastapi.tiangolo.com/) framework. It follows standard Python best practices and uses [SQLAlchemy](https://www.sqlalchemy.org/) for database interactions.

### Frontend

The frontend is a [React](https://reactjs.org/) application built with [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/). It uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Workflow Automation

The core logic of the application is orchestrated by an [n8n](https://n8n.io/) workflow. This workflow is defined in the `n8n/workflows/iris.json` file. The workflow is responsible for:

1.  Polling a Gmail account for new emails.
2.  Extracting relevant information from the emails.
3.  Using a large language model to summarize the content.
4.  Querying the database for subscribed users.
5.  Sending notifications via the Evolution API (WhatsApp).

## Git Workflow and Branching Convention

To maintain the project organized and ensure a stable and clear version history, we will follow a branching model based on GitFlow.

### Main Branches

The repository has two main long-lived branches with specific roles:

*   **`main`**: This is the production branch. It must always be stable and ready for deployment. Code is only merged into `main` from `develop` (for new releases) or `hotfix` branches. **Direct commits to `main` are not allowed.**
*   **`develop`**: This is the main development branch. It serves as an integration point for all new features and fixes. All topic branches are created from and merged back into `develop`.

### Topic Branches (Naming Convention)

For day-to-day work, create a new branch from `develop` following this naming convention:

**`type/short-description`**

The `type` specifies the kind of work being done:

*   **`feat`**: For a new **feature**.
    *   *Example:* `feat/google-authentication`
*   **`fix`**: For a **bug fix**.
    *   *Example:* `fix/form-submission-error`
*   **`refactor`**: For code changes that neither add a feature nor fix a bug.
    *   *Example:* `refactor/simplify-user-service`
*   **`docs`**: For changes to **documentation**.
    *   *Example:* `docs/update-readme-setup`
*   **`style`**: For code **style** changes (formatting, etc.).
    *   *Example:* `style/format-backend-files`
*   **`test`**: For adding or modifying **tests**.
    *   *Example:* `test/add-subscription-tests`
*   **`chore`**: For routine **maintenance** tasks (e.g., updating dependencies).
    *   *Example:* `chore/update-react-version`

### Workflow Summary

1.  **Feature Development**:
    *   Create your branch from `develop`: `git checkout -b feat/my-new-feature develop`
    *   When finished, merge it back into `develop`: `git checkout develop && git merge feat/my-new-feature`
2.  **Release**:
    *   When `develop` is stable and ready for a release, merge it into `main`: `git checkout main && git merge develop`
3.  **Hotfix (Urgent Production Fix)**:
    *   Create your branch from `main`: `git checkout -b hotfix/critical-bug main`
    *   When finished, merge it into **both** `main` and `develop`.

### Issue Branching Workflow

To manage work related to specific issues, we will follow this workflow:

1.  **Issue Branch Creation**: When starting work on an issue, create a dedicated branch from `develop` named `issue/<issue-number>-<short-description>`.
    *   *Example:* `issue/33-implement-health-checks`
2.  **Feature/Fix/Docs Branches**: From this `issue` branch, create further topic branches (e.g., `feat/`, `fix/`, `docs/`) for individual changes related to that issue, following the existing naming conventions.
3.  **Merging Topic Branches**: Merge these topic branches back into their parent `issue` branch.
4.  **Pull Request for Issue**: Once all work for an issue is complete and all its related topic branches have been merged into the `issue` branch, create a Pull Request (PR) from the `issue` branch to `develop`.
5.  **PR Closure and Issue Resolution**: The PR for the `issue` branch will only be closed once all associated topic branches are closed and merged. Closing this PR will automatically close the corresponding issue.

### Granularidad de los Commits

Es crucial mantener un alto nivel de granularidad en los commits. Cada commit debe representar un cambio único, lógico y atómico. Evita agrupar múltiples cambios no relacionados en un solo commit.

**Directrices:**
*   **Responsabilidad Única:** Cada commit debe abordar una tarea específica, una corrección de error o un incremento de funcionalidad.
*   **Testeable:** Idealmente, el código en cada commit debería ser testeable y dejar el proyecto en un estado funcional.
*   **Progreso Incremental:** Divide las tareas grandes en commits más pequeños y manejables. Por ejemplo, si implementas una funcionalidad, separa los commits para:
    *   Andamiaje inicial
    *   Cambios en el esquema de la base de datos
    *   Implementación de endpoints de API
    *   Lógica de negocio
    *   Tests
*   **Mensajes Descriptivos:** Los mensajes de commit deben explicar claramente *qué* se cambió y *por qué*.

## Development Log

### 2025-10-28: Project Refactoring and Build Optimization

*   **Completed Project Restructuring**: Finalized the refactoring of the project structure by moving the `backend`, `frontend`, and `n8n` services into a unified `src` directory. This change was committed to the `refactor/backend` branch.
*   **Diagnosed and Fixed Frontend Build**: Investigated and resolved an extremely slow Docker build process for the `frontend` service.
    *   Identified and corrected an outdated Node.js version in the `Dockerfile`.
    *   On user suggestion, adopted `pnpm` as the definitive solution after exploring other alternatives.
    *   Modified the `frontend/Dockerfile` to use `pnpm`, reducing build times from over 9 minutes to approximately 11 seconds.
*   **Added Commit Granularity Guidelines**: Documented guidelines for granular commits in `GEMINI.md`.
*   **Implemented Microservices Architecture**: Refactored the project to implement a microservices architecture.
*   **Created Architecture Design Document**: Added a detailed architecture design document.
*   **Documented Git Workflow and Branching Convention**: Documented the Git workflow and branching conventions in `GEMINI.md`.
*   **Switched Frontend to pnpm**: Optimized frontend build times by switching to `pnpm`.
*   **Moved Services to `src` Directory**: Refactored the project structure by moving `backend`, `frontend`, and `n8n` services into a unified `src` directory.
*   **Added `.gemini` and `.github` to `.gitignore`**: Updated `.gitignore` to include `.gemini` and `.github` directories.
*   **Added `GEMINI.md` File**: Created the `GEMINI.md` file for project context.
*   **Fixed Relative Imports and Added User Router Placeholder**: Corrected relative imports in microservices `main.py` files and added a user router placeholder.
