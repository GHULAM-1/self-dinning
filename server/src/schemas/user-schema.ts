import mongoose, { Schema, Document } from "mongoose";
import { UserT } from "../types/user-types";

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String, 
      required: true, 
    },
    password:{
        type:String
    } , 
    email:{
        type:String , 
        required:true
    } , 
    profileImage:{
        type:String,
    }

  },

);

export default mongoose.model<UserT & Document>("User", UserSchema);