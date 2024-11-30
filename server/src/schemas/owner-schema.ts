import mongoose, { Schema, Document, Types } from "mongoose";
import { ownerT } from "@/types/owner-types";

const OwnerSchema: Schema = new Schema({
  ownerName: {
    type: String,
    required: true,
  },
  ownerCnic: {
    type: Number,
    required: true,
  },
  businessImage: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  businessAddress: {
    type: String,
    required: true,
  },
  businessNumber: {
    type: String,
    required: true,
  },
  ownerOrders: [
    {
      type: Types.ObjectId,
      ref: "Order",
    },
  ],
  isClosed: {
    type: Boolean,
    default: false,
  },
  openingTime: {
    type: Date,
    required: true,
  },
  closingTime: {
    type: Date,
    required: true,
  },
  acounts: [
    {
      accountName: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: Number,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
    },
  ],
  subscription: {
    subscriptionPlan: {
      type: String,
      default: "trial period",
    },
    subscriptionStarts: {
      type: Date,
      required: true,
    },
    subscriptionEnds: {
      type: Date,
      required: true,
    },
  },
  menus: [
    {
      categories: [
        {
          categoryName: {
            type: String,
            required: true,
          },
          categoryImage: {
            type: String,
            required: true,
          },
          isDisabledCategory: {
            type: Boolean,
            default: false,
          },
          categoryDiscount: {
            type: Number,
          },
          items: [
            {
              itemName: {
                type: String,
                required: true,
              },
              itemImage: {
                type: String,
                required: true,
              },
              itemPrice: {
                type: Number,
                required: true,
              },
              itemDesc: {
                type: String,
                required: true,
              },
              label: {
                type: String,
              },
              isDiabledItem: {
                type: Boolean,
                default: false,
              },
              itemDiscount: {
                type: Number,
              },
            },
          ],
        },
      ],
    },
  ],
  ownerReviews: [
    {
      reviewByUser: {
        type: Types.ObjectId,
        ref: "User", 
      },
      reviewText: {
        type: String,
      },
      reviewRating: {
        type: Number,
      },
      reviewDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model<ownerT & Document>("Owner", OwnerSchema);