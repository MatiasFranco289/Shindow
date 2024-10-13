import { Router } from "express";
import resourcesController from "../controllers/resourcesController";
import getResourcesAtValidation from "../validations/getResourcesAt";

const resourcesRouter = Router();

resourcesRouter.get(
  "/list",
  getResourcesAtValidation,
  resourcesController.getResourcesAt
);

export default resourcesRouter;
