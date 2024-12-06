import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from "../controllers/order-controller";
import { Router } from "express";

const router = Router();

// Example: GET /order
router.get("/", getOrders);

// Example: POST /order
router.post("/", createOrder);

// Example: GET /order/:id
router.get("/:id", getOrderById);

// Example: PATCH /order/:id
router.patch("/:id", updateOrder);

// Example: DELETE /order/:id
router.delete("/:id", deleteOrder);

export default router;