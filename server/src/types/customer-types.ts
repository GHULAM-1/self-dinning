import mongoose, { Schema, Document, Types } from "mongoose";

export type CustomerT = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  orders: Types.ObjectId[];
};
