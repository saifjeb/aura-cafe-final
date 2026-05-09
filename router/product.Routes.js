import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controller/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, authorizeRoles("admin", "employee"), createProduct);
router.put("/:id", protect, authorizeRoles("admin", "employee"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin", "employee"), deleteProduct);

export default router;
