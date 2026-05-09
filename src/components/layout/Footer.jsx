import { Box, Container, Typography, Grid, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";

function Footer() {
  const footerLinkSx = {
    color: "#FFFFFF",
    opacity: 0.9,
    textDecoration: "none",
    fontWeight: 600,
    "&:hover": {
      opacity: 1,
      textDecoration: "underline",
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #0F6B73 0%, #0B4F55 100%)",
        color: "#FFFFFF",
        py: { xs: 3, md: 4 },
        mt: { xs: 3, md: 4 },
        borderTop: "4px solid rgba(244,162,97,0.24)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <LocalCafeIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                AuraCafe
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your cozy corner for premium coffee, fresh pastries, and delightful experiences.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link component={RouterLink} to="/" sx={footerLinkSx}>Home</Link>
              <Link component={RouterLink} to="/products" sx={footerLinkSx}>Products</Link>
              <Link component={RouterLink} to="/categories" sx={footerLinkSx}>Categories</Link>
              <Link component={RouterLink} to="/feedback" sx={footerLinkSx}>Feedback</Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Have questions or feedback? We'd love to hear from you!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Email: saifjebreen5@gmail.com
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.18)",
            mt: 3,
            pt: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2026 AuraCafe. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
