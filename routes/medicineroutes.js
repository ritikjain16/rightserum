import express from "express";
import MedicineList from "../schemas/MedicineSchema.js";
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const addMedicine = await MedicineList.create(req.body);
    res.status(200).send(addMedicine);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/get", async (req, res) => {
  try {
    const findMedicine = await MedicineList.find({
      name: { $regex:req.body.name, $options: "i" },
    });
    res.status(200).send(findMedicine);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/getcartmed", async (req, res) => {
  const { _id } = req.body;
  try {
    const findMedicine = await MedicineList.findOne({
      _id,
    });
    res.status(200).send(findMedicine);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/getbytype", async (req, res) => {
  const { type } = req.body;
  try {
    const findMedicine = await MedicineList.find({
      type,
    }).limit(4);
    res.status(200).send(findMedicine);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});



export default router;
