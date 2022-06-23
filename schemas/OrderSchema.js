import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  order: [
    {
      oid: String,
      details: {
        // cartdet: {
        //   // cartitems: [{ cid: String, mid: String }],
        // },
      },
    },
  ],
});

const OrderList = mongoose.model("order", orderSchema);

export default OrderList;
