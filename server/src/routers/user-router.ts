import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user-controllers";

const router = Router();

router.get("/", getAllUsers); 
router.post("/", createUser); 
router.get("/:id", getUserById); 
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser); 

export default router;