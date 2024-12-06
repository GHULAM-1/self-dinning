import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/customer-controllers";
import { Router } from "express";

const router = Router();

// Example: GET /customer
router.get("/", getAllCustomers);

// Example: POST /customer
router.post("/", createCustomer);

// Example: GET /customer/:id
router.get("/:id", getCustomerById);

router.patch("/:id", updateCustomer);

router.delete("/:id", deleteCustomer);

export default router;