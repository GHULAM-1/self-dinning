import { Request, Response } from "express";
import userSchema from "../schemas/user-schema";
import { UserT } from "../types/user-types";


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: UserT[] = await userSchema.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};


export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, profileImage } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required" });
      return;
    }

    const newUser = new userSchema({ name, email, password, profileImage });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user: UserT | null = await userSchema.findById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates: Partial<UserT> = req.body;

  try {
    const updatedUser = await userSchema.findByIdAndUpdate(id, updates, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedUser: UserT | null = await userSchema.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};