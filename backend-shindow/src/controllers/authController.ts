import { NextFunction, Request, Response } from "express";
import EnvironmentManager from "../utils/EnvironmentManager";
import { SshConnectionManager } from "../utils/SshConnectionManager";
import { ApiResponse, CustomError } from "../interfaces";
import {
  ERROR_TYPE_AUTH,
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_OK,
} from "../constants";
import logger from "../utils/logger";

const environmentManager = EnvironmentManager.getInstance();
const sshConnectionManager = SshConnectionManager.getInstance();
const serverIp = environmentManager.getEnvironmentVariable("SERVER_IP");
const serverPort = parseInt(
  environmentManager.getEnvironmentVariable("SERVER_PORT")
);

const authController = {
  login: async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ) => {
    const { username, password, privateKey, passphrase } = req.body;
    const connectionId = req.session.connectionId;
    const clientIp = req.ip;
    let newConnectionIdentifier = "";
    let response: ApiResponse<null> = {
      status_code: HTTP_STATUS_CODE_OK,
      message: "Successful login",
      data: [],
    };

    // If the client is already sending a cookie with a connectionId i check if that connection id
    // corresponds to an active connection.
    if (connectionId) {
      const previousConnection =
        sshConnectionManager.getConnection(connectionId);

      if (previousConnection) {
        response.status_code = HTTP_STATUS_CODE_CONFLICT;
        response.message = "You already have an active connection";

        res.status(response.status_code).json(response);
        return;
      }
    }

    // Attemps to establish a new connection
    try {
      newConnectionIdentifier = await sshConnectionManager.Connect(
        serverIp,
        serverPort,
        {
          username: username,
          password: password,
          privateKey: privateKey,
          passphrase: passphrase,
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

    req.session.connectionId = newConnectionIdentifier;
    res.status(response.status_code).json(response);
  },
  logout: (req: Request, res: Response) => {
    // TODO: Esto deberia eliminar y terminar la conexion del sshConnectionManager
    res.clearCookie("connect.sid");
    res.status(200).send();
  },
};

export default authController;
