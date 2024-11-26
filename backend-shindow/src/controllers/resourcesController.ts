import { NextFunction, Request, Response } from "express";
import { SshConnectionManager } from "../utils/SshConnectionManager";
import { ApiResponse, CustomError, Resource } from "../interfaces";
import { FileManager } from "../utils/FileManager";
import { ERROR_TYPE_RESOURCES, HTTP_STATUS_CODE_OK } from "../constants";

const sshConnectionManager = SshConnectionManager.getInstance();
const fileManager = FileManager.getInstance();

const resourcesController = {
  /**
   * Returns the list of resources in the given path.
   * Receives a value "path" by query with the path to check. If it is not provided is setted to "/" by default.
   * Returns error responses if the user doesn't have sufficient permissions or if the path is invalid.
   *
   * @param req - Express request.
   * @param res - Express response.
   * @param next - Express NextFunction.
   * @returns
   */
  getResourcesAt: async (
    req: Request,
    res: Response<ApiResponse<Resource>>,
    next: NextFunction
  ) => {
    const sessionId = req.sessionID;
    const path = req.query.path || "/";
    const command = "ls -la --full-time";

    try {
      const result = await sshConnectionManager.ExecuteCommand(
        sessionId,
        `${command} "${path}"`
      );

      const resourcesList: Array<Resource> = fileManager.LsToResource(result);
      const response: ApiResponse<Resource> = {
        status_code: HTTP_STATUS_CODE_OK,
        message: "Resources successfully retrieved.",
        data: resourcesList,
      };

      res.status(response.status_code).json(response);
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_RESOURCES,
        error: err,
      };

      return next(customError);
    }
  },
};

export default resourcesController;
