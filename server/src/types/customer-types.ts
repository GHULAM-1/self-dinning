import mongoose, { Schema, Document, Types } from "mongoose";

export type CustomerT = {
    name: string;
    email: string;
    phoneNumber: string;
    orders: Types.ObjectId[];
  };