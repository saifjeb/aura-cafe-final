import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from "@mui/material";
import api from "../../api/axios";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingCategory(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
        setSuccess("Category updated successfully.");
      } else {
        await api.post("/categories", formData);
        setSuccess("Category created successfully.");
      }

      resetForm();
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save category.");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || "" });
    setError("");
    setSuccess("");
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Delete this category? This action cannot be undone.")) return;

    setError("");
    setSuccess("");

    try {
      await api.delete(`/categories/${categoryId}`);
      setSuccess("Category deleted successfully.");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete category.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Categories
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingCategory ? "Edit Category" : "Add Category"}
        </Typography>

        <Box component="form" onSubmit={handleSaveCategory}>
          <Stack spacing={2}>
            <TextField
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button type="submit" variant="contained" sx={{ bgcolor: "#0F6B73", "&:hover": { bgcolor: "#0B4F55" } }}>
                {editingCategory ? "Save Changes" : "Add Category"}
              </Button>
              {editingCategory && (
                <Button type="button" variant="outlined" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ p: 2, borderRadius: 4, overflowX: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Existing Categories
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => handleEditCategory(category)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDeleteCategory(category._id)}>
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

export default ManageCategories;
