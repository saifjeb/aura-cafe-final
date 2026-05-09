import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controller/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", protect, authorizeRoles("admin", "employee"), createCategory);
router.put("/:id", protect, authorizeRoles("admin", "employee"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin", "employee"), deleteCategory);

export default router;
