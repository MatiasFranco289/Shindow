import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import validateResult from "../utils/expressValidatorValidate";

const copyResourceValidation = [
  body("originPath")
    .exists()
    .withMessage("originPath is required.")
    .isString()
    .withMessage("originPath must be an string."),
  body("destinationPath")
    .exists()
    .withMessage("destinationPath is required.")
    .isString()
    .withMessage("destinationPath must be an string."),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default copyResourceValidation;
