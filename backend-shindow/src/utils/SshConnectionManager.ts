import { Client } from "ssh2";
import {
  ERROR_TYPE_CONNECTION_ID_NOT_UNIQUE,
  ERROR_TYPE_RESOURCES,
  ERROR_TYPE_SSH_CONNECTION_NOT_FOUND,
} from "../constants";
import { ConnectionCredentials } from "../interfaces";
import logger from "./logger";
import path from "path";

export class SshConnectionManager {
  public static instance: SshConnectionManager;
  private connectionMap = new Map<string, Client>();

  /**The constructor of the class, it is private to prevent the class from be instantiated */
  private constructor() {}

  /**
   * Gets the unique instance of this class or if it not exists, creates a new ones.
   *
   * @returns The unique instance of SshConnectionManager class
   */
  public static getInstance(): SshConnectionManager {
    if (SshConnectionManager.instance) {
      return SshConnectionManager.instance;
    }

    SshConnectionManager.instance = new SshConnectionManager();
    return SshConnectionManager.instance;
  }

  /**
   * Returns the connection with the provided identifier or undefined
   *
   * @param connectionId - The string identifier of the connection
   * @returns - A connection if it exists or undefined
   */
  public getConnection(connectionId: string): Client | undefined {
    if (this.connectionMap.has(connectionId)) {
      return this.connectionMap.get(connectionId);
    }

    return undefined;
  }

  /**
   * Attemps to establish a connection using the provided credentials.
   * Once the connection has been established, adds the connection to the connectionMap along with the provided sessionId as identifier.
   * If the provided sessionId already exist throws a custom error.
   *
   * @param serverIP - The ip of the server to connect.
   * @param serverPort - The ssh port of the server.
   * @param sessionId - A unique identifier that will be used to identify the connection
   * @param lifetime - The time in ms after that connection will be closed and information deleted from the connections map.
   * @param credentials - The user credentials following the ConnectionCredentials interface
   *
   * @returns - A string with the provided sessionId identifying the connection
   */
  public async Connect(
    serverIP: string,
    serverPort: number,
    sessionId: string,
    lifetime: string,
    credentials: ConnectionCredentials
  ) {
    const connection = await this.CreateNewConnection(
      serverIP,
      serverPort,
      credentials
    );

    if (this.connectionMap.has(sessionId)) {
      const error = new Error();
      error.message = `There is already a connection with the identifier ${sessionId}.`;
      error.name = ERROR_TYPE_CONNECTION_ID_NOT_UNIQUE;
      throw error;
    }

    this.connectionMap.set(sessionId, connection);

    // When the lifetime of the session has expired, close the connection and delete the info from the connections map
    setTimeout(() => {
      this.EndConnection(sessionId, true);
    }, parseInt(lifetime));

    return sessionId;
  }

  /**
   * Receives a connection id and if that connection exists, it ends the connection and remove it from the connections map.
   *
   * @param connectionId - A string with the id of the connection to close.
   * @param expired - A boolean indicating if the connection expired or not.
   */
  public EndConnection(connectionId: string, expired: boolean) {
    const connectionToClose = this.connectionMap.get(connectionId);

    if (connectionToClose) {
      logger.info(
        `The connection with id '${connectionId}' ${
          expired ? "has expired" : "has been closed by the user"
        }.`
      );

      connectionToClose.end();
      this.connectionMap.delete(connectionId);
    }
  }

