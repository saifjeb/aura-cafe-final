import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axios";

const positions = [
  "Barista",
  "Waiter / Waitress",
  "Cashier",
  "Kitchen Helper",
  "Pastry Assistant",
  "Shift Supervisor",
];

function Careers() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    coverMessage: "",
    cvLink: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/job-applications", formData);
      setSuccess(res.data.message || "Application submitted successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        coverMessage: "",
        cvLink: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          border: "1px solid rgba(15,107,115,0.12)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Apply for a Job
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Join the AuraCafe team. Fill in the form below and we will review your
          application.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="fullName"
            margin="normal"
            value={formData.fullName}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            label="Phone"
            name="phone"
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Position</InputLabel>
            <Select
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              {positions.map((position) => (
                <MenuItem key={position} value={position}>
                  {position}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            label="Why do you want to join us?"
            name="coverMessage"
            margin="normal"
            multiline
            rows={4}
            value={formData.coverMessage}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="CV Link"
            name="cvLink"
            margin="normal"
            value={formData.cvLink}
            onChange={handleChange}
            helperText="Optional: paste a Google Drive, OneDrive, or portfolio link."
          />

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              mt: 2,
              bgcolor: "#0F6B73",
              "&:hover": { bgcolor: "#0B4F55" },
              borderRadius: 3,
              px: 4,
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Careers;
