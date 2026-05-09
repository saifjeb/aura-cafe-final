import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import Profile from "../pages/Profile";
import Feedback from "../pages/Feedback";
import Careers from "../pages/Careers";
import NotFound from "../pages/NotFound";

import Dashboard from "../pages/admin/Dashboard";
import ManageProducts from "../pages/admin/ManageProducts";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageFeedback from "../pages/admin/ManageFeedback";
import ManageJobApplications from "../pages/admin/ManageJobApplications";
import ManageOrders from "../pages/admin/ManageOrders";

function AppRoutes() {
  const staffRoles = ["admin", "employee"];

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="careers" element={<Careers />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute roles={staffRoles}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/products"
          element={
            <ProtectedRoute roles={staffRoles}>
              <ManageProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/categories"
          element={
            <ProtectedRoute roles={staffRoles}>
              <ManageCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/feedback"
          element={
            <ProtectedRoute roles={staffRoles}>
              <ManageFeedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/orders"
          element={
            <ProtectedRoute roles={staffRoles}>
              <ManageOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/job-applications"
          element={
            <ProtectedRoute roles={staffRoles}>
              <ManageJobApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/users"
          element={
            <ProtectedRoute adminOnly>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
