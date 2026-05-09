import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Stack,
  Alert,
} from "@mui/material";
import api from "../../api/axios";

function ManageProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
    category: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products"),
      ]);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products and categories.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      stock: "",
      category: "",
    });
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        setSuccess("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setSuccess("Product created successfully.");
      }

      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save product.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image || "",
      stock: product.stock,
      category: product.category?._id || "",
    });
    setError("");
    setSuccess("");
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await api.delete(`/products/${productId}`);
      setSuccess("Product deleted successfully.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Products
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingProduct ? "Edit Product" : "Add Product"}
        </Typography>

        <Box component="form" onSubmit={handleSaveProduct}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  {editingProduct ? "Save Changes" : "Add Product"}
                </Button>
                {editingProduct && (
                  <Button type="button" variant="outlined" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Existing Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={product.image || "https://via.placeholder.com/300x160?text=AuraCafe"}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography fontWeight="bold" sx={{ mt: 1 }}>
                  ${product.price}
                </Typography>
                <Typography variant="body2">
                  Category: {product.category?.name || "No category"}
                </Typography>
                <Typography variant="body2">
                  Stock: {product.stock}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEditProduct(product)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ManageProducts;