import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import validateResult from "../utils/expressValidatorValidate";

const authValidation = [
  body("username")
    .exists()
    .withMessage("username is required.")
    .isString()
    .withMessage("username must be a string.")
    .trim()
    .escape(),
  body("password")
    .optional()
    .isString()
    .withMessage("password must be a string.")
    .trim()
    .escape(),
  body("privateKey")
    .optional()
    .isString()
    .withMessage("privateKey must be a string."),
  body("passphrase")
    .optional()
    .isString()
    .withMessage("passphrase must be a string."),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default authValidation;
