import env from "dotenv";
import config from "config";

env.config();

export const AppConfig = {
  restServicePort: config.get<number>("rest-service-port"),
  isTlsEnabled: config.get<boolean>("tls-enabled"),
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default AppConfig;