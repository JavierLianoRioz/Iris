# Iris Project

## Project Overview

Iris is a communication tool that simplifies and summarizes academic emails, sending concise notifications to users via WhatsApp. It is designed to extract the essential information from lengthy and often cluttered university emails, providing students and faculty with clear and actionable updates.

The project is containerized using Docker and orchestrated with Docker Compose. It consists of the following services:

*   **Frontend**: A React application that provides a user interface for subscribing to notifications for specific subjects.
*   **Backend**: A FastAPI application that manages user subscriptions and exposes an API for the frontend.
*   **PostgreSQL**: A relational database to store user and subscription data.
*   **pgAdmin**: A web-based administration tool for the PostgreSQL database.
*   **n8n**: A workflow automation tool that orchestrates the process of fetching emails, summarizing them using a large language model, and sending notifications via WhatsApp.
*   **Redis**: An in-memory data store.
*   **Evolution API**: A service for interacting with the WhatsApp API.

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
