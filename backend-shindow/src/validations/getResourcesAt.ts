import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import validateResult from "../utils/expressValidatorValidate";

const getResourcesAtValidation = [
  query("path"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getResourcesAtValidation;
