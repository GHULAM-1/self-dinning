import { Router } from "express";

const router = Router();

// Example: GET /customer
router.get("/", (req, res) => {
  res.send("Get all customers");
});

// Example: POST /customer
router.post("/", (req, res) => {
  res.send("Create a new customer");
});

// Example: GET /customer/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Get details of customer with ID: ${id}`);
});

export default router;