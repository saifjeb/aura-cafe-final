import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../hooks/useAuth";

const colors = {
  teal: "#0F6B73",
  tealDark: "#0B4F55",
  text: "#17202A",
  orange: "#F4A261",
  orangeDark: "#E88945",
  white: "#FFFFFF",
};

function Header({ onToggleSidebar, onOpenMobileSidebar }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenuClick = () => {
    if (isMobile) {
      onOpenMobileSidebar?.();
    } else {
      onToggleSidebar?.();
    }
  };

  const navButtonSx = {
    color: colors.text,
    fontWeight: 700,
    textTransform: "none",
    px: 1.5,
    whiteSpace: "nowrap",
    "&:hover": {
      color: colors.teal,
      bgcolor: "rgba(15,107,115,0.08)",
    },
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "rgba(255,255,255,0.96)",
        color: colors.text,
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(15,107,115,0.12)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: "64px !important", md: "72px !important" },
          display: "flex",
          justifyContent: "space-between",
          gap: 1.5,
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          {currentUser && (
            <IconButton
              onClick={handleMenuClick}
              aria-label="open navigation"
              sx={{
                color: colors.teal,
                bgcolor: "rgba(15,107,115,0.08)",
                "&:hover": { bgcolor: "rgba(15,107,115,0.14)" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: colors.tealDark,
              minWidth: 0,
            }}
          >
            <LocalCafeIcon />
            <Typography
              variant="h6"
              fontWeight="bold"
              noWrap
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              AuraCafe
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {!currentUser && (
              <>
                <Button sx={navButtonSx} component={Link} to="/">
                  Home
                </Button>
                <Button sx={navButtonSx} component={Link} to="/products">
                  Products
                </Button>
                <Button sx={navButtonSx} component={Link} to="/categories">
                  Categories
                </Button>
                <Button sx={navButtonSx} component={Link} to="/feedback">
                  Feedback
                </Button>
              </>
            )}

            {currentUser && (
              <>
                <Button sx={navButtonSx} component={Link} to="/profile">
                  Profile
                </Button>
              </>
            )}
          </Stack>

          {!currentUser ? (
            <>
              <Button
                sx={{ ...navButtonSx, display: { xs: "none", sm: "inline-flex" } }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{
                  color: colors.white,
                  bgcolor: colors.teal,
                  borderRadius: 999,
                  px: { xs: 2, sm: 3 },
                  fontWeight: 800,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: colors.tealDark },
                }}
              >
                Register
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              sx={{
                color: colors.text,
                bgcolor: colors.orange,
                borderRadius: 999,
                px: { xs: 2, sm: 3 },
                fontWeight: 800,
                textTransform: "none",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: colors.orangeDark },
              }}
            >
              Logout
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
