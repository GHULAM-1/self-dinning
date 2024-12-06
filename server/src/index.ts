import express, { Request, Response } from "express";
import cors from "cors"; // Import the cors package
import databaseConnection from "./utils/database-connection";
import ownerRoutes from "./routers/owner-router";
import customerRoutes from "./routers/customer-router";
import userRoutes from "./routers/user-router";
import orderRoutes from "./routers/order-router";

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());  // This will allow all origins by default

// Connect to MongoDB
databaseConnection()
  .then(() => {
    console.log("🚀 MongoDB connection established.");
  })
  .catch((err) => {
    console.error("🔥 MongoDB connection failed:", err);
    process.exit(1);
  });

// Middleware
app.use(express.json());

// Parent Routes
app.use("/owner", ownerRoutes);
app.use("/customer", customerRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌟 Server is running at http://localhost:${PORT}`);
});