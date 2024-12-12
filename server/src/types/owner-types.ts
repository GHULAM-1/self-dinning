import { Types } from "mongoose";

export type MenuItem = {
  _id: Types.ObjectId;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  itemDesc: string;
  label?: string;
  isDiabledItem?: boolean;
  itemDiscount?: number;
};

export type Category = {
  _id: Types.ObjectId;
  categoryName: string;
  categoryImage: string;
  isDisabledCategory?: boolean;
  categoryDiscount?: number;
  items: MenuItem[];
};

export type Menu = {
  categories: Category[];
};

export type Restaurant = {
  _id: Types.ObjectId;
  restaurantName: string;
  restaurantImage: string;
  restaurantAddress: string;
  restaurantDetails: string;
  restaurantOrders: Types.ObjectId[];
  restaurantReview: RestaurantReview[];
  branchName: string;
  branchCode: string;
  openingTime: Date;
  closingTime: Date;
  isClosed?: boolean;
  menu: Menu;
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

export type RestaurantReview = {
  reviewByUser: Types.ObjectId;
  reviewText?: string;
  reviewRating?: number;
  reviewDate: Date;
};

export type ownerT = {
  _id: Types.ObjectId;
  ownerName: string;
  ownerCnic: number;
  acounts: Account[];
  subscription: Subscription;
  restaurants: Restaurant[];
};