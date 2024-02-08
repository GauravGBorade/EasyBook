import mongoose from "mongoose";

export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

//user schema
const userSchema = new mongoose.Schema({
  email: { type: String, reqruired: true, unique: true },
  password: { type: String, reqruired: true },
  firstName: { type: String, reqruired: true },
  lastName: { type: String, reqruired: true },
});

//type the user schema and export it.
const User = mongoose.model<UserType>("User", userSchema);
export default User;
