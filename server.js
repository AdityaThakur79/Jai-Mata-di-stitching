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
      "https://jai-mata-di-stitching.onrender.com",
      "https://jmdstitching.com",
      "https://jai-mata-di-stitching-1mic.onrender.com"
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
import fabricRoutes from "./routes/fabric.js"
import masterRoutes from "./routes/master.js"
import salesmanRoutes from "./routes/salesman.js"
import styleRoutes from "./routes/style.js";
import pendingOrderRoutes from "./routes/pendingOrder.js"
import invoiceRoutes from "./routes/invoice.js"
import employeeRoutes from "./routes/employee.js"
import branchRoutes from "./routes/branch.js"

app.use("/api/customer", customerRoutes)
app.use("/api/item", itemRoutes)
app.use("/api/fabric", fabricRoutes)
app.use("/api/master", masterRoutes)
app.use("/api/salesman",salesmanRoutes);
app.use("/api/style", styleRoutes);
app.use("/api/pending-order",pendingOrderRoutes)
app.use("/api/invoice", invoiceRoutes)
app.use("/api/employee", employeeRoutes)
app.use("/api/branch", branchRoutes)

// Serve static files from uploads directory

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
