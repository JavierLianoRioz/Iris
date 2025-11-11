# Development Conventions

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