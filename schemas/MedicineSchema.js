import mongoose from "mongoose";

const medicineSchema = mongoose.Schema({
  name: String,
  expiry_date: String,
  type: String,
  price:Number,
  cuttedPrice:Number
});

const MedicineList = mongoose.model("medicine", medicineSchema);

export default MedicineList;
