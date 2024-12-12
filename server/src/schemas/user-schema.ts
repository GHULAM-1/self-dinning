import mongoose, { Schema, Document, Types } from "mongoose";
import { UserT } from "../types/user-types";

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String, 
      required: true, 
    },
    password: {
      type: String
    }, 
    email: {
      type: String, 
      required: true
    }, 
    profileImage: {
      type: String,
    },
    cart: {
      items: [
        {
          restaurantId: {
            type: Types.ObjectId,
            ref: "restaurants",
            default: null,
            required: true
          },
          category: {
            type: Types.ObjectId,
            required: true
          },
          item: {
            type: Types.ObjectId,
            required: true
          },
          itemName: {
            type: String,
            required: true
          },
          itemImage: {
            type: String,
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
          },
          itemPrice: {
            type: Number,
            required: true
          },
          itemDiscount: {
            type: Number,
            default: 0
          }
        }
      ],
      totalItems: {
        type: Number,
        default: 0
      },
      totalPrice: {
        type: Number,
        default: 0
      }
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<UserT & Document>("User", UserSchema);