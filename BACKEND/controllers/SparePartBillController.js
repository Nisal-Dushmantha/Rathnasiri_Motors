const SpareB = require("../Model/SparePartBillModel");

const getAllSparePartsBill = async (req, res, next) => {

  let spb;
  // get all spare parts display 
  try {
    spb = await SpareB.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!spb) {
    return res.status(404).json({ message: "Spare parts Bill not found" });
  }

  //Displays all spare parts
  return res.status(200).json({ spb });
};



//Data Insert
const addSparePartsBill = async (req,res,next) => {

  const {bill_no, date, customerName, name, brand, quantity, price} = req.body;

  // Backend validation: Only allow today or past dates
  const inputDate = new Date(date);
  const today = new Date();
  // Set time to 00:00:00 for both dates to compare only the date part
  inputDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  if (inputDate > today) {
    return res.status(400).json({ message: "Future dates are not allowed for the bill date." });
  }

  let spb;
  try {
    spb = new SpareB({ bill_no, date, customerName, name, brand, quantity, price });
    await spb.save();
  } catch (err) {
    console.log(err);
  }

  // not insert spare parts
  if (!spb) {
    return res.status(404).json({ message: "unable to add spare parts bill" });
  }
  return res.status(200).json({ spb });

};

//Get by Id
const getById = async (req, res, next) => {
  
    const id = req.params.id;

    let spb;

    try{
        spb = await SpareB.findById(id);
    }
    catch(err){
        console.log(err);
    }

    //not avaiable spare parts
if (!spb) {
    return res.status(404).json({ message: "Spare part bill not found" });
}


    return res.status(200).json({spb});
};

const deleteSparePartbillreports = async (req, res, next) => {
  const billNo = req.params.id; // now it's bill_no, not _id
  let spb;
  try {
    spb = await SpareB.deleteMany({ bill_no: billNo });
  } catch (err) {
    console.log(err);
  }
  if (!spb || spb.deletedCount === 0) {
    return res.status(404).json({ message: "Unable to delete spare parts bill" });
  }
  return res.status(200).json({ spb });
};



exports.getAllSparePartsBill = getAllSparePartsBill;
exports.addSparePartsBill = addSparePartsBill;
exports.getById = getById;
exports.deleteSparePartbillreports = deleteSparePartbillreports;