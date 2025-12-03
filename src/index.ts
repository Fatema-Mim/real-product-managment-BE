import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import { errorHandler, notFound } from "./middleware/error";

dotenv.config();

import "./config/firebase";

if (!process.env.PORT) throw new Error("PORT is missing in .env");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.0.100:3000",
  "https://real-prduct-managment-fe.vercel.app",
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.send("Backend working perfectly!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server also accessible on network at http://192.168.0.100:${PORT}`);
});
