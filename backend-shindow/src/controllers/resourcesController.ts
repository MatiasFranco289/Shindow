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
import multer from "multer";
import path from "path";
import { Server } from "socket.io";
import fs from "fs";
import { FILE_NOT_FOUND_MESSAGE } from "../errorHandlers/uploadResourceErrorHandler";

const sshConnectionManager = SshConnectionManager.getInstance();
const fileManager = FileManager.getInstance();

// TODO: Mover la configuracion de multer a otro lado
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(DEFAULT_UPLOAD_DIRECTORY)) {
      fs.mkdirSync(DEFAULT_UPLOAD_DIRECTORY);
    }
    cb(null, DEFAULT_UPLOAD_DIRECTORY);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

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

  uploadResource:
    (io: Server) =>
    (req: any, res: Response<ApiResponse<null>>, next: NextFunction) => {
      const sessionId = req.sessionID;
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

      uploadMiddleware(req, res, (err: Error) => {
        const { file } = req;

        if (!file) return next(customError);

        if (err) {
          customError.error = err;
          return next(customError);
        }

        const fileName = req.file.filename;
        const filePath = path.join(__dirname, "../../uploads", fileName);
        const fileSize = req.file.size;
        let uploaded = 0;

        // Emit progress of the upload in realtime
        const fileStream = fs.createReadStream(filePath);

        fileStream.on("data", (chunk) => {
          uploaded += chunk.length;
          // TODO: You should change this to reach 50% max instead of 100 because the other
          // 50% should be from the transferency between backend and ssh server using sftp
          const progress = Math.round((uploaded / fileSize) * 100);
          io.emit("upload-progress", { progress });
        });

        fileStream.on("end", () => {
          // TODO: Once the file is in the backend i need to call this method to
          // transfer the file to the server
          const result = sshConnectionManager.uploadFileWithProgress(
            sessionId,
            filePath,
            "/home/vago-dev1/test"
          );

          io.emit("upload-complete", { fileName });
        });

        res.status(response.status_code).json(response);
      });
    },
};

export default resourcesController;
