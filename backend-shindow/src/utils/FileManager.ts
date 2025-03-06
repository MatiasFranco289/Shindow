import * as fs from "fs";
import { Resource } from "../interfaces";
import CryptoJS from "crypto-js";
import logger from "./logger";

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
        const resourceName = this.IsSymbolicLink(lsLineData[0])
          ? this.GetResourceNameFromSymbolicLink(lsLine)
          : this.GetResourceNameFromResource(lsLine);

        result.push({
          isDirectory: this.IsDirectory(lsLine[0]),
          hardLinks: parseInt(lsLineData[1]),
          owner: lsLineData[2],
          group: lsLineData[3],
          size: parseInt(lsLineData[4]),
          date: lsLineData[5],
          time: lsLineData[6],
          name: resourceName,
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
   * Receives the first part of a "ls" command (Which have information about permissions) and
   * determines if a resource is or not a symbolic link.
   *
   * @param permissions - A string of permissions.
   * @returns - A boolean, being true if the resource is a symbolic link.
   */
  public IsSymbolicLink(permissions: string) {
    return permissions[0] === "l";
  }

  /**
   * Receives a line from the command 'ls' representing a symbolic link resource.
   * Separates and return the name of the resource from the rest of the information.
   *
   * @param lsLine - A line from ls command.
   * @returns - The name of the resource if is possible, otherwise it will return the original string.
   */
  public GetResourceNameFromSymbolicLink(lsLine: string) {
    lsLine = lsLine.slice(0, -1);
    const lastIndex = lsLine.lastIndexOf("/");

    if (lastIndex !== -1) {
      return lsLine.slice(lastIndex).replace("/", "");
    }

    return lsLine;
  }

  /**
   * Receives a line from the command 'ls' representing a normal resource.
   * Separates and return the name of the resource from the rest of the information.
   *
   * @param lsLine - A line from ls command.
   * @returns - The name of the resource.
   */
  public GetResourceNameFromResource(lsLine: string) {
    const regex = /-(\d{4})/;
    const splittedLine = lsLine.split(regex);
    const result = splittedLine.slice(2).join();

    return result.substring(1);
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

  /**
   * Receives an encoded string and a secret and decrypts the string.
   *
   * @param encoded - The encoded string.
   * @param secret - The secret used to encode the string.
   *
   * @returns - The original string decoded.
   */
  public Decode(encoded: string, secret: string) {
    const bytes = CryptoJS.AES.decrypt(encoded, secret);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);

    return decoded;
  }

  /**
   * Receives a resource path and attemps to delete it.
   * Throws an error if the resource can't be deleted.
   *
   * @param resourcePath - The path of the resource to be deleted.
   */
  public async DeleteResourceAsync(resourcePath: string): Promise<void> {
    try {
      await fs.promises.unlink(resourcePath);
    } catch (err) {
      throw err;
    }
  }
}
