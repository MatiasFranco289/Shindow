import { NextFunction, Request, Response } from "express";
import { SshConnectionManager } from "../utils/SshConnectionManager";
import { ApiResponse, CustomError, Resource } from "../interfaces";
import { FileManager } from "../utils/FileManager";
import { ERROR_TYPE_RESOURCES, HTTP_STATUS_CODE_OK } from "../constants";
import multer from "multer";
import path from "path";
import { Server } from "socket.io";
import fs from "fs";

const sshConnectionManager = SshConnectionManager.getInstance();
const fileManager = FileManager.getInstance();

// TODO: Mover la configuracion de multer a otro lado
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads"); // Usamos __dirname para garantizar la ruta absoluta
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
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
  // TODO: Inferior tipo correcto al req
  uploadResource: (io: Server) => (req: any, res: Response) => {
    const uploadMiddleware = upload.single("file");

    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al subir el archivo", error: err.message });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se recibió ningún archivo" });
      }

      const fileName = req.file.filename;
      const filePath = path.join(__dirname, "uploads", fileName);
      const fileSize = req.file.size; // Tamaño del archivo
      let uploaded = 0;

      // Emitir progreso real
      const fileStream = fs.createReadStream(filePath);

      fileStream.on("data", (chunk) => {
        uploaded += chunk.length;
        const progress = Math.round((uploaded / fileSize) * 100);
        io.emit("upload-progress", { progress });
      });

      fileStream.on("end", () => {
        io.emit("upload-complete", { fileName });
      });

      res
        .status(200)
        .json({ message: "Archivo subido exitosamente", fileName });
    });
  },
};

export default resourcesController;
