import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import App from "./App";
import "./index.css";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#0F6B73",
        dark: "#0B4F55",
        light: "#4A9DAB",
      },
      secondary: {
        main: "#F4A261",
        dark: "#D58C42",
        light: "#F7C485",
      },
      background: {
        default: "#F7F3EA",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#17202A",
        secondary: "#516571",
      },
    },
    typography: {
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      button: {
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 24,
          },
        },
      },
    },
  })
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

