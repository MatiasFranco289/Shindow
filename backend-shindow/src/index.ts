import express, { Router } from "express";
import { Server as SocketIOServer } from "socket.io";
import logger from "./utils/logger";
import EnvironmentManager from "./utils/EnvironmentManager";
import authRouter from "./routes/auth";
import expressSessionMiddleware from "./middlewares/expressSession";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import resourcesRouter from "./routes/resources";
import protectRoutes from "./middlewares/auth";
import setCorsOptions from "./middlewares/cors";

var app = express();
const apiRouter = Router();

const environmentManager = EnvironmentManager.getInstance();
const apiPort = environmentManager.getEnvironmentVariable("API_PORT");
const secret = environmentManager.getEnvironmentVariable("SECRET");
const sessionMaxAge =
  environmentManager.getEnvironmentVariable("SESSION_MAX_AGE");
const clientDomain = environmentManager.getEnvironmentVariable("CLIENT_DOMAIN");

const io = new SocketIOServer({
  cors: {
    origin: clientDomain,
  },
});

app = setCorsOptions(app);
app.use("/api", apiRouter);

apiRouter.use(express.json());
apiRouter.use(expressSessionMiddleware(secret, sessionMaxAge));

apiRouter.use("/auth", authRouter);

apiRouter.use(protectRoutes);
apiRouter.use("/resources", resourcesRouter(io));

apiRouter.use(errorHandlerMiddleware);

io.on("connection", (socket) => {
  logger.info("Socket.IO client connected.");

  socket.on("disconnect", () => {
    logger.info("Socket.IO client disconnected.");
  });
});

const server = app.listen(apiPort, () => {
  logger.info(`The API is running on port ${apiPort}.`);
});

server.on("error", (err) => {
  logger.error(`Failed to start the server: ${err.message}`);
  setTimeout(() => process.exit(1), 100);
});

io.attach(server);

export default app;
