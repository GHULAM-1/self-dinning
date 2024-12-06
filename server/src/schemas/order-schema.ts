import mongoose, { Schema, Document, Types } from "mongoose";
import { UserT } from "../types/user-types";
import { ownerT } from "../types/owner-types";
import { OrderT } from "@/types/order-types";

const Order: Schema = new Schema({
    items: [{
      item: {
        type: Types.ObjectId,
        ref: "Owner.menus.categories.items",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      totalPrice: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    totalOrderPrice: {
      type: Number,
      required: true,
      min: 0
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online'],
      required: true
    },
    deliveryAddress: {
      type: String
    },
    specialInstructions: {
      type: String
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    estimatedDeliveryTime: {
      type: Date
    }
  });
  
  export default mongoose.model<OrderT & Document>("Order", Order);