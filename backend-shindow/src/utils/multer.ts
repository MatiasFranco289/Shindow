import multer from "multer";
import fs from "fs";
import { DEFAULT_UPLOAD_DIRECTORY } from "../constants";

/**
 * Setup multer storage to manage resource uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(DEFAULT_UPLOAD_DIRECTORY)) {
      fs.mkdirSync(DEFAULT_UPLOAD_DIRECTORY);
    }
    cb(null, DEFAULT_UPLOAD_DIRECTORY);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
export default upload;
