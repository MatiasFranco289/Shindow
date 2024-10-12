// TODO: Agregar los logs al gitignore
// TODO: Agregar un .env example
// TODO: Aplicar sanitizacion
// TODO: Agregar interface a los del body

// TODO: Agregar middleware de verificacion de sesion (Que pasa si vence la cookie?)
// TODO: Se deberia eliminar el hash y la conexion cuando la cookie se venza.
// TODO: Termianr el endpoint de logout

import express, { Router } from "express";
import logger from "./utils/logger";
import EnvironmentManager from "./utils/EnvironmentManager";
import authRouter from "./routes/auth";
import expressSessionMiddleware from "./middlewares/expressSessionMiddleware";
import errorHandlerMiddleware from "./middlewares/errorHandler";

const app = express();
const apiRouter = Router();
const environmentManager = EnvironmentManager.getInstance();
const apiPort = environmentManager.getEnvironmentVariable("API_PORT");
const secret = environmentManager.getEnvironmentVariable("SECRET");

app.use("/api", apiRouter);

apiRouter.use(express.json());
apiRouter.use(expressSessionMiddleware(secret));

apiRouter.use("/auth", authRouter);

apiRouter.use(errorHandlerMiddleware);

const server = app.listen(apiPort, () => {
  logger.info(`The API is running on port ${apiPort}.`);
});

server.on("error", (err) => {
  logger.error(`Failed to start the server: ${err.message}`);
  setTimeout(() => process.exit(1), 100);
});
