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
  restaurants: [
    {
      restaurantName: {
        type: String,
        required: true,
      },
      restaurantImage: {
        type: String,
        required: true,
      },
      restaurantAddress: {
        type: String,
        required: true,
      },
      restaurantDetails: {
        type: String,
        required: true,
      },
      restaurantOrders: [
        {
          type: Types.ObjectId,
          ref: "Order",
        },
      ],
      restaurantReview: [
        {
          type: Types.ObjectId,
          ref: "Order",
        },
      ],
      branchName: {
        type: String,
        required: true,
      },
      branchCode: {
        type: String,
        required: true,
      },
      openingTime: {
        type: Date,
        required: true,
      },
      closingTime: {
        type: Date,
        required: true,
      },
      isClosed: {
        type: Boolean,
        default: false,
      },
      menu: {
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
    },
  ],
});

export default mongoose.model<ownerT & Document>("Owner", OwnerSchema);