import express from "express";

import uploadImage  from "../middleware/uploadImage.js";
import uploadController from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post(
  "/upload_avatar",
  uploadImage,
  verifyToken,
  uploadController.uploadAvatar
);

export default router;
