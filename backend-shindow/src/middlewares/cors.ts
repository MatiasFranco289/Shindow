import { Express } from "express";
import cors from "cors";
import EnvironmentManager from "../utils/EnvironmentManager";

const environmentManager = EnvironmentManager.getInstance();

/**
 * This function sets the cors middleware
 * Returns the provided router with the configured cors.
 *
 * @param app - Express
 * @returns - The same Express with the cors setup.
 */
export default function setCorsOptions(app: Express) {
  const corsOptions = {
    origin: environmentManager.getEnvironmentVariable("CLIENT_DOMAIN"),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Si necesitas enviar cookies
  };

  app.use(cors(corsOptions));
  return app;
}
