import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addItemToCart,
  getCartItems,
  removeItemFromCart
} from "../controllers/user-controllers";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

// these are the cart apis from here on
router.delete("/cart/:userId/:resturantId/:item/:categoryId", removeItemFromCart);
router.post("/cart/:userId", addItemToCart);
router.get("/cart/:userId", getCartItems);

export default router;
