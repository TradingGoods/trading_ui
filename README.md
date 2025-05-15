# 📄 Document Management Application – Setup Instructions

This guide provides step-by-step instructions to set up and run the **Document Management Application** using Docker Compose. The application includes:

- **Frontend:** Angular  
- **Backend:** Spring Boot

---

## 🧰 Prerequisites

Make sure the following tools are installed on your system:

- **[Docker](https://www.docker.com/get-started):** Required to run containers.
- **Docker Compose:** Comes with Docker Desktop. If using Docker Engine, you may need to install it separately.
- **[Git](https://git-scm.com/downloads):** Required to clone the repositories.

---

## 📁 Directory Structure

Ensure your project folder follows this structure:

```
<code_folder>
├── trading_ui
└── trading_backend
    └── authorisation
```

---

## 📥 Clone Repositories

Open your terminal and run the following commands:

```bash
git clone https://github.com/TradingGoods/trading_ui.git
# Folder structure: trading_ui

git clone https://github.com/TradingGoods/tradingAuthorisation.git trading_backend/authorisation
# Folder structure: trading_backend/authorisation
```

We clone the backend repo into a directory structure that matches the `docker-compose.yml`.

---

## 🚀 Build and Run with Docker Compose

Navigate to the root folder (`<code_folder>`) containing both `trading_ui` and `trading_backend`, then run:

```bash
docker compose up --build -d
```

This command will:

- `--build`: Build Docker images for frontend and backend.
- `-d`: Run containers in detached mode (in the background).

---

## 🌐 Access the Application

Once running, open your browser and go to:

```
http://localhost:8081
```

---

## 👤 Create an Account

Before logging in, register a new user account through the application's UI.

---

## 🔐 Login

After registering, log in using your credentials.

---

## 🐳 Docker Compose File

Below is the content of `docker-compose.yml`. Save this file in the `<code_folder>` directory.

```yaml
services:
  database:
    image: postgres:16
    container_name: postgres-container-compose
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    ports:
      - 5432:5432
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  frontend:
    build:
      context: ./trading_ui
    container_name: trading-ui
    ports:
      - 8081:80
    volumes:
      - ./trading_ui:/app
    networks:
      - app-network
    depends_on:
      - backend

  backend:
    build:
      context: ./trading_backend/authorisation
    container_name: trading-backend
    ports:
      - 8080:8080
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://database:5432/mydb
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    networks:
      - app-network
    depends_on:
      - database

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

---


