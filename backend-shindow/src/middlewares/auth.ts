import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../interfaces";
import { HTTP_STATUS_CODE_UNAUTHORIZED } from "../constants";
import { SshConnectionManager } from "../utils/SshConnectionManager";

const sshConnectionManager = SshConnectionManager.getInstance();

/**
 * Middleware function for authentication. Checks if the user is sending a sessionId through a Cookie.
 * If the user is not sending it, return a 401 error response.
 * If sessionId is provided checks if there is a valid active connection in the SshConnectionManager class.
 * If there is a valid connection it let's the user go ahead but if there is not one also returns a 401 error response.
 *
 * @param req - Express request.
 * @param res - Express response.
 * @param next - Express NextFunction.
 * @returns
 */
const protectRoutes = (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.sessionID;

  const defaultResponse: ApiResponse<null> = {
    status_code: HTTP_STATUS_CODE_UNAUTHORIZED,
    message:
      "Authentication failed. Please provide valid credentials to access this resource.",
    data: [],
  };

  if (!sessionId) {
    res.status(defaultResponse.status_code).json(defaultResponse);
    return;
  }

  const previousConnection = sshConnectionManager.getConnection(sessionId);

  if (!previousConnection) {
    res.status(defaultResponse.status_code).json(defaultResponse);
    return;
  }

  next();
};

export default protectRoutes;
