import { Router } from "express";
import { createOwner ,getOwnerById, getAllOwners , deleteOwner, updateOwner, getAllRestaurants } from "../controllers/owner-controllers";

const router = Router();

router.get("/restaurants", getAllRestaurants);

router.post("/", createOwner);
router.get("/:id", getOwnerById); 
router.get("/", getAllOwners);
router.delete("/:id", deleteOwner); 
router.patch("/:id", updateOwner);



export default router;