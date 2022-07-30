import express from "express";
import {
    deleteUser,
  getAllUsersInfo,
  getUserInfo,
  updateUser,
  updateUserRole,
} from "../controllers/UserControllers.js";

import { verifyAdmin, verifyToken } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/info", verifyToken, getUserInfo);
router.get("/all", verifyAdmin, getAllUsersInfo);
router.patch("/update", verifyToken, updateUser);
router.patch("/update_role/:id", verifyAdmin, updateUserRole);
router.get('/delete/:id',verifyToken, verifyAdmin, deleteUser)


export default router;
