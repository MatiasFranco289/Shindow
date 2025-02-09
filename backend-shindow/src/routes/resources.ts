import { Router } from "express";
import resourcesController from "../controllers/resourcesController";
import getResourcesAtValidation from "../validations/getResourcesAt";
import { Server as SocketIOServer } from "socket.io";
import uploadResourceValidation from "../validations/uploadResource";
import createDirectoryValidation from "../validations/createDirectory";
import deleteDirectoryValidation from "../validations/deleteDirectory";
import copyResourceValidation from "../validations/copyResource";
import moveResourceValidation from "../validations/moveResource";

const resourcesRouter = (io: SocketIOServer) => {
  const router = Router();

  router.get(
    "/list",
    getResourcesAtValidation,
    resourcesController.getResourcesAt
  );

  router.post(
    "/upload",
    uploadResourceValidation,
    resourcesController.uploadResource(io)
  );

  router.post(
    "/new",
    createDirectoryValidation,
    resourcesController.createDirectory
  );

  router.delete(
    "/delete",
    deleteDirectoryValidation,
    resourcesController.deleteResource
  );

  router.post(
    "/copy",
    copyResourceValidation,
    resourcesController.copyResource
  );

  router.post(
    "/move",
    moveResourceValidation,
    resourcesController.moveResource
  );

  return router;
};

export default resourcesRouter;
