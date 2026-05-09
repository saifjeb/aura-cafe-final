import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useCart } from "../hooks/useCart";

function Cart() {
  const { cart, getCart, updateCartItem, removeCartItem, clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    setLoading(true);
    setError("");

    try {
      await getCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load cart. Make sure the backend is running and you are logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    setError("");

    try {
      await updateCartItem(productId, quantity);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update cart item.");
    }
  };

  const handleRemoveItem = async (productId) => {
    setError("");

    try {
      await removeCartItem(productId);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove item.");
    }
  };

  const handleClearCart = async () => {
    setError("");

    try {
      await clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to clear cart.");
    }
  };

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product?.price || 0) * Number(item.quantity || 0);
  }, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Cart
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

      {!loading && !error && items.length === 0 && (
        <Alert severity="info">Your cart is empty.</Alert>
      )}

      {!loading && items.length > 0 && (
        <>
          <Stack spacing={2}>
            {items.map((item) => {
              const product = item.product;
              const stock = Number(product?.stock || 0);
              const quantity = Number(item.quantity || 0);
              const atMaxStock = quantity >= stock;

              return (
                <Paper
                  key={product?._id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid rgba(15,107,115,0.12)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                      <CardMedia
                        component="img"
                        image={
                          product?.image ||
                          "https://images.unsplash.com/photo-1559054663-8b39efb8db9c?w=400"
                        }
                        alt={product?.name || "Product"}
                        sx={{
                          width: { xs: "100%", sm: 120 },
                          height: 100,
                          borderRadius: 2,
                          objectFit: "cover",
                        }}
                      />

                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {product?.name || "Product removed"}
                        </Typography>

                        <Typography color="text.secondary">
                          Price: ${Number(product?.price || 0).toFixed(2)}
                        </Typography>

                        <Typography color="text.secondary">
                          Quantity: {quantity}
                        </Typography>

                        <Typography fontWeight="bold">
                          Subtotal: $
                          {(Number(product?.price || 0) * quantity).toFixed(2)}
                        </Typography>

                        {stock > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            Stock available: {stock}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    {product?._id && (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent={{ xs: "center", sm: "flex-end" }}
                      >
                        <Button
                          variant="outlined"
                          disabled={atMaxStock}
                          onClick={() =>
                            handleUpdateQuantity(product._id, quantity + 1)
                          }
                        >
                          +
                        </Button>

                        <Button
                          variant="outlined"
                          disabled={quantity <= 1}
                          onClick={() =>
                            handleUpdateQuantity(product._id, quantity - 1)
                          }
                        >
                          -
                        </Button>

                        <Button
                          color="error"
                          variant="outlined"
                          onClick={() => handleRemoveItem(product._id)}
                        >
                          Remove
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>

          <Paper
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              border: "1px solid rgba(15,107,115,0.12)",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Total: ${total.toFixed(2)}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                sx={{
                  bgcolor: "#0F6B73",
                  "&:hover": { bgcolor: "#0B4F55" },
                  borderRadius: 999,
                  px: 4,
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                component={Link}
                to="/products"
                variant="outlined"
                sx={{
                  borderColor: "#0F6B73",
                  color: "#0F6B73",
                  borderRadius: 999,
                  px: 4,
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Continue Shopping
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 999,
                  px: 4,
                  fontWeight: 800,
                  textTransform: "none",
                }}
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </Stack>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default Cart;
