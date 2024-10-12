import { Client } from "ssh2";
import { v4 as uuidv4 } from "uuid";
import { ERROR_TYPE_CONNECTION_ID_NOT_UNIQUE } from "../constants";
import { ConnectionCredentials } from "../interfaces";
import logger from "./logger";

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
    console.log(this.connectionMap);

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
      this.EndConnection(sessionId);
    }, parseInt(lifetime));

    return sessionId;
  }

  /**
   * Receives a connection id and if that connection exists, it ends the connection and remove it from the connections map.
   *
   * @param connectionId - A string with the id of the connection to close.
   */
  public EndConnection(connectionId: string) {
    const connectionToClose = this.connectionMap.get(connectionId);

    if (connectionToClose) {
      logger.info(`The connection with id '${connectionId}' has expired.`);

      connectionToClose.end();
      this.connectionMap.delete(connectionId);
    }
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
}
