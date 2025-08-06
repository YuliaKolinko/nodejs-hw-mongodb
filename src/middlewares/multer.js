import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/contacts.js';

export const upload = multer({
  storage: multer.diskStorage({
    destination: TEMP_UPLOAD_DIR,
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
