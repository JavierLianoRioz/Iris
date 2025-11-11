# Building and Running

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