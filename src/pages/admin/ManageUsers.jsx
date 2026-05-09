import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../api/axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [workForms, setWorkForms] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const res = await api.get("/users");
      setUsers(res.data);

      const forms = {};
      res.data.forEach((user) => {
        forms[user._id] = {
          phone: user.phone || "",
          jobTitle: user.jobTitle || "",
        };
      });

      setWorkForms(forms);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleWorkChange = (userId, field, value) => {
    setWorkForms((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const handleSaveWork = async (userId) => {
    setError("");
    setSuccess("");

    try {
      const payload = {
        phone: workForms[userId]?.phone || "",
        jobTitle: workForms[userId]?.jobTitle || "",
      };

      const res = await api.patch(`/users/${userId}/work`, payload);
      setSuccess(res.data.message || "Work details saved successfully.");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save work details.");
    }
  };

  const handleChangeRole = async (userId, role) => {
    setError("");
    setSuccess("");

    try {
      const payload = { role };

      if (role === "employee" || role === "admin") {
        payload.jobTitle = workForms[userId]?.jobTitle || "";
      }

      const res = await api.patch(`/users/${userId}/role`, payload);
      setSuccess(res.data.message || "User role updated successfully.");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await api.delete(`/users/${userId}`);
      setSuccess(res.data.message);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Users
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
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
        ) : (
          <Table sx={{ minWidth: 1150 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Job Title / Work</TableCell>
                <TableCell align="right">Save Work</TableCell>
                <TableCell align="right">Role Actions</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      value={workForms[user._id]?.phone || ""}
                      onChange={(e) =>
                        handleWorkChange(user._id, "phone", e.target.value)
                      }
                      placeholder="Phone"
                      sx={{ minWidth: 140 }}
                    />
                  </TableCell>

                  <TableCell>{user.role}</TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      value={workForms[user._id]?.jobTitle || ""}
                      onChange={(e) =>
                        handleWorkChange(user._id, "jobTitle", e.target.value)
                      }
                      placeholder="e.g. Cashier"
                      sx={{ minWidth: 170 }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleSaveWork(user._id)}
                      sx={{
                        bgcolor: "#0F6B73",
                        "&:hover": { bgcolor: "#0B4F55" },
                      }}
                    >
                      Save Work
                    </Button>
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                      flexWrap="wrap"
                    >
                      {user.role !== "user" && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleChangeRole(user._id, "user")}
                        >
                          Make User
                        </Button>
                      )}

                      {user.role !== "employee" && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            handleChangeRole(user._id, "employee")
                          }
                        >
                          Make Employee
                        </Button>
                      )}

                      {user.role !== "admin" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={() => handleChangeRole(user._id, "admin")}
                        >
                          Make Admin
                        </Button>
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
}

export default ManageUsers;
