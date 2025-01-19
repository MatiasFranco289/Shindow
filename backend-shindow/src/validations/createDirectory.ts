import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import validateResult from "../utils/expressValidatorValidate";

const createDirectoryValidation = [
  query("path")
    .exists()
    .withMessage("path is required.")
    .isString()
    .withMessage("path must be an string."),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createDirectoryValidation;
