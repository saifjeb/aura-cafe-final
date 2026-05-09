import { Box, Button, Container, Typography, Grid, Card, CardContent, Avatar, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FeedbackIcon from "@mui/icons-material/Feedback";

function Home() {
  const features = [
    {
      icon: <LocalCafeIcon sx={{ fontSize: 36, color: "primary.main" }} />,
      title: "Premium Coffee",
      description: "Enjoy carefully selected blends roasted for aroma, body and balance.",
    },
    {
      icon: <RestaurantMenuIcon sx={{ fontSize: 36, color: "primary.main" }} />,
      title: "Fresh Pastries",
      description: "Indulge in baked goods made daily from quality ingredients.",
    },
    {
      icon: <FeedbackIcon sx={{ fontSize: 36, color: "primary.main" }} />,
      title: "Easy Feedback",
      description: "Share what you love or want to see next - we're listening.",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F6B73 0%, #0B4F55 100%)",
          color: "white",
          py: { xs: 8, md: 14 },
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: 560 }}>
                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1.2, mb: 2, display: "inline-block" }}>
                  local cafe experience
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 3, lineHeight: 1.05 }}>
                  A fresh, modern landing spot for coffee lovers.
                </Typography>
                <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.88)", mb: 5 }}>
                  Explore curated drinks, bakery favorites, and easy ordering in a warm interface built for every visit.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 5 }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    sx={{ bgcolor: "#FFFFFF", color: "primary.main", fontWeight: 700, px: 4, py: 1.5 }}
                  >
                    Explore Menu
                  </Button>
                  <Button
                    component={Link}
                    to="/categories"
                    variant="outlined"
                    size="large"
                    sx={{ borderColor: "rgba(255,255,255,0.8)", color: "rgba(255,255,255,0.95)", px: 4, py: 1.5 }}
                  >
                    Browse Categories
                  </Button>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ bgcolor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "none", borderRadius: 3, p: 3 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Fast discovery
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.88)">
                        Find favorites in seconds.
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ bgcolor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "none", borderRadius: 3, p: 3 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Cozy feel
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.88)">
                        Warm visuals and refined spacing.
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 4, boxShadow: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.18)", bgcolor: "rgba(255,255,255,0.08)" }}>
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Typography variant="subtitle2" sx={{ color: "primary.light", fontWeight: 700, mb: 2 }}>
                    Today's highlights
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    New seasonal blend & fresh pastry picks
                  </Typography>

                  <Stack spacing={3}>
                    <Box sx={{ p: 3, borderRadius: 3, bgcolor: "rgba(255,255,255,0.15)" }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Hazelnut latte
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.84)">
                        Creamy and rich with a hint of toasted nuts.
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3, borderRadius: 3, bgcolor: "rgba(255,255,255,0.15)" }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Almond croissant
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.84)">
                        Flaky layers, sweet almond filling, and fresh butter.
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3, borderRadius: 3, bgcolor: "rgba(255,255,255,0.15)" }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Customer favorites
                      </Typography>
                      <Typography variant="body2" color="rgba(255,255,255,0.84)">
                        Browse the cafe's best-loved items quickly.
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 8, md: 10 } }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Why AuraCafe feels modern
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid rgba(15,107,115,0.12)",
                  boxShadow: 2,
                  p: 4,
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Avatar sx={{ bgcolor: "rgba(15,107,115,0.12)", mb: 3 }}>
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#FFFFFF", py: { xs: 8, md: 10 } }}>
        <Container>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
              alignItems: "center",
              border: "1px solid rgba(15,107,115,0.12)",
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              boxShadow: "0 24px 80px rgba(15,107,115,0.08)",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Simple browsing for every customer
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 560 }}>
                Clean sections, clear calls to action, and smart filters make ordering easy whether you are grabbing coffee or choosing a snack.
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" }, px: { xs: 3, md: 4 }, py: 1.5 }}
              >
                Start shopping
              </Button>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                What visitors enjoy
              </Typography>
              <Box sx={{ display: "grid", gap: 2 }}>
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "rgba(15,107,115,0.04)" }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Fast browsing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quick access to product and category pages.
                  </Typography>
                </Box>
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: "rgba(244,162,97,0.12)" }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Clear actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bold buttons and minimal distractions on every page.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
