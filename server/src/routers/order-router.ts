import { createOrder, getOrders } from "../controllers/order-controller";
import { Router } from "express";

const router = Router();

// Example: GET /order
router.get("/", getOrders);

// Example: POST /order
router.post("/", createOrder);

// Example: GET /order/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Get details of order with ID: ${id}`);
});

export default router;