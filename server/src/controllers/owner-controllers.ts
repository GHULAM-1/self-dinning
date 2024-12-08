import { Request, Response } from "express";
import Owner from "../schemas/owner-schema";
import { ownerT, Restaurant } from "../types/owner-types";

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
      const owners = await Owner.find(); 
  
      const allRestaurants = owners.flatMap(owner => owner.restaurants);
  
      res.status(200).json(allRestaurants);
    } catch (error) {
      res.status(500).json({ error: "Error fetching restaurants" });
    }
  }; 

  export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { restaurantId } = req.params;

      const owner = await Owner.findOne({ 
        'restaurants._id': restaurantId 
      });
  
      if (!owner) {
        res.status(404).json({ error: "Restaurant not found" });
        return;
      }
      const restaurant = owner.restaurants.find(
        rest => rest._id.toString() === restaurantId
      );
  
      if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found" });
        return;
      }
  
      res.status(200).json(restaurant);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ 
        error: "Error fetching restaurant details",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  };

  export const getAllCuisine = async (req: Request, res: Response): Promise<void> => {
    try {
      const owners = await Owner.find(); 
  
      const allRestaurants: Restaurant[] = owners.flatMap(owner => owner.restaurants);
      const cuisines = allRestaurants.flatMap(res => res.menu.categories);

  
      res.status(200).json(cuisines);
    } catch (error) {
      res.status(500).json({ error: "Error fetching restaurants" });
    }
  }; 

  export const getCuisineById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { cuisineId } = req.params;
      
      const owner = await Owner.findOne({ 
        'restaurants.menu.categories._id': cuisineId 
      });
      
      if (!owner) {
        res.status(404).json({ error: "Cuisine not found" });
        return;
      }

      let targetCuisine = null;
      
      owner.restaurants.forEach(restaurant => {
        const cuisine = restaurant.menu.categories.find(
          cat => cat._id.toString() === cuisineId
        );
        
        if (cuisine) {
          targetCuisine = {cuisine, restaurantName: restaurant.restaurantName, restaurantImage: restaurant.restaurantImage, restaurantDetails: restaurant.restaurantDetails, id: restaurant._id};
        }
      });
      
      if (!targetCuisine) {
        res.status(404).json({ error: "Cuisine not found" });
        return;
      }
  
      res.status(200).json(targetCuisine);
    } catch (error) {
      console.error("Error fetching cuisine:", error);
      res.status(500).json({ 
        error: "Error fetching cuisine details",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  };