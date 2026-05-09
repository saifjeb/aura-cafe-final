import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Select,
  Stack,
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

const statusOptions = ["pending", "preparing", "ready", "completed", "cancelled"];

const statusColors = {
  pending: "warning",
  preparing: "info",
  ready: "success",
  completed: "default",
  cancelled: "error",
};

function ManageOrders() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/orders");
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

  const handleStatusChange = async (orderId, status) => {
    setSuccess("");
    setError("");

    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      setSuccess(res.data.message || "Order status updated.");
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update order.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order? This action cannot be undone.")) {
      return;
    }

    setSuccess("");
    setError("");

    try {
      const res = await api.delete(`/orders/${orderId}`);
      setSuccess(res.data.message || "Order deleted.");
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete order.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Orders
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

      <TableContainer
        component={Paper}
        sx={{ p: 2, borderRadius: 4, overflowX: "auto" }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Alert severity="info">No orders yet.</Alert>
        ) : (
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Change Status</TableCell>
                {isAdmin && <TableCell align="right">Delete</TableCell>}
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {order.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customerEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell>{order.orderType}</TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {order.items.map((item) => (
                        <Typography key={`${order._id}-${item.product}`} variant="body2">
                          {item.name} × {item.quantity}
                        </Typography>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>${Number(order.totalAmount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={order.status}
                      color={statusColors[order.status] || "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteOrder(order._id)}
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

export default ManageOrders;
