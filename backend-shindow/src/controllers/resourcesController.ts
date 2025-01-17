// TODO: Add postman collection
import { NextFunction, Request, Response } from "express";
import { SshConnectionManager } from "../utils/SshConnectionManager";
import { ApiResponse, CustomError, Resource } from "../interfaces";
import { FileManager } from "../utils/FileManager";
import {
  DEFAULT_UPLOAD_DIRECTORY,
  ERROR_TYPE_RESOURCES,
  ERROR_TYPE_UPLOAD_RESOURCE,
  HTTP_STATUS_CODE_OK,
} from "../constants";
import path from "path";
import { Server } from "socket.io";
import fs from "fs";
import {
  FILE_NOT_FOUND_MESSAGE,
  REMOTE_PATH_NOT_FOUND_MESSAGE,
  REMOTE_PATH_NOT_VALID,
} from "../errorHandlers/uploadResourceErrorHandler";
import logger from "../utils/logger";
import upload from "../utils/multer";

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
  /**
   * Manages the upload of a resource from a client to this backend server
   * and after that the resource is uploaded from this backend server to the SSH server.
   * Provides updates of the upload progress in real times using socket.io
   *
   * @param io - The Socket.io server instance to emit progress events.
   * @returns
   */
  uploadResource:
    (io: Server) =>
    async (req: any, res: Response<ApiResponse<null>>, next: NextFunction) => {
      const sessionId = req.sessionID;
      const remotePath = req.query.remotePath as string;
      const uploadMiddleware = upload.single("file");

      const response: ApiResponse<null> = {
        status_code: HTTP_STATUS_CODE_OK,
        message: "Resource successfully uploaded.",
        data: [],
      };
      let customError: CustomError = {
        errorType: ERROR_TYPE_UPLOAD_RESOURCE,
        error: new Error(FILE_NOT_FOUND_MESSAGE),
      };

      // Validates if the provided remotePath exist in the SSH server and you have permissions
      try {
        await sshConnectionManager.ExecuteCommand(
          sessionId,
          `ls ${remotePath}`
        );
      } catch (err) {
        customError.error = new Error(REMOTE_PATH_NOT_VALID);
        return next(customError);
      }

      uploadMiddleware(req, res, async (err: Error) => {
        if (err) {
          customError.error = err;
          return next(customError);
        }

        const { file } = req;

        // Validation of fields file and remotePath
        if (!file) return next(customError);

        const fileName = file.filename;
        const filePath = path.join(DEFAULT_UPLOAD_DIRECTORY, fileName);
        const fileSize = file.size;
        let uploaded = 0;

        logger.info(
          `The client with id '${sessionId}' has initiated the upload of the resource '${fileName}'.`
        );

        // Emit progress of the upload in realtime
        const fileStream = fs.createReadStream(filePath);

        // Tranfer of the resource from the client to this backend server
        fileStream.on("data", (chunk) => {
          uploaded += chunk.length;
          // 50% should be from the transferency between backend and ssh server using sftp

          // The progress is calculated in a range between 0% and 50% max
          const progress = Math.floor((uploaded / fileSize) * 50);
          io.emit("upload-progress", { progress });
        });

        // When the tranfer is complete and the file is in the backend server i start the tranfer from this server
        // to the ssh server
        fileStream.on("end", () => {
          logger.info(
            `The resource '${fileName}' has been successfully uploaded.`
          );

          sshConnectionManager
            .uploadFileWithProgress(
              sessionId,
              filePath,
              remotePath,
              fileName,
              (progress: number) => {
                // I remap the original percentage (between 0 - 100) to a new range between  50-100
                const mappedPercentage = Math.floor(50 + (progress / 100) * 50);

                if (mappedPercentage === 100) {
                  // Once the resource is alredy in the SSH server i delete the resource from the backend server
                  fileManager
                    .DeleteResourceAsync(filePath)
                    .then(() => {
                      logger.info(
                        `The temporal resource '${fileName} has been deleted successfully.`
                      );
                    })
                    .catch((err) => {
                      logger.error(
                        `The following error has ocurred while trying to delete the temporal resource '${fileName}': ${err}`
                      );
                    });

                  io.emit("upload-complete", { fileName });
                } else {
                  io.emit("upload-progress", mappedPercentage);
                }
              }
            )
            .then(() => {
              return res.status(response.status_code).json(response);
            })
            .catch((err) => {
              // If and error occurs during the tranfer a generic 500 error is sent to the client
              customError.error = err;
              return next(customError);
            });
        });
      });
    },
};

export default resourcesController;
