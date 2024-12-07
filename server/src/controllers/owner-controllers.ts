import { Request, Response } from "express";
import Owner from "../schemas/owner-schema";
import { ownerT } from "../types/owner-types";

export const createOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      ownerName,
      ownerCnic,
      acounts,
      subscription,
      restaurants,
    }: ownerT = req.body;

    if (!ownerName || !ownerCnic) {
      res.status(400).json({ error: "Required fields are missing" });
      return;
    }

    const newOwner = new Owner({
      ownerName,
      ownerCnic,
      acounts,
      subscription,
      restaurants,
    });

    const savedOwner = await newOwner.save();
    res.status(201).json(savedOwner);
  } catch (error) {
    res.status(500).json({ error: "Error creating owner" });
  }
};


export const getAllOwners = async (req: Request, res: Response): Promise<void> => {
    try {
      const owners = await Owner.find()
      res.status(200).json(owners);
    } catch (error) {
      res.status(500).json({ error: "Error fetching owners" });
    }
  };


  export const getOwnerById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const owner = await Owner.findById(id)
  
      if (!owner) {
        res.status(404).json({ error: "Owner not found" });
        return;
      }
  
      res.status(200).json(owner);
    } catch (error) {
      res.status(500).json({ error: "Error fetching owner" });
    }
  };


  export const deleteOwner = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const deletedOwner = await Owner.findByIdAndDelete(id);
  
      if (!deletedOwner) {
        res.status(404).json({ error: "Owner not found" });
        return;
      }
  
      res.status(200).json({ message: "Owner deleted successfully", deletedOwner });
    } catch (error) {
      res.status(500).json({ error: "Error deleting owner" });
    }
  };


  export const updateOwner = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedOwner) {
        res.status(404).json({ error: "Owner not found" });
        return;
      } 
  
      res.status(200).json(updatedOwner);
    } catch (error) {
      res.status(500).json({ error: "Error updating owner" });
    }
  };


  export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all owners and extract the restaurants array
      const owners = await Owner.find();  // Populate the restaurants field
      console.log("im here", owners);
  
      // Extract all restaurants from owners
      const allRestaurants = owners.flatMap(owner => owner.restaurants);
      console.log("all resturants: ", allRestaurants)
  
      res.status(200).json(allRestaurants);
    } catch (error) {
      res.status(500).json({ error: "Error fetching restaurants" });
    }
  };