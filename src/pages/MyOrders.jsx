import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import api from "../api/axios";

const statusColors = {
  pending: "warning",
  preparing: "info",
  ready: "success",
  completed: "default",
  cancelled: "error",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Orders
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && orders.length === 0 && (
        <Alert severity="info">You do not have any orders yet.</Alert>
      )}

      {!loading && !error && orders.length > 0 && (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Paper
              key={order._id}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
                border: "1px solid rgba(15,107,115,0.12)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography fontWeight="bold">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Type: {order.orderType}
                  </Typography>
                  <Typography variant="body2">
                    Payment: {order.paymentMethod}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                  <Chip
                    label={order.status}
                    color={statusColors[order.status] || "default"}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    ${Number(order.totalAmount || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                {order.items.map((item) => (
                  <Stack
                    key={item.product}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>
                      {item.name} × {item.quantity}
                    </Typography>
                    <Typography fontWeight="bold">
                      ${Number(item.subtotal || 0).toFixed(2)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}

export default MyOrders;
