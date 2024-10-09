import express from "express";
import logger from "./utils/logger";
import EnvironmentManager from "./utils/EnvironmentManager";

const app = express();
const environmentManager = EnvironmentManager.getInstance();
const apiPort = environmentManager.getEnvironmentVariable("API_PORT");

const server = app.listen(apiPort, () => {
  logger.info(`The API is running on port ${apiPort}.`);
});

server.on("error", (err) => {
  logger.error(`Failed to start the server: ${err.message}`);
  setTimeout(() => process.exit(1), 100);
});
