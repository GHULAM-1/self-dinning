import { Request, Response } from "express";
import userSchema from "../schemas/user-schema";
import { CartItem, UserT } from "../types/user-types";
import ownerSchema from "../schemas/owner-schema";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: UserT[] = await userSchema.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

// Here on are the cart apis

export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params; // Assuming userId is provided in the URL
  const { category, item, quantity, itemDiscount, restaurantId } = req.body;
  // console.log(userId, category, item, quantity, itemDiscount, restaurantId)

  try {
    // Validate input fields
    if (!category || !item || !quantity || !restaurantId) {
      res
        .status(400)
        .json({
          error: "Category, item, quantity, and restaurantId are required",
        });
      return;
    }

    // Find user by ID
    const user = await userSchema.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    // console.log("user: ", user);
    if (user.cart && user.cart.items.length > 0) {
      // If the cart contains items from a different restaurant, clear the cart
      const currentRestaurantId = user.cart.items[0].restaurantId;
      if (currentRestaurantId.toString() !== restaurantId) {
        console.log("formate::", currentRestaurantId.toString(), restaurantId)
        user.cart.items = []; // Remove all items if from a different restaurant
        user.cart.totalItems = 0;
        user.cart.totalPrice = 0;
      }
    }

    // Find restaurant by ID in the Owner collection (it's embedded)
    const owner = await ownerSchema.findOne({
      "restaurants._id": restaurantId,
    });
    if (!owner) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    // console.log("owner:::, ", owner);

    // Find the specific restaurant from the restaurants array
    const restaurant = owner.restaurants.find(
      (r) => r._id.toString() === restaurantId
    );
    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    // console.log("restaurant ::, ", restaurant);

    // Find the category details from the restaurant's menu
    const categoryDetails = restaurant.menu.categories.find(
      (c) => c._id.toString() === category
    );
    if (!categoryDetails) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    // console.log("category::: ", categoryDetails);
    // Find the item details from the category
    const itemDetails = categoryDetails.items.find(
      (i) => i._id.toString() === item
    );
    if (!itemDetails) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    // console.log("item details:::, ", itemDetails);

    // Create a new CartItem object
    const newCartItem = {
      restaurantId: restaurantId,
      category,
      item,
      itemName: itemDetails.itemName,
      itemImage: itemDetails.itemImage,
      quantity,
      itemPrice: itemDetails.itemPrice,
      itemDiscount: itemDiscount || 0, // default to 0 if not provided
    };

    // Set the restaurant details to the user's cart
    if (!user.cart) {
      console.log("im here:");
      user.cart = { items: [], totalItems: 0, totalPrice: 0 };
    }

    // Add the new item to the user's cart
    user.cart.items.push(newCartItem);

    // console.log("im here 2:", newCartItem);
    // Recalculate total items and total price in the cart
    user.cart.totalItems = user.cart.items.length;
    user.cart.totalPrice = user.cart.items.reduce(
      (total, item) =>
        total + item.itemPrice * item.quantity - (item.itemDiscount || 0),
      0
    );
    // console.log("im here 3:::");

    // Save the updated user data
    try {
      const updatedUser = await user.save();
      console.log("User saved successfully: ", updatedUser);
    } catch (error) {
      console.error("Error saving user:", error); // Log the detailed error message
      res.status(500).json({ error: "Error saving user to the database" });
    }

    const updatedUser = await user.save();
    // console.log("im here 4:::");

    // Return the updated user cart
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ error: "Error adding item to cart" });
  }
};
