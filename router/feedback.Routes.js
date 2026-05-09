import express from "express";
import {
  createFeedback,
  deleteFeedback,
  getAllFeedback,
  getApprovedFeedback,
  updateFeedbackStatus,
} from "../controller/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/approved", getApprovedFeedback);
router.post("/", protect, createFeedback);

router.get("/", protect, authorizeRoles("admin", "employee"), getAllFeedback);
router.patch("/:id/status", protect, authorizeRoles("admin", "employee"), updateFeedbackStatus);
router.delete("/:id", protect, authorizeRoles("admin", "employee"), deleteFeedback);

export default router;
