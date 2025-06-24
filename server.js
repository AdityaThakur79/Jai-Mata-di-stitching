import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/dbConfig.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5174",
      "http://localhost:5173",
      "https://jai-mata-di-stitching.onrender.com"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//User Auth routes
import userRoutes from "./routes/user.js";

app.use("/api/user", userRoutes);

//Master routes
import customerRoutes from "./routes/customer.js"
import itemRoutes from "./routes/item.js"

app.use("/api/customer", customerRoutes)
app.use("/api/item", itemRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
