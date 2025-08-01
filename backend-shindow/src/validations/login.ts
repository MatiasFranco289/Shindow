import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import validateResult from "../utils/expressValidatorValidate";

export const USERNAME_LENGHT_VALIDATION_MSG = "username cannot be blank";
export const USERNAME_EXISTS_VALIDATION_MSG = "username is required.";
export const USERNAME_IS_STRING_VALIDATION_MSG = "username must be a string.";

export const PASSWORD_LENGHT_VALIDATION_MSG = "password cannot be blank";
export const PASSWORD_IS_STRING_VALIDATION_MSG = "password must be a string.";

export const PRIVATE_KEY_IS_STRING_VALIDATION_MSG =
  "privateKey must be a string.";

export const PASSPHRASE_IS_STRING_VALIDATION_MSG =
  "passphrase must be a string.";

export const authValidation = [
  body("username")
    .exists()
    .withMessage(USERNAME_EXISTS_VALIDATION_MSG)
    .isString()
    .withMessage(USERNAME_IS_STRING_VALIDATION_MSG)
    .isLength({ min: 1 })
    .withMessage(USERNAME_LENGHT_VALIDATION_MSG)
    .trim()
    .escape(),
  body("password")
    .optional()
    .isString()
    .withMessage(PASSWORD_IS_STRING_VALIDATION_MSG)
    .isLength({ min: 1 })
    .withMessage(PASSWORD_LENGHT_VALIDATION_MSG)
    .trim()
    .escape(),
  body("privateKey")
    .optional()
    .isString()
    .withMessage(PRIVATE_KEY_IS_STRING_VALIDATION_MSG),
  body("passphrase")
    .optional()
    .isString()
    .withMessage(PASSPHRASE_IS_STRING_VALIDATION_MSG),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];
