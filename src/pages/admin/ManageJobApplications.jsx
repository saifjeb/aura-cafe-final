import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

const statusOptions = ["pending", "reviewed", "accepted", "rejected"];

const statusColors = {
  pending: "warning",
  reviewed: "info",
  accepted: "success",
  rejected: "error",
};

function ManageJobApplications() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/job-applications");
      setApplications(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load job applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const applyEmployeeResult = (data) => {
    setSuccess(data.message || "Done.");
    setEmployeeInfo(data.employee || null);
    setTemporaryPassword(data.temporaryPassword || "");
    loadApplications();
  };

  const handleStatusChange = async (id, status) => {
    setSuccess("");
    setError("");
    setEmployeeInfo(null);
    setTemporaryPassword("");

    try {
      const res = await api.patch(`/job-applications/${id}/status`, {
        status,
      });
      applyEmployeeResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update application status."
      );
    }
  };

  const handleCreateEmployee = async (id) => {
    setSuccess("");
    setError("");
    setEmployeeInfo(null);
    setTemporaryPassword("");

    try {
      const res = await api.post(`/job-applications/${id}/create-employee`);
      applyEmployeeResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create/update employee from application."
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Delete this application? This action cannot be undone.")
    ) {
      return;
    }

    setSuccess("");
    setError("");

    try {
      const res = await api.delete(`/job-applications/${id}`);
      setSuccess(res.data.message);
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete application.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Job Applications
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {employeeInfo && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography fontWeight="bold">
            Employee user updated/created:
          </Typography>
          <Typography>Name: {employeeInfo.name}</Typography>
          <Typography>Email: {employeeInfo.email}</Typography>
          <Typography>Phone: {employeeInfo.phone || "-"}</Typography>
          <Typography>Role: {employeeInfo.role}</Typography>
          <Typography>Job Title: {employeeInfo.jobTitle || "-"}</Typography>
          {temporaryPassword && (
            <Typography fontWeight="bold">
              Temporary Password: {temporaryPassword}
            </Typography>
          )}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{ p: 2, borderRadius: 4, overflowX: "auto" }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : applications.length === 0 ? (
          <Alert severity="info">No job applications yet.</Alert>
        ) : (
          <Table sx={{ minWidth: 1250 }}>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>CV</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Change Status</TableCell>
                <TableCell>Create / Update Employee</TableCell>
                {isAdmin && <TableCell align="right">Delete</TableCell>}
              </TableRow>
            </TableHead>

            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.fullName}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.phone}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography variant="body2" noWrap>
                      {app.coverMessage}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {app.cvLink ? (
                      <Link href={app.cvLink} target="_blank" rel="noreferrer">
                        Open CV
                      </Link>
                    ) : (
                      "No CV"
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={app.status}
                      color={statusColors[app.status] || "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app._id, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleCreateEmployee(app._id)}
                      sx={{
                        bgcolor: "#0F6B73",
                        "&:hover": { bgcolor: "#0B4F55" },
                      }}
                    >
                      Create Employee
                    </Button>
                  </TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(app._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
}

export default ManageJobApplications;
