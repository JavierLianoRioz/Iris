# Project Overview

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

*   **[System Architecture Design](./architecture.md)**