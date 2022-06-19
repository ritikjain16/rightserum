import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userroutes.js";
import medicineRouter from "./routes/medicineroutes.js";
import paymentRoute from "./routes/payment/paymentRoutes.js"
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((e) => {
    console.log("Error------->" + e);
  });

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/medicine", medicineRouter);
app.use("/api", paymentRoute);

app.post("/getkey", (req, res) => {
  res.status(200).send(process.env.KEY_ID);
});


app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
