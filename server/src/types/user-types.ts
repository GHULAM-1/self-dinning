import { Types } from "mongoose";

export type UserT = {
  name: string;
  password?: string;
  email: string;
  profileImage?: string;
  cart?: Cart;
};

export type CartItem = {
  restaurantId: Types.ObjectId;
  category: Types.ObjectId;
  item: Types.ObjectId;
  itemName: string;
  itemImage: string;
  quantity: number;
  itemPrice: number;
  itemDiscount?: number;
};

// Type for the cart
export type Cart = {
  // restaurant: Types.ObjectId | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};
