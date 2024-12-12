import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addItemToCart,
} from "../controllers/user-controllers";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

// these are the cart apis from here on

router.post("/cart/:userId", addItemToCart);

export default router;
