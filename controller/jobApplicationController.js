import crypto from "crypto";
import JobApplication from "../model/JobApplication.js";
import User from "../model/User.js";

const generateTemporaryPassword = () => {
  return `Aura@${crypto.randomBytes(4).toString("hex")}`;
};

const createOrUpdateEmployeeFromApplication = async (application) => {
  let employeeUser = await User.findOne({ email: application.email });
  let temporaryPassword = null;
  let createdNewUser = false;

  if (employeeUser) {
    employeeUser.name = application.fullName || employeeUser.name;
    employeeUser.phone = application.phone || employeeUser.phone;
    employeeUser.jobTitle = application.position || employeeUser.jobTitle;
    employeeUser.role = "employee";

    await employeeUser.save();
  } else {
    temporaryPassword = generateTemporaryPassword();
    createdNewUser = true;

    employeeUser = await User.create({
      name: application.fullName,
      email: application.email,
      phone: application.phone,
      jobTitle: application.position,
      role: "employee",
      password: temporaryPassword,
    });
  }

  return {
    employeeUser,
    temporaryPassword,
    createdNewUser,
  };
};

export const createJobApplication = async (req, res) => {
  try {
    const { fullName, email, phone, position, coverMessage, cvLink } = req.body;

    if (!fullName || !email || !phone || !position || !coverMessage) {
      return res.status(400).json({
        message:
          "Full name, email, phone, position, and cover message are required",
      });
    }

    const application = await JobApplication.create({
      fullName,
      email,
      phone,
      position,
      coverMessage,
      cvLink: cvLink || "",
    });

    res.status(201).json({
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "reviewed", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    application.status = status;
    await application.save();

    let employeeData = null;
    let temporaryPassword = null;
    let message = "Application status updated successfully.";

    if (status === "accepted") {
      const result = await createOrUpdateEmployeeFromApplication(application);

      employeeData = {
        _id: result.employeeUser._id,
        name: result.employeeUser.name,
        email: result.employeeUser.email,
        phone: result.employeeUser.phone,
        jobTitle: result.employeeUser.jobTitle,
        role: result.employeeUser.role,
      };

      temporaryPassword = result.temporaryPassword;

      message = result.createdNewUser
        ? "Application accepted. New employee account created."
        : "Application accepted. Existing user updated to employee.";
    }

    res.status(200).json({
      message,
      application,
      employee: employeeData,
      temporaryPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployeeFromAcceptedApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    application.status = "accepted";
    await application.save();

    const result = await createOrUpdateEmployeeFromApplication(application);

    res.status(200).json({
      message: result.createdNewUser
        ? "Employee account created from accepted application."
        : "Existing user updated from accepted application.",
      application,
      employee: {
        _id: result.employeeUser._id,
        name: result.employeeUser.name,
        email: result.employeeUser.email,
        phone: result.employeeUser.phone,
        jobTitle: result.employeeUser.jobTitle,
        role: result.employeeUser.role,
      },
      temporaryPassword: result.temporaryPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJobApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    res.status(200).json({ message: "Job application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
