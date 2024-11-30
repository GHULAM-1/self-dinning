import { Router } from "express";

const router = Router();

// Example: GET /order
router.get("/", (req, res) => {
  res.send("Get all orders");
});

// Example: POST /order
router.post("/", (req, res) => {
  res.send("Create a new order");
});

// Example: GET /order/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Get details of order with ID: ${id}`);
});

export default router;