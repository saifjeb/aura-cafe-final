import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

function Checkout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cart, getCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: currentUser?.name || "",
    customerEmail: currentUser?.email || "",
    customerPhone: currentUser?.phone || "",
    orderType: "pickup",
    address: "",
    paymentMethod: "cash",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product?.price || 0) * Number(item.quantity || 0);
  }, 0);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      setError("");

      try {
        await getCart();
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load cart.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        customerName: currentUser.name || prev.customerName,
        customerEmail: currentUser.email || prev.customerEmail,
        customerPhone: currentUser.phone || prev.customerPhone,
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacingOrder(true);

    try {
      if (items.length === 0) {
        setError("Your cart is empty.");
        return;
      }

      if (formData.orderType === "delivery" && !formData.address.trim()) {
        setError("Delivery address is required.");
        return;
      }

      await api.post("/orders", formData);
      await getCart();

      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Checkout
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

      {!loading && items.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Your cart is empty. Add products before checkout.
        </Alert>
      )}

      {!loading && items.length > 0 && (
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Paper
            component="form"
            onSubmit={handlePlaceOrder}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 4,
              flex: 1,
              border: "1px solid rgba(15,107,115,0.12)",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Customer Details
            </Typography>

            <TextField
              fullWidth
              required
              label="Full Name"
              name="customerName"
              margin="normal"
              value={formData.customerName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              label="Email"
              name="customerEmail"
              type="email"
              margin="normal"
              value={formData.customerEmail}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              label="Phone"
              name="customerPhone"
              margin="normal"
              value={formData.customerPhone}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Order Type</InputLabel>
              <Select
                label="Order Type"
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
              >
                <MenuItem value="pickup">Pickup</MenuItem>
                <MenuItem value="delivery">Delivery</MenuItem>
              </Select>
            </FormControl>

            {formData.orderType === "delivery" && (
              <TextField
                fullWidth
                required
                label="Delivery Address"
                name="address"
                margin="normal"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            )}

            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Payment Method
            </Typography>

            <RadioGroup
              row
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <FormControlLabel value="cash" control={<Radio />} label="Cash" />
              <FormControlLabel value="card" control={<Radio />} label="Card" />
            </RadioGroup>

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              margin="normal"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              helperText="Optional: special preparation or delivery notes."
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={placingOrder}
              sx={{
                mt: 2,
                bgcolor: "#0F6B73",
                "&:hover": { bgcolor: "#0B4F55" },
                borderRadius: 999,
                py: 1.2,
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </Paper>

          <Paper
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 4,
              width: { xs: "100%", md: 380 },
              border: "1px solid rgba(15,107,115,0.12)",
              alignSelf: "flex-start",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>

            <Stack spacing={2}>
              {items.map((item) => (
                <Box key={item.product?._id}>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography fontWeight="bold">
                        {item.product?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>

                    <Typography fontWeight="bold">
                      $
                      {(
                        Number(item.product?.price || 0) *
                        Number(item.quantity || 0)
                      ).toFixed(2)}
                    </Typography>
                  </Stack>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Stack>

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      )}
    </Container>
  );
}

export default Checkout;
