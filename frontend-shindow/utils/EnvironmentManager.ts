import {
  DEFAULT_API_BASE_URL,
  DEFAULT_CLIENT_BASE_URL,
  DEFAULT_MAX_KEY_SIZE,
  DEFAULT_TZ,
  DEFAULT_INITIAL_PATH,
} from "@/constants";
import { EnvironmentVariables } from "@/interfaces";

export default class EnvironmentManager {
  private static instance: EnvironmentManager;
  private environmentVariables: EnvironmentVariables = {
    NEXT_PUBLIC_SECRET: "",
    NEXT_PUBLIC_KEY_FILE_MAX_SIZE: DEFAULT_MAX_KEY_SIZE,
    NEXT_PUBLIC_TZ: DEFAULT_TZ,
    NEXT_PUBLIC_API_BASE_URL: DEFAULT_API_BASE_URL,
    NEXT_PUBLIC_CLIENT_BASE_URL: DEFAULT_CLIENT_BASE_URL,
    NEXT_PUBLIC_INITIAL_PATH: DEFAULT_INITIAL_PATH,
  };

  private constructor() {}

  public static getInstance() {
    if (!EnvironmentManager.instance) {
      this.Initialize();
    }

    return EnvironmentManager.instance;
  }

  /**
   * This method creates a new instance of EnvironmentManager and assign it to the static variable 'instance'.
   *
   * Also attemps to recover from the environment and assign the value to each key of environmentVariables.
   * If a value could not be found in the environment but it is already assigned with a default value it prints a warning.
   * If a value could not be found in the environment and has no default value it will throw an error.
   */
  private static Initialize() {
    this.instance = new EnvironmentManager();

    const environmentVariables: Partial<EnvironmentVariables> = {
      NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET,
      NEXT_PUBLIC_KEY_FILE_MAX_SIZE: process.env.NEXT_PUBLIC_KEY_FILE_MAX_SIZE,
      NEXT_PUBLIC_TZ: process.env.NEXT_PUBLIC_TZ,
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_CLIENT_BASE_URL: process.env.NEXT_PUBLIC_CLIENT_BASE_URL,
      NEXT_PUBLIC_INITIAL_PATH: process.env.NEXT_PUBLIC_INITIAL_PATH,
    };

    for (const key in environmentVariables) {
      const initialValue =
        this.instance.environmentVariables[key as keyof EnvironmentVariables];
      const valueFromEnv =
        environmentVariables[key as keyof EnvironmentVariables];

      // If the value of the variable is not found in the environment
      if (valueFromEnv === undefined) {
        // If has no default value
        if (initialValue === undefined) {
          const error = new Error();
          error.message = `The value of the variable ${key} could not be found in the environment.`;
          console.error(error.message);
          throw error;
        } else {
          // Has a default value
          console.warn(
            `The value of the variable ${key} could not be found in the environment. Default value has been set.`
          );
        }
      } else {
        this.instance.environmentVariables[key as keyof EnvironmentVariables] =
          valueFromEnv;
      }
    }
  }

  /**
   * Returns the value of an environment variable.
   *
   * @param varName - The name of the variable.
   * @returns - A string with the value of the variable.
   */
  public GetEnvironmentVariable(varName: keyof EnvironmentVariables) {
    return this.environmentVariables[varName];
  }
}
