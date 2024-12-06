import { Request, Response } from "express";
import Customer from "../schemas/customer-schema";
import { CustomerT } from "@/types/customer-types";

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers: CustomerT[] = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers" });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phoneNumber, order } = req.body;

    if (!name || !email || !phoneNumber) {
      res.status(400).json({ error: "Name, email, and phone number are required" });
      return;
    }

    const newCustomer = new Customer({ name, email, phoneNumber, order });
    const savedCustomer = await newCustomer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error creating customer" });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const customer: CustomerT | null = await Customer.findById(id);

    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customer" });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates: Partial<CustomerT> = req.body;

  try {
    // Prevent updating certain fields
    delete updates.orders;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error updating customer" });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedCustomer: CustomerT | null = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json({
      message: "Customer deleted successfully",
      deletedCustomer
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer" });
  }
};

