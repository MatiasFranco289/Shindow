import { Router } from "express";
import resourcesController from "../controllers/resourcesController";
import getResourcesAtValidation from "../validations/getResourcesAt";
import { Server as SocketIOServer } from "socket.io";
import uploadResourceValidation from "../validations/uploadResource";

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

  return router;
};

export default resourcesRouter;
