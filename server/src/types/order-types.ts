import mongoose, { Schema, Document, Types } from "mongoose";


export type OrderT = {
    user: Types.ObjectId;
    owner: Types.ObjectId;
    items: {
      item: Types.ObjectId;
      quantity: number;
      totalPrice: number;
    }[];
    totalOrderPrice: number;
    orderStatus: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    paymentMethod: 'cash' | 'online';
    deliveryAddress?: string;
    specialInstructions?: string;
    orderDate: Date;
    estimatedDeliveryTime?: Date;
  };