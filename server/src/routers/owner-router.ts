import { Router } from "express";
import { createOwner ,getOwnerById, getAllOwners , deleteOwner, updateOwner } from "../controllers/owner-controllers";

const router = Router();

router.post("/", createOwner);
router.get("/:id", getOwnerById); 
router.get("/", getAllOwners);
router.delete("/:id", deleteOwner); 
router.patch("/:id", updateOwner);



export default router;