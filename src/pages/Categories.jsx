import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const categoryImages = {
    Coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    Tea:  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    Pastries: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    Sandwiches: "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400",
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 4 }}>
        Product Categories
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && categories.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No categories available yet.
          </Typography>
        </Box>
      )}

      {!loading && !error && categories.length > 0 && (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} lg={4} key={category._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    categoryImages[category.name] ||
                    "https://images.unsplash.com/photo-1559054663-8b39efb8db9c?w=400"
                  }
                  alt={category.name}
                />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {category.description || "Explore our delicious selection of products in this category."}
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/products?category=${category._id}`}
                    sx={{
                      bgcolor: "#0F6B73",
                      "&:hover": { bgcolor: "#0B4F55" },
                      alignSelf: "flex-start",
                    }}
                  >
                    View Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Categories;
