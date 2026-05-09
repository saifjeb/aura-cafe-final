import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";

function Layout() {
  const { currentUser } = useAuth();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleDesktopSidebar = () => {
    setDesktopSidebarOpen((prev) => !prev);
  };

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F3EA" }}>
      <Header
        onToggleSidebar={toggleDesktopSidebar}
        onOpenMobileSidebar={openMobileSidebar}
      />

      <Box sx={{ display: "flex", alignItems: "stretch" }}>
        {currentUser && (
          <Sidebar
            desktopOpen={desktopSidebarOpen}
            onToggleDesktop={toggleDesktopSidebar}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={closeMobileSidebar}
          />
        )}

        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: {
              xs: "calc(100vh - 64px)",
              md: "calc(100vh - 72px)",
            },
          }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: "100%",
              p: { xs: 1.5, sm: 2, md: 4 },
              overflowX: "hidden",
            }}
          >
            <Outlet />
          </Box>

          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
