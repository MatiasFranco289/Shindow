import { query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import validateResult from "../utils/expressValidatorValidate";

const uploadResourceValidation = [
  query("remotePath")
    .exists()
    .withMessage("remotePath is required.")
    .isString()
    .withMessage("remotePath must be a string."),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default uploadResourceValidation;
