import { Router } from "express";
import { createOwner ,getOwnerById, getAllOwners , deleteOwner, updateOwner, getAllRestaurants, getAllCuisine, getRestaurantById, getCuisineById } from "../controllers/owner-controllers";

const router = Router();

router.get("/restaurants", getAllRestaurants);
router.get("/cuisines", getAllCuisine);

router.post("/", createOwner);
router.get("/:id", getOwnerById); 
router.get("/", getAllOwners);
router.delete("/:id", deleteOwner); 
router.patch("/:id", updateOwner);
router.get("/cuisines/:cuisineId", getCuisineById);

router.get("/restaurants/:restaurantId", getRestaurantById);



export default router;