import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../hooks/useAuth";

export const SIDEBAR_OPEN_WIDTH = 260;
export const SIDEBAR_CLOSED_WIDTH = 82;

const userLinks = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  { text: "Products", path: "/products", icon: <StorefrontIcon /> },
  { text: "Categories", path: "/categories", icon: <CategoryIcon /> },
  { text: "Feedback", path: "/feedback", icon: <FeedbackIcon /> },
  { text: "Careers", path: "/careers", icon: <WorkIcon /> },
  { text: "Cart", path: "/cart", icon: <ShoppingCartIcon /> },
  { text: "My Orders", path: "/orders", icon: <ReceiptLongIcon /> },
  { text: "Profile", path: "/profile", icon: <PersonIcon /> },
];

const employeeLinks = [
  { text: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { text: "Manage Products", path: "/admin/products", icon: <InventoryIcon /> },
  { text: "Manage Categories", path: "/admin/categories", icon: <CategoryIcon /> },
  { text: "Manage Feedback", path: "/admin/feedback", icon: <FeedbackIcon /> },
  { text: "Manage Orders", path: "/admin/orders", icon: <ReceiptLongIcon /> },
  { text: "Job Applications", path: "/admin/job-applications", icon: <AssignmentIcon /> },
];

const adminOnlyLinks = [
  { text: "Manage Users", path: "/admin/users", icon: <PeopleIcon /> },
];

function SidebarContent({ open, onToggle, onNavigate, mobile = false }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  const isAdmin = currentUser?.role === "admin";
  const isEmployee = currentUser?.role === "employee";

  const links =
    isAdmin
      ? [...userLinks, ...employeeLinks, ...adminOnlyLinks]
      : isEmployee
      ? [...userLinks, ...employeeLinks]
      : userLinks;

  return (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #0F6B73 0%, #0B4F55 100%)",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: open ? 2 : 1,
          py: 2,
          minHeight: mobile ? 72 : 84,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          gap: 1,
        }}
      >
        {open ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <LocalCafeIcon />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" lineHeight={1.1} noWrap>
                AuraCafe
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }} noWrap>
                {isAdmin ? "Admin Menu" : isEmployee ? "Employee Menu" : "User Menu"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <LocalCafeIcon />
        )}

        <IconButton
          onClick={onToggle}
          size="small"
          aria-label={mobile ? "close menu" : "toggle menu"}
          sx={{
            color: "#FFFFFF",
            bgcolor: "rgba(255,255,255,0.12)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
          }}
        >
          {mobile ? <CloseIcon /> : open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.16)" }} />

      <List
        sx={{
          px: 1.2,
          py: 2,
          overflowY: "auto",
          flexGrow: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(255,255,255,0.35)",
            borderRadius: 8,
          },
        }}
      >
        {links.map((item) => {
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

          const node = (
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={onNavigate}
              sx={{
                borderRadius: 999,
                mb: 1,
                minHeight: 50,
                px: open ? 2 : 1,
                justifyContent: open ? "initial" : "center",
                color: "#FFFFFF",
                bgcolor: active ? "rgba(255,255,255,0.18)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#FFFFFF",
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 800 : 650,
                  }}
                />
              )}
            </ListItemButton>
          );

          return open ? (
            <Box key={item.path}>{node}</Box>
          ) : (
            <Tooltip key={item.path} title={item.text} placement="right">
              {node}
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}

function Sidebar({ desktopOpen, onToggleDesktop, mobileOpen, onCloseMobile }) {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const desktopWidth = desktopOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH;

  return (
    <>
      <Box
        component="aside"
        sx={{
          width: desktopWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          transition: "width 0.25s ease",
          position: "sticky",
          top: 72,
          height: "calc(100vh - 72px)",
          overflow: "hidden",
          bgcolor: "#0B4F55",
          borderRight: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <SidebarContent open={desktopOpen} onToggle={onToggleDesktop} />
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: { xs: "82vw", sm: 320 },
            maxWidth: 340,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <SidebarContent
          open={true}
          mobile={true}
          onToggle={onCloseMobile}
          onNavigate={onCloseMobile}
        />
      </Drawer>
    </>
  );
}

export default Sidebar;
