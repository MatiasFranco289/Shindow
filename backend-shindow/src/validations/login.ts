import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import validateResult from "../utils/expressValidatorValidate";

const authValidation = [
  body("username")
    .exists()
    .withMessage("username is required.")
    .isString()
    .withMessage("username must be a string."),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default authValidation;
