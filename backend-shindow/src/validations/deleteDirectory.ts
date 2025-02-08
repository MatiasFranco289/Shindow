import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import validateResult from "../utils/expressValidatorValidate";

const deleteDirectoryValidation = [
  query("path")
    .exists()
    .withMessage("path is required.")
    .isString()
    .withMessage("path must be an string.")
    .customSanitizer((value) => value.replace(/["]/g, "")),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default deleteDirectoryValidation;
