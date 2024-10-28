import { Express } from "express";
import cors from "cors";

/**
 * This function sets the cors middleware
 * Returns the provided router with the configured cors.
 *
 * @param app - Express
 * @returns - The same Express with the cors setup.
 */
export default function setCorsOptions(app: Express) {
  const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Si necesitas enviar cookies
  };

  app.use(cors(corsOptions));
  return app;
}
