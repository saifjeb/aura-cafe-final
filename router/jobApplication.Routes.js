import express from "express";
import {
  createEmployeeFromAcceptedApplication,
  createJobApplication,
  deleteJobApplication,
  getAllJobApplications,
  updateJobApplicationStatus,
} from "../controller/jobApplicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createJobApplication);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "employee"),
  getAllJobApplications
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin", "employee"),
  updateJobApplicationStatus
);

router.post(
  "/:id/create-employee",
  protect,
  authorizeRoles("admin"),
  createEmployeeFromAcceptedApplication
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteJobApplication
);

export default router;
