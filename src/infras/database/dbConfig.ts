import mysql from "mysql2";
import * as dotenv from "dotenv";
dotenv.config();

const sslConfig = {
  rejectUnauthorized: false, // Set to false for self-signed certs
};

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  ssl: sslConfig,
  connectTimeout: 10000,
  charset: 'utf8mb4',
  // Additional connection options
  insecureAuth: true,
});