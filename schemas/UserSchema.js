import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  orders: Array,
  wishlist: Array,
  addresses: Array,
  cart:Array
});

const UserList = mongoose.model("user", userSchema);

export default UserList;
