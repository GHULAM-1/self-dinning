import { Router } from "express";

const router = Router();

// Example: GET /owner
router.get("/", (req, res) => {
  res.send("Get all owners");
});

// Example: POST /owner
router.post("/", (req, res) => {
  res.send("Create a new owner");
});

// Example: GET /owner/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.send(`Get details of owner with ID: ${id}`);
});

export default router;