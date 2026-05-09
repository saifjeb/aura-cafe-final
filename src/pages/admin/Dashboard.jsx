import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    feedback: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    setError("");

    try {
      const [productsRes, categoriesRes, usersRes, feedbackRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/users"),
          api.get("/feedback"),
        ]);

      setStats({
        products: productsRes.data.length,
        categories: categoriesRes.data.length,
        users: usersRes.data.length,
        feedback: feedbackRes.data.length,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const actionButtons = [
    { label: "Manage Products", path: "/admin/products" },
    { label: "Manage Categories", path: "/admin/categories" },
    { label: "Manage Users", path: "/admin/users" },
    { label: "Manage Feedback", path: "/admin/feedback" },
  ];

  const tiles = [
    { label: "Products", value: stats.products, description: "Total products on the menu." },
    { label: "Categories", value: stats.categories, description: "Total product categories." },
    { label: "Users", value: stats.users, description: "Registered users." },
    { label: "Feedback", value: stats.feedback, description: "Submitted feedback entries." },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5, mb: 3 }}>
        {actionButtons.map((button) => (
          <Button
            key={button.path}
            component={Link}
            to={button.path}
            variant="contained"
            sx={{
              bgcolor: "#0F6B73",
              "&:hover": { bgcolor: "#0B4F55" },
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            {button.label}
          </Button>
        ))}
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tiles.map((tile) => (
            <Grid key={tile.label} item xs={12} sm={6} md={3}>
              <Card sx={{ minHeight: 150, borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {tile.label}
                  </Typography>
                  <Typography variant="h3" component="div">
                    {tile.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {tile.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Dashboard;
