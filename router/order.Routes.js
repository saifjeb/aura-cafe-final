import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

router.get("/", protect, authorizeRoles("admin", "employee"), getAllOrders);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "employee"),
  updateOrderStatus
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteOrder);

export default router;
