import { NextFunction, Request, Response } from "express";
import EnvironmentManager from "../utils/EnvironmentManager";
import { SshConnectionManager } from "../utils/SshConnectionManager";
import { ApiResponse, CustomError, LoginRequest } from "../interfaces";
import {
  DEFAULT_ERROR_MESSAGE,
  ERROR_TYPE_AUTH,
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_OK,
  NODE_ENVIRONMENT_TEST,
} from "../constants";
import logger from "../utils/logger";
import { FileManager } from "../utils/FileManager";

const fileManager = FileManager.getInstance();
const environmentManager = EnvironmentManager.getInstance();
const sshConnectionManager = SshConnectionManager.getInstance();
const secret = environmentManager.getEnvironmentVariable("SECRET");
const serverIp = environmentManager.getEnvironmentVariable("SERVER_IP");
const connectionMaxAge =
  environmentManager.getEnvironmentVariable("SESSION_MAX_AGE");

const serverPort = parseInt(
  environmentManager.getEnvironmentVariable("SERVER_PORT")
);
const nodeEnvironment =
  environmentManager.getEnvironmentVariable("NODE_ENVIRONMENT");

export const ACTIVE_CONNECTION_LOGIN_MESSAGE =
  "You already have an active connection";
export const SUCCESSFUL_LOGIN_MESSAGE = "Successful login";

const authController = {
  login: async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ) => {
    const { username, password, privateKey, passphrase }: LoginRequest =
      req.body;
    const sessionId = req.sessionID;

    const clientIp = req.ip;
    let response: ApiResponse<null> = {
      status_code: HTTP_STATUS_CODE_OK,
      message: SUCCESSFUL_LOGIN_MESSAGE,
      data: [],
    };

    // If the client is already sending a cookie with a connectionId i check if that connection id
    // corresponds to an active connection.
    if (sessionId) {
      const previousConnection = sshConnectionManager.getConnection(sessionId);

      if (previousConnection) {
        response.status_code = HTTP_STATUS_CODE_CONFLICT;
        response.message = ACTIVE_CONNECTION_LOGIN_MESSAGE;

        res.status(response.status_code).json(response);
        return;
      }
    }

    // Attemps to establish a new connection
    try {
      await sshConnectionManager.Connect(
        serverIp,
        serverPort,
        sessionId,
        connectionMaxAge,
        {
          username: username,
          ...(password && { password: password }),
          privateKey:
            nodeEnvironment === NODE_ENVIRONMENT_TEST
              ? privateKey
              : fileManager.Decode(privateKey, secret),
          passphrase:
            nodeEnvironment === NODE_ENVIRONMENT_TEST
              ? passphrase
              : fileManager.Decode(passphrase, secret),
        }
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_AUTH,
        error: err,
      };

      return next(customError);
    }

    logger.info(`New connection from IP: '${clientIp}' for user ${username}.`);

    res.status(response.status_code).json(response);
  },
  logout: (req: Request, res: Response<ApiResponse<null>>) => {
    const sessionId = req.sessionID;
    let response: ApiResponse<null> = {
      status_code: HTTP_STATUS_CODE_OK,
      message: "Successful logout",
      data: [],
    };

    try {
      sshConnectionManager.EndConnection(sessionId, false);
    } catch (err) {
      logger.error(
        `The connection with the id '${sessionId}' could not be closed because the following error: `
      );
      logger.error(err.message);

      response.status_code = HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR;
      response.message = DEFAULT_ERROR_MESSAGE;
    }

    res.clearCookie("connect.sid");
    res.status(response.status_code).json(response);
  },
};

export default authController;
