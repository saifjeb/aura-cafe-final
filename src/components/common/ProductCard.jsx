import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Chip,
  Box,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const price = Number(product.price || 0);
  const stock = Number(product.stock || 0);
  const canOrder = currentUser && product.isAvailable && stock > 0;

  const handleAddToCart = async () => {
    setMessage("");
    setError("");

    try {
      await addToCart(product._id, 1);
      setMessage("Added to cart");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding to cart");
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(15,107,115,0.12)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative", minHeight: { xs: 180, sm: 220 } }}>
        <CardMedia
          component="img"
          height={220}
          image={
            product.image ||
            "https://images.unsplash.com/photo-1559054663-8b39efb8db9c?w=800"
          }
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0, 0, 0, 0.08)",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {product.name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          <Chip
            label={product.category?.name || "Uncategorized"}
            size="small"
            variant="outlined"
            sx={{ borderColor: "rgba(15,107,115,0.3)", color: "text.secondary" }}
          />

          {stock <= 5 && stock > 0 && (
            <Chip label={`Only ${stock} left`} size="small" color="warning" />
          )}

          {stock === 0 && <Chip label="Out of Stock" size="small" color="error" />}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description}
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ gap: 2 }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Price
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${price.toFixed(2)}
            </Typography>
          </Box>

          {canOrder ? (
            <Button
              size="small"
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                bgcolor: "#0F6B73",
                "&:hover": { bgcolor: "#0B4F55" },
                borderRadius: 3,
                px: 3,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Add to cart
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              disabled
              sx={{ borderRadius: 3, px: 3, width: { xs: "100%", sm: "auto" } }}
            >
              {stock === 0 ? "Sold out" : "Login to order"}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
