import { Router } from "express";
import { createOwner ,getOwnerById, getAllOwners } from "../controllers/owner-controllers";

const router = Router();

router.post("/", createOwner);
router.get("/:id", getOwnerById); // Route to get a single owner by ID
router.get("/", getAllOwners); // Route to get all owners

export default router;