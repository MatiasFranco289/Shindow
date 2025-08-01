import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import validateResult from "../utils/expressValidatorValidate";

const invalidDirectoryNames = [".", ".."];
const invalidCharacters = ["/"];

const createDirectoryValidation = [
  query("path")
    .exists()
    .withMessage("path is required.")
    .isString()
    .withMessage("path must be an string.")
    .custom((value) => (value.length > 1 ? !value.endsWith("/") : true))
    .withMessage("path cannot end with a '/'."),
  query("name")
    .exists()
    .withMessage("name is required.")
    .isString()
    .withMessage("name must be an string.")
    .isLength({ max: 255 })
    .withMessage("name cannot be more than 255 characters.")
    .custom((name) => {
      const invalidName = invalidDirectoryNames.find(
        (invalidName) => invalidName === name
      );

      if (invalidName) {
        throw new Error(`a directory cannot be called '${invalidName}'`);
      }

      const invalidCharacter = invalidCharacters.find((invalidChar) =>
        name.includes(invalidChar)
      );

      if (invalidCharacter) {
        throw new Error(`directory names cannot contain '${invalidCharacter}'`);
      }

      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createDirectoryValidation;
