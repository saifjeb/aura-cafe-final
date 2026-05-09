import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import authRoutes from "./router/auth.Routes.js";
import userRoutes from "./router/user.Routes.js";
import categoryRoutes from "./router/category.Routes.js";
import productRoutes from "./router/product.Routes.js";
import feedbackRoutes from "./router/feedback.Routes.js";
import cartRoutes from "./router/cart.Routes.js";
import jobApplicationRoutes from "./router/jobApplication.Routes.js";
import orderRoutes from "./router/order.Routes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("AuraCafe API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
