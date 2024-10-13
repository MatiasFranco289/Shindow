import express, { Router } from "express";
import logger from "./utils/logger";
import EnvironmentManager from "./utils/EnvironmentManager";
import authRouter from "./routes/auth";
import expressSessionMiddleware from "./middlewares/expressSession";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import resourcesRouter from "./routes/resources";
import protectRoutes from "./middlewares/auth";

const app = express();
const apiRouter = Router();
const environmentManager = EnvironmentManager.getInstance();
const apiPort = environmentManager.getEnvironmentVariable("API_PORT");
const secret = environmentManager.getEnvironmentVariable("SECRET");
const sessionMaxAge =
  environmentManager.getEnvironmentVariable("SESSION_MAX_AGE");

app.use("/api", apiRouter);

apiRouter.use(express.json());
apiRouter.use(expressSessionMiddleware(secret, sessionMaxAge));

apiRouter.use("/auth", authRouter);

apiRouter.use(protectRoutes);
apiRouter.use("/resources", resourcesRouter);

apiRouter.use(errorHandlerMiddleware);

const server = app.listen(apiPort, () => {
  logger.info(`The API is running on port ${apiPort}.`);
});

server.on("error", (err) => {
  logger.error(`Failed to start the server: ${err.message}`);
  setTimeout(() => process.exit(1), 100);
});
