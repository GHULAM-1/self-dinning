import { Types } from "mongoose";

export type MenuItem = {
  itemName: string;
  itemImage: string;
  itemPrice: number;
  itemDesc: string;
  label?: string;
  isDiabledItem?: boolean;
  itemDiscount?: number;
};

export type Category = {
  categoryName: string;
  categoryImage: string;
  isDisabledCategory?: boolean;
  categoryDiscount?: number;
  items: MenuItem[];
};

export type Menu = {
  categories: Category[];
};

export type Account = {
  accountName: string;
  accountNumber: number;
  bankName: string;
};

export type Subscription = {
  subscriptionPlan?: string;
  subscriptionStarts: Date;
  subscriptionEnds: Date;
};

export type OwnerReview = {
  reviewByUser: Types.ObjectId;
  reviewText?: string;
  reviewRating?: number;
  reviewDate: Date;
};

export type ownerT = {
  _id:Types.ObjectId
  ownerName: string;
  ownerCnic: number;
  businessImage: string;
  businessName: string;
  businessAddress: string;
  businessNumber: string;
  ownerOrders: Types.ObjectId[];
  isClosed?: boolean;
  openingTime: Date;
  closingTime: Date;
  acounts: Account[];
  subscription: Subscription;
  menus: Menu[];
  ownerReviews: OwnerReview[];
};