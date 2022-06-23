import express from "express";
import UserList from "../schemas/UserSchema.js";
import OrderList from "../schemas/OrderSchema.js";
import MedList from "../schemas/MedicineSchema.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const finduser = await UserList.findOne({ email: req.body.email });
    if (finduser) {
      res.status(200).send({ mess: "Already Exists" });
    } else {
      const user = await UserList.create(req.body);
      res.status(200).send({ mess: "Signup Success!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/getuser", async (req, res) => {
  try {
    const finduser = await UserList.findOne({ email: req.body.email });
    if (finduser) {
      res.status(200).send(finduser);
    } else {
      res.status(200).send({ mess: "Something went wrong!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/addmedicine", async (req, res) => {
  const { email, mid, cid, qty } = req.body;
  try {
    if (qty === 1) {
      const addmed = await UserList.updateOne(
        { email },
        { $push: { cart: { mid, cid, qty, isReviewed: false } } }
      );
      res.status(200).send("Added");
    } else {
      const addmed = await UserList.updateOne(
        {
          email,
          "cart.mid": mid,
          "cart.cid": cid,
        },
        {
          $set: {
            "cart.$.mid": mid,
            "cart.$.cid": cid,
            "cart.$.qty": qty,
            "cart.$.isReviewed": false,
          },
        }
      );
      res.status(200).send("Added1");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/removemedicine", async (req, res) => {
  const { email, mid, cid, qty } = req.body;
  try {
    if (qty === 0) {
      const deletemed = await UserList.updateOne(
        { email },
        { $pull: { cart: { mid, cid } } }
      );
      res.status(200).send("Removed");
    } else {
      const deletemed = await UserList.updateOne(
        {
          email,
          "cart.mid": mid,
          "cart.cid": cid,
        },
        {
          $set: {
            "cart.$.mid": mid,
            "cart.$.cid": cid,
            "cart.$.qty": qty,
            "cart.$.isReviewed": false,
          },
        }
      );
      res.status(200).send("Removed1");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/addaddress", async (req, res) => {
  const { email, address, aid } = req.body;
  try {
    const addaddress = await UserList.updateOne(
      { email },
      { $push: { addresses: { address, aid } } }
    );
    res.status(200).send("Added");
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/updateaddress", async (req, res) => {
  const { email, address, aid } = req.body;
  try {
    const updateaddress = await UserList.updateOne(
      { email, "addresses.address.aid": aid },
      {
        $set: {
          "addresses.$.address.aid": aid,
          "addresses.$.address.aname": address.aname,
          "addresses.$.address.ahouseno": address.ahouseno,
          "addresses.$.address.alocality": address.alocality,
          "addresses.$.address.apincode": address.apincode,
          "addresses.$.address.astate": address.astate,
          "addresses.$.address.acity": address.acity,
          "addresses.$.address.amobile": address.amobile,
        },
      }
    );
    res.status(200).send("Updated");
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/deleteaddress", async (req, res) => {
  const { email, aid } = req.body;
  try {
    const deleteaddress = await UserList.updateOne(
      { email },
      { $pull: { addresses: { aid } } }
    );
    res.status(200).send("Removed");
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/placeorder", async (req, res) => {
  const { email } = req.body;
  try {
    const addinmyorders = await OrderList.create({ order: req.body });
    try {
      const addorder = await UserList.updateOne(
        { email },
        {
          $push: { orders: { singleorder: req.body } },
          $set: { cart: [] },
        }
      );
      res.status(200).send("Order Placed");
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/getorders", async (req, res) => {
  const { email } = req.body;
  try {
    const getorders = await UserList.findOne({ email });
    res.status(200).send(getorders.orders.reverse());
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/getlimitedorders", async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const images = await OrderList.find(
      { "order.email": req.body.email },
      undefined,
      { skip, limit: 10 }
    ).sort({ $natural: -1 });
    res.status(200).send(images);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/review/add", async (req, res) => {
  const { mid, cid, oid, reviewData, email, qty } = req.body;
  try {
    const addinmed = await MedList.updateOne(
      { _id: mid },
      { $push: { reviews: reviewData } }
    );

    try {
      const addreviewinuser = await UserList.updateOne(
        {
          email,
        },
        {
          $set: {
            "orders.$[o].singleorder.details.cartdet.cartitems.$[c].cid": cid,
            "orders.$[o].singleorder.details.cartdet.cartitems.$[c].mid": mid,
            "orders.$[o].singleorder.details.cartdet.cartitems.$[c].isReviewed": true,
            "orders.$[o].singleorder.details.cartdet.cartitems.$[c].qty": qty,
          },
        },
        {
          arrayFilters: [
            { "o.singleorder.oid": oid },
            { "c.cid": cid, "c.mid": mid },
          ],
        }
      );
      res.status(200).send({ msg: "Review added by user!!!" });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

export default router;
