import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api/axios";
import ProductCard from "../components/common/ProductCard";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category?._id === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) => {
        const name = product.name || "";
        const description = product.description || "";

        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);

    if (value) {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
    setSearchParams({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 4 }}>
        AuraCafe Products
      </Typography>

      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: { xs: "100%", sm: 250 } }}
        />

        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} label="Category" onChange={handleCategoryChange}>
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(selectedCategory || searchTerm) && (
          <Chip label="Clear Filters" onClick={clearFilters} color="secondary" variant="outlined" />
        )}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {products.length === 0 ? "No products available yet." : "No products match your filters."}
          </Typography>
        </Box>
      ) : null}

      {!loading && !error && filteredProducts.length > 0 && (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} lg={4} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Products;
