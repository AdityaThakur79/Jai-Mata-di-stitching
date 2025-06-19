import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
// import sessionMiddleware from "./config/sessionConfig.js";
import connectDB from "./config/dbConfig.js";

// configing the dotenv file
dotenv.config();

//Database Config
connectDB();

const app = express();

// creating the middleware
// const allowedOrigins = [
//   "https://dellcube-production.onrender.com",
//   "http://localhost:8080",
//   "http://localhost:5174",
// ];

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
// app.use(sessionMiddleware);

//User Auth routes
import userRoutes from "./routes/user.js";

app.use("/api/user", userRoutes);

//Master routes
import customerRoutes from "./routes/customer.js"

app.use("/api/customer", customerRoutes)

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name
const __dirname = path.dirname(__filename);

// Serve static files from the assets folder
app.use(express.static(path.join(__dirname, "./client/dist")));

// Route to serve `index.html`
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
