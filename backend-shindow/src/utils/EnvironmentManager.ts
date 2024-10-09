import dotenv from "dotenv";
import { EnvironmentVariables } from "../interfaces";
import { FileManager } from "./FileManager";
import { DEFAULT_NODE_ENVIRONMENT } from "../constants";
import logger from "./logger";

/** Singleton class responsible for managing environment variables.*/
export default class EnvironmentManager {
  public static instance: EnvironmentManager;
  private static environmentVariables: EnvironmentVariables = {
    API_DOMAIN: "",
    API_PORT: "",
    TZ: "",
  };

  private constructor() {}

  /**
   * Returns the current class instance or if there are no existent instances creates a new one.
   *
   * @returns A unique instance of the class EnvironmentManager.
   */
  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      const fileManager = FileManager.getInstance();

      EnvironmentManager.instance = new EnvironmentManager();

      let nodeEnvironment: string = process.env.NODE_ENV;

      // NODE_ENVIRONMENT is not in the .env file, it is added by docker or by cross-env depending the execution context
      if (!nodeEnvironment) {
        nodeEnvironment = DEFAULT_NODE_ENVIRONMENT;
        logger.warn(
          `NODE_ENV value could not be retrieved. Setting to default value '${DEFAULT_NODE_ENVIRONMENT}'.`
        );
      }

      // HOSTNAME is added to environment by docker, so if it not exists the project is not running in docker
      // if the project is not running in docker i nede to load environment variables from the corresponding .env file
      if (!process.env.HOSTNAME) {
        let environmentFileName = `.env.${nodeEnvironment}`;

        if (!fileManager.checkFileExistence(environmentFileName)) {
          const error = new Error();
          error.message = `The environment file '${environmentFileName} could not be found.'`;
          logger.error(error.message);
          throw error;
        }

        dotenv.config({ path: environmentFileName });
      }

      for (const key in EnvironmentManager.environmentVariables) {
        let newValue = process.env[key];
        EnvironmentManager.environmentVariables[key] = newValue;

        if (!newValue) {
          const error = new Error();
          error.message = `Environment variable '${key}' value not found.`;
          logger.error(error.message);
          throw error;
        }
      }

      logger.info("Environment variables successfully loaded.");
    }

    return EnvironmentManager.instance;
  }

  /**
   * Returns the value of the specified key of the static member 'environmentVariables'.
   *
   * @param varName - The environment variable name you want to get.
   * @returns - A string with the value of the specifiec environment variable.
   */
  public getEnvironmentVariable(varName: keyof EnvironmentVariables): string {
    return EnvironmentManager.environmentVariables[varName];
  }
}
