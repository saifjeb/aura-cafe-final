import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import api from "../../api/axios";

function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get("/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleStatusChange = async (id, status) => {
    setError("");
    setSuccess("");
    try {
      const res = await api.patch(`/feedback/${id}/status`, { status });
      setSuccess(res.data.message);
      loadFeedback();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update feedback status.");
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback entry? This action cannot be undone.")) return;

    setError("");
    setSuccess("");
    try {
      const res = await api.delete(`/feedback/${id}`);
      setSuccess(res.data.message);
      loadFeedback();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete feedback.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Feedback
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper} sx={{ p: 2, borderRadius: 4, overflowX: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.user?.name || "Anonymous"}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.message}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {item.status !== "approved" && (
                        <Button size="small" variant="contained" onClick={() => handleStatusChange(item._id, "approved")}>
                          Approve
                        </Button>
                      )}
                      {item.status !== "rejected" && (
                        <Button size="small" variant="outlined" color="warning" onClick={() => handleStatusChange(item._id, "rejected")}>
                          Reject
                        </Button>
                      )}
                      <Button size="small" color="error" onClick={() => handleDeleteFeedback(item._id)}>
                        Delete
                      </Button>
                    </Stack>
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

export default ManageFeedback;
