import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

function Profile() {
  const { currentUser, setCurrentUser, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fillForm = (user) => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
    });
  };

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      let user;

      if (refreshProfile) {
        user = await refreshProfile();
      } else {
        const res = await api.get("/users/profile");
        user = res.data;
        localStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
      }

      fillForm(user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load profile. Make sure the backend is running and you are logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await api.put("/users/profile", payload);

      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);

      setSuccess(res.data.message || "Profile updated successfully.");
      setFormData((prev) => ({ ...prev, password: "" }));

      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          border: "1px solid rgba(15,107,115,0.12)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          My Profile
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography>
                <strong>Role:</strong> {currentUser?.role || "user"}
              </Typography>

              {(currentUser?.role === "employee" ||
                currentUser?.role === "admin") && (
                <Typography>
                  <strong>Job Title:</strong>{" "}
                  {currentUser?.jobTitle || "Not assigned"}
                </Typography>
              )}
            </Box>

            <Box component="form" onSubmit={handleUpdateProfile}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Phone"
                name="phone"
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                helperText="Leave empty if you do not want to change password"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#0F6B73",
                  "&:hover": { bgcolor: "#0B4F55" },
                }}
              >
                Update Profile
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Profile;
