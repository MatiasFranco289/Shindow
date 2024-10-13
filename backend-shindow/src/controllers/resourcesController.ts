import { Request, Response } from "express";

const resourcesController = {
  getResourcesAt: (req: Request, res: Response) => {
    res.status(200).json({ hi: "Finish me!" });
  },
};

export default resourcesController;
