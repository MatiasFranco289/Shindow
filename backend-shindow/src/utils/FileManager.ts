import * as fs from "fs";

export class FileManager {
  public static instance: FileManager;

  /**Private constructor so this class cannot be instantiated */
  private constructor() {}

  /**
   * Method used to get the singleton instance. If there are no instance of this class it creates a new one.
   *
   * @returns The unique instance of this class.
   */
  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }

    return FileManager.instance;
  }

  /**
   * Checks if the file in the given path exists or not.
   *
   * @param filepath - The path of the file.
   * @returns - A boolean being true if the file exists.
   */
  public checkFileExistence(filepath: string): boolean {
    return fs.existsSync(filepath);
  }
}
