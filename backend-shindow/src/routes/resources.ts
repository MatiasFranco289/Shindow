import { Router } from "express";
import resourcesController from "../controllers/resourcesController";

const resourcesRouter = Router();

resourcesRouter.get("/list", resourcesController.getResourcesAt);

export default resourcesRouter;
