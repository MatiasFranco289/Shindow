import * as fs from "fs";
import { Resource } from "../interfaces";

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
   * Receives the output of a 'ls -l --full-time' command and organize the data creating
   * an object folowing the 'Resource' interface for each resource in the string.
   *
   * @param ls - The output of a 'ls -lh --full-time' command.
   * @returns - An array of Resource.
   */
  public LsToResource(ls: string): Array<Resource> {
    const result: Array<Resource> = [];
    const resourceList: Array<string> = ls.split("\n");

    resourceList.forEach((lsLine) => {
      const lsLineData = lsLine.split(" ").filter(Boolean);

      if (lsLineData.length > 2) {
        result.push({
          isDirectory: this.IsDirectory(lsLine[0]),
          hardLinks: parseInt(lsLineData[1]),
          owner: lsLineData[2],
          group: lsLineData[3],
          size: parseInt(lsLineData[4]),
          date: lsLineData[5],
          time: lsLineData[6],
          name: lsLineData[8],
        });
      }
    });

    return result;
  }

  /**
   * Receives the first part of a "ls" command (Which have information about permissions) and
   * determines if a resource is or not a directory.
   *
   * @param permissions - A string of permissions.
   * @returns - A boolean, being true if the resource is a directory.
   */
  public IsDirectory(permissions: string) {
    return permissions[0] === "d";
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
