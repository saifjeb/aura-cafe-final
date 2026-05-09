import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axios";

function Feedback() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
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
      const res = await api.post("/feedback", formData);
      setSuccess(res.data.message || "Feedback submitted successfully.");
      setFormData({ subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit feedback. Please login first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Feedback
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ mt: 2, bgcolor: "#0F6B73", "&:hover": { bgcolor: "#0B4F55" } }}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Feedback;
