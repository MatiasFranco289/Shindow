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

const io = new SocketIOServer({
  cors: {
    origin: "*", // TODO: Ajustar
  },
});

const environmentManager = EnvironmentManager.getInstance();
const apiPort = environmentManager.getEnvironmentVariable("API_PORT");
const secret = environmentManager.getEnvironmentVariable("SECRET");
const sessionMaxAge =
  environmentManager.getEnvironmentVariable("SESSION_MAX_AGE");

app = setCorsOptions(app);
app.use("/api", apiRouter);

apiRouter.use(express.json());
apiRouter.use(expressSessionMiddleware(secret, sessionMaxAge));

apiRouter.use("/auth", authRouter);

apiRouter.use(protectRoutes);
apiRouter.use("/resources", resourcesRouter(io));

apiRouter.use(errorHandlerMiddleware);

//TODO: Arreglar, Manejar eventos de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
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
