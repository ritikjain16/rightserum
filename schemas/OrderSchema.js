import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  //   email: String,
  //   oid: String,
  //   details: String,
  //   orderedDate: String,
  //   packedDate: String,
  //   shippedDate: String,
  //   deliveredDate: String,
  //   pickupDate: String,
  //   returnDate: String,
  //   status: String,
  order: Array,
});

const OrderList = mongoose.model("order", orderSchema);

export default OrderList;
