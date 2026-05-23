// import env from "dotenv";
// env.config();
// import express, { Request, Response } from "express";
// import config from "config";
// import { createServer as createServerHttps } from "https";
// import { readFileSync } from "fs";
// import { Server, createServer } from "http";
// import logger from "./shared/logger/logger";
// import { createConnection } from "typeorm";
// import bodyParser from "body-parser";
// import { db } from "./infras/database/dbConfig";
// import { initialUser } from "./infras/utils/utils";
// import { initializeRoutes } from './startup/routes';
// import routes from './startup/routes';

// const app = express();
// const cors = require("cors");

// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// const isTlsEnabled: boolean = config.get("tls-enabled");
// const tlsMessage = isTlsEnabled ? "TLS-enabled" : "TLS-disabled";
// console.log(tlsMessage);

// app.use(cors());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// const restServicePort: number = config.get("rest-service-port");

// if (!restServicePort) throw new Error("rest service port is not configured");

// const environment = process.env.NODE_ENV;
// console.log("loaded " + environment + " environment");

// app.get('/', (_req: Request, res: Response) => {
//   res.json({
//     message: ' Backend API is running successfully 🚀',
//     status: 'active',
//     environment: process.env.NODE_ENV || 'development',
//     timestamp: new Date().toISOString(),    
//   });
// });

// // Initialize database connection and then start the server
// async function startServer() {
//   try {
//     // First connect MySQL
//     await new Promise((resolve, reject) => {
//       db.connect(function (err) {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("Database Connected!");
//           resolve(true);
//         }
//       });
//     });

//     // Then create TypeORM connection with entities
//     const connection = await createConnection();
//     console.log("TypeORM Connection established");
    
//     // Verify entities are loaded
//     console.log("Loaded entities:", connection.entityMetadatas.map(e => e.name));

//     // Initialize default user after connection is ready
//     await initialUser();

//     // Setup routes AFTER database connections are ready
//       const routes = await initializeRoutes(); // Call the async function
//     app.use(routes);

//     isTlsEnabled ? logger.info("TLS enabled") : logger.info("TLS disabled");

//     // Start the server
//     if (isTlsEnabled) {
//       const server: Server = createServerHttps({
//         cert: readFileSync("tls/server.crt"),
//         key: readFileSync("tls/private.key"),
//       });
      
//       app.listen(restServicePort, () => {
//         console.log("rest service is started at port " + restServicePort);
//       });
//     } else {
//       app.listen(restServicePort, () => {
//         console.log("rest service is started at port " + restServicePort);
//       });
//     }
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// }

// // Start the server
// startServer();

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
import { createRoutes } from "./startup/routes2"; 

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