  /**
   * Executes a command using a ssh connection and returns a promise.
   * If the command produces an error the promise will be rejected with the reason.
   * If the provided sessionId doesn't have a valid connection it will throw an error.
   * If everything is okay the promise will be resolved with the output of the command.
   *
   * @param sessionId - The session id of the user trying to execute the command.
   * @param command - The command to execute.
   *
   * @returns - A promise to be resolved.
   */
  public ExecuteCommand(sessionId: string, command: string): Promise<string> {
    const connection = this.getConnection(sessionId);

    if (!connection) {
      const error = new Error();
      error.name = ERROR_TYPE_SSH_CONNECTION_NOT_FOUND;
      error.message = `The connection with id '${sessionId}' was not found.`;

      logger.error(
        `The client with id '${sessionId}' tried to execute the command '${command}' but the connection could not be found.`
      );

      throw error;
    }

    return new Promise((resolve, reject) => {
      connection.exec(command, (err, stream) => {
        if (err) {
          throw err;
        }

        stream
          .on("close", (code: number) => {
            logger.info(
              `The command '${command}' executed using connection with id '${sessionId}' ended with code ${code}.`
            );
          })
          .on("data", (data: Buffer) => {
            resolve(data.toString());
          })
          .stderr.on("data", (data: Buffer) => {
            const error = new Error();

            error.name = ERROR_TYPE_RESOURCES;
            error.message = data.toString();
            reject(error);
          });
      });
    });
  }

  /**
   * Returns a promises attemping to establish a connection.
   *
   * @param serverIP - A string with the ip of the server.
   * @param serverPort - A number with the ssh port of the server.
   * @param credentials - An object following the ConnectionCredentials interface with the user credentials.
   *
   * @returns - A promise of Client
   */
  private CreateNewConnection(
    serverIP: string,
    serverPort: number,
    credentials: ConnectionCredentials
  ): Promise<Client> {
    let connectionObject = {
      host: serverIP,
      port: serverPort,
    };

    for (const key in credentials) {
      if (credentials[key]) {
        connectionObject[key] = credentials[key];
      }
    }

    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn
        .on("ready", () => {
          resolve(conn);
        })
        .on("error", (err) => {
          reject(err);
        })
        .connect(connectionObject);
    });
  }

  /**
   * Uploads a file to an SSH server using SFTP and provides progress updates.
   *
   * This method initiates an SFTP file transfer from the local system to the SSH server.
   * It monitors the transfer progress and calls the provided callback function to
   * report the transfer percentage. If any errors occur during the transfer, they
   * will be thrown and can be caught in the calling function.
   *
   * @param sessionId - The session ID for the SSH connection.
   * @param localPath - The local file path of the file to be uploaded.
   * @param remotePath - The remote directory path where the file will be uploaded.
   * @param resourceName - The name of the resource being uploaded.
   * @param cb - A callback function to report transfer progress as a percentage.
   *
   * @throws {Error} If the connection with the given session ID is not found or if an error occurs during the file transfer.
   *
   * @returns {Promise<void>} Resolves when the file transfer is complete, either successfully or with an error.
   */
  public async uploadFileWithProgress(
    sessionId: string,
    localPath: string,
    remotePath: string,
    resourceName: string,
    cb: (progreess: number) => void
  ): Promise<void> {
    const connection = this.getConnection(sessionId);

    if (!connection) {
      const error = new Error();
      error.name = ERROR_TYPE_SSH_CONNECTION_NOT_FOUND;
      error.message = `The connection with id '${sessionId}' was not found.`;

      logger.error(
        `The client with id '${sessionId}' tried to upload a resource but the connection could not be found.`
      );

      throw error;
    }

    logger.info(
      `The transfer of the resource '${resourceName}' to the SSH server has been initiated.`
    );

    try {
      await new Promise<void>((resolve, reject) => {
        connection.sftp((_err, sftp) => {
          sftp.fastPut(
            localPath,
            path.join(remotePath, resourceName),
            {
              step: (totalTransferred, chunk, fileSize) => {
                const percentage = Math.floor(
                  (totalTransferred / fileSize) * 100
                );
                cb(percentage);
              },
            },
            (err) => {
              if (err) {
                logger.error(
                  `The tranfer of the resource '${resourceName}' to the SSH server has finished with the following error: ${err}`
                );

                reject(err);
              } else {
                logger.info(
                  `The tranfer of the resource '${resourceName}' to the SSH server has finished successfully.`
                );

                resolve();
              }
            }
          );
        });
      });
    } catch (err) {
      throw err;
    }
  }
}
