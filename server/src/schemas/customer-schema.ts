import { CustomerT } from "@/types/customer-types";
import mongoose, { Schema, Document, Types } from "mongoose";

const CustomerSchema: Schema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    orders: [
      {
        type: Types.ObjectId,
        ref: "Order"
      }
    ],
  });
  
  export default mongoose.model<CustomerT & Document>("Customer", CustomerSchema);