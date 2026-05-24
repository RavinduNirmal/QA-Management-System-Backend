import env from "dotenv";
env.config();

import express, { Request, Response } from "express";
import config from "config";
import { createServer as createServerHttps } from "https";
import { readFileSync } from "fs";
import { Server, createServer } from "http";
import bodyParser from "body-parser";
const cors = require("cors");
import { AppConfig } from "./startup/config";
import { initializeDatabase } from "./startup/database";
import { createContainer } from "./startup/container";
import { createRoutes } from "./startup/routes"; 

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Backend API is running successfully 🚀',
    status: 'active',
    environment: AppConfig.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  try {
    // 1. Initialize Database
    await initializeDatabase();
    console.log("✅ Database initialized");

    // 2. Create DI Container
    const container = await createContainer();
    console.log("✅ Dependencies initialized");

    // 3. Create Routes
    const routes = await createRoutes(container);
    app.use(routes);
    console.log("✅ Routes configured");

    // 4. Start Server
    const { isTlsEnabled, restServicePort } = AppConfig;
    
    if (isTlsEnabled) {
      const server: Server = createServerHttps({
        cert: readFileSync("tls/server.crt"),
        key: readFileSync("tls/private.key"),
      });
      app.listen(restServicePort, () => {
        console.log(`✅ Server started on port ${restServicePort} (TLS enabled)`);
      });
    } else {
      app.listen(restServicePort, () => {
        console.log(`✅ Server started on port ${restServicePort}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
startServer();

// Exports for testing
export { app, startServer };