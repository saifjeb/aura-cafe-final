import express from "express";
import {
  changeUserRole,
  deleteUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  updateUserWork,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.patch("/:id/role", protect, authorizeRoles("admin"), changeUserRole);
router.patch("/:id/work", protect, authorizeRoles("admin"), updateUserWork);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
