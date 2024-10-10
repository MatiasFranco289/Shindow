// TODO: Agregar los logs al gitignore
import express, { Router } from "express";
import logger from "./utils/logger";
import EnvironmentManager from "./utils/EnvironmentManager";
import authRouter from "./routes/auth";

const app = express();
const apiRouter = Router();
const environmentManager = EnvironmentManager.getInstance();
const apiPort = environmentManager.getEnvironmentVariable("API_PORT");

app.use("/api", apiRouter);

apiRouter.use(express.json());
apiRouter.use("/auth", authRouter);

const server = app.listen(apiPort, () => {
  logger.info(`The API is running on port ${apiPort}.`);
});

server.on("error", (err) => {
  logger.error(`Failed to start the server: ${err.message}`);
  setTimeout(() => process.exit(1), 100);
});
