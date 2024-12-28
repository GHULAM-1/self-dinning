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
  const { userId } = req.params;
  const { category, item, quantity, itemDiscount, restaurantId } = req.body;

  try {
    // Validate input fields
    if (!category || !item || !quantity || !restaurantId) {
      res.status(400).json({
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

    if (user.cart && user.cart.items.length > 0) {
      // If the cart contains items from a different restaurant, clear the cart
      const currentRestaurantId = user.cart.items[0].restaurantId;
      if (currentRestaurantId.toString() !== restaurantId.toString()) {
        user.cart.items = [];
        user.cart.totalItems = 0;
        user.cart.totalPrice = 0;
      }
    }

    // Find restaurant by ID in the Owner collection
    const owner = await ownerSchema.findOne({
      "restaurants._id": restaurantId,
    });
    if (!owner) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    // Find the specific restaurant
    const restaurant = owner.restaurants.find(
      (r) => r._id.toString() === restaurantId.toString()
    );
    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    // Find the category details
    const categoryDetails = restaurant.menu.categories.find(
      (c) => c._id.toString() === category.toString()
    );
    if (!categoryDetails) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    // Find the item details
    const itemDetails = categoryDetails.items.find(
      (i) => i._id.toString() === item.toString()
    );
    if (!itemDetails) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = { items: [], totalItems: 0, totalPrice: 0 };
    }

    // Check if the item already exists in the cart
    const existingItemIndex = user.cart.items.findIndex(
      (cartItem) =>
        cartItem.restaurantId.toString() === restaurantId.toString() &&
        cartItem.category.toString() === category.toString() &&
        cartItem.item.toString() === item.toString()
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      user.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const newCartItem = {
        restaurantId,
        category,
        item,
        itemName: itemDetails.itemName,
        itemImage: itemDetails.itemImage,
        quantity,
        itemPrice: itemDetails.itemPrice,
        itemDiscount: itemDiscount || 0,
      };
      user.cart.items.push(newCartItem);
    }

    // Recalculate cart totals
    user.cart.totalItems = user.cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    user.cart.totalPrice = user.cart.items.reduce(
      (total, item) =>
        total + item.itemPrice * item.quantity - (item.itemDiscount || 0),
      0
    );

    // Save the updated user data
    try {
      const updatedUser = await user.save();
      res.status(200).json(updatedUser.cart);
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ error: "Error saving user to the database" });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Error adding item to cart" });
  }
};

export const removeItemFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, resturantId, item, categoryId } = req.params;

  try {
    // Validate input fields
    if (!categoryId || !item || !resturantId || !userId) {
      res.status(400).json({
        error: "UserId, restaurantId, item, and categoryId are required",
      });
      return;
    }

    // Find user by ID
    const user = await userSchema.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if cart exists and has items
    if (!user.cart || user.cart.items.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    // Find the item in the cart
    const existingItemIndex = user.cart.items.findIndex(
      (cartItem) =>
        cartItem.restaurantId.toString() === resturantId.toString() &&
        cartItem.category.toString() === categoryId.toString() &&
        cartItem.item.toString() === item.toString()
    );

    if (existingItemIndex === -1) {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }

    // Get current item
    const currentItem = user.cart.items[existingItemIndex];

    if (currentItem.quantity > 1) {
      // If quantity > 1, decrease quantity by 1
      user.cart.items[existingItemIndex].quantity -= 1;
    } else {
      // If quantity is 1, remove the item completely
      user.cart.items.splice(existingItemIndex, 1);
    }

    // Recalculate cart totals
    user.cart.totalItems = user.cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    user.cart.totalPrice = user.cart.items.reduce(
      (total, item) =>
        total + item.itemPrice * item.quantity - (item.itemDiscount || 0),
      0
    );

    // If cart is empty after removal, reset totals
    if (user.cart.items.length === 0) {
      user.cart.totalItems = 0;
      user.cart.totalPrice = 0;
    }

    // Save the updated user data
    try {
      const updatedUser = await user.save();
      res.status(200).json(updatedUser.cart);
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ error: "Error saving user to the database" });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Error removing item from cart" });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
};
