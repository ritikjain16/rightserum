import dotenv from "dotenv";
import uniqid from "uniqid";
import Razorpay from "razorpay";
import formidable from "formidable";
import OrderList from "../../schemas/OrderSchema.js";
import UserList from "../../schemas/UserSchema.js";
import request from "request";
import crypto from "crypto";
dotenv.config();

let orderId;
var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
  //   headers: { "X-Razorpay-Account": "" },
});

let oid1, email;
let mydata;

export const createOrder = (req, res) => {
  const { amount1, oid } = req.body;
  oid1 = oid;
  mydata = req.body;
  email = req.body.email;
  var options = {
    amount: amount1, // amount in the smallest currency unit
    currency: "INR",
    receipt: uniqid(),
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    orderId = order.id;
    res.json(order);
  });
};

export const paymentCallback = async (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (fields) {
      {
        const hash = crypto
          .createHmac("sha256", process.env.KEY_SECRET)
          .update(orderId + "|" + fields.razorpay_payment_id)
          .digest("hex");

        // console.log("hash", hash);

        // if (fields.razorpay_signature === hash) {
        //store in db
        const info = {
          _id: fields.razorpay_payment_id,
          orders: fields,
        };

        mydata["oid1"] = fields.razorpay_payment_id;
        mydata["orderID"] = fields.razorpay_order_id;
        mydata["razorpay_payment_id"] = fields.razorpay_payment_id;
        mydata["razorpay_order_id"] = fields.razorpay_order_id;
        mydata["razorpay_signature"] = fields.razorpay_signature;
        mydata["payment_method"] = "Online";

        try {
          const addinmyorders = await OrderList.create({ order: mydata });
          try {
            const addorder = await UserList.updateOne(
              { email },
              {
                $push: { orders: { singleorder: mydata } },
                $set: { cart: [] },
              }
            );
            res.redirect(`${process.env.FRONTEND}/orders`);
          } catch (e) {
            console.log(e);
            res.status(400).send(e);
          }
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }
      }
    }
  });
};

export const getPayment = (req, res) => {
  OrderSchema.findById(req.params.paymentID).exec((err, data) => {
    if (err || data == null) {
      return res.json({
        error: "No data found",
      });
    } else {
      request(
        `https://${process.env.KEY_ID}:${process.env.KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentID}`,
        function (error, response, body) {
          if (body) {
            const result = JSON.parse(body);
            res.status(200).json(result);
          }
        }
      );
    }
  });
};
