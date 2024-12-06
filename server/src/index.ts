import express, { Request, Response } from "express";
import databaseConnection from "./utils/database-connection";
import ownerRoutes from "./routers/owner-router";
import customerRoutes from "./routers/customer-router";
import userRoutes from "./routers/user-router";
import orderRoutes from "./routers/order-router";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
databaseConnection()
  .then(() => {
    console.log("🚀 MongoDB connection established.");
  })
  .catch((err) => {
    console.error("🔥 MongoDB connection failed:", err);
    process.exit(1);
  });

  const corsOptions = {
    origin: "http://localhost:3000",  // Replace with your frontend URL (can be a list of allowed origins)
    methods: "GET,POST,PUT,DELETE",  // Specify the allowed HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allowed headers
  };
  
  app.use(cors(corsOptions));

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