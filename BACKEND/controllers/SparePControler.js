const SpareP = require("../Model/SparePModel");

const getAllSpareParts = async (req, res, next) => {
  let sp;
  // get all spare parts display 
  try {
    sp = await SpareP.find();
  } catch (err) {
    console.log(err);
  }
  //not found
  if (!sp) {
    return res.status(404).json({ message: "Spare parts not found" });
  }

  //Displays all spare parts
  return res.status(200).json({ sp });
};

// Low stock: quantity below threshold (default 5)
const getLowStock = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const items = await SpareP.find({ Quentity: { $lt: threshold } });
    return res.status(200).json({ items, count: items.length, threshold });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to fetch low stock items" });
  }
};

//Data Insert
const addSpareParts = async (req,res,next) => {

    const {barcode,name,brand,rack,Quentity,price} = req.body;

    let sp;

    try{
        sp = new SpareP({barcode,name,brand,rack,Quentity,price});
        await sp.save();
    }
    catch(err){
        console.log(err);
    }

    // not insert spare parts
    if(!sp){
        return res.status(404).json({message:"unable to add spare parts"});
    }
    return res.status(200).json({ sp });

};

//Get by Id
const getById = async (req, res, next) => {
  
    const id = req.params.id;

    let sp;

    try{
        sp = await SpareP.findById(id);
    }
    catch(err){
        console.log(err);
    }

    //not avaiable spare parts
    if(!sp){
        return res.status(404).json({message:"spare part not found"});
    }
    return res.status(200).json({sp});

};

//Update spare parts details
const updateSpareParts = async (req,res,next) =>{
  
  const id = req.params.id;
  const {barcode,name,brand,rack,Quentity,price} = req.body;

  let sp;

  try{
    sp = await SpareP.findByIdAndUpdate(
      id,
     {barcode:barcode,name:name,brand:brand,rack:rack,Quentity:Quentity,price:price});
     sp = await SpareP.findById(id);
  }catch(err){
    console.log(err);
  }
  if(!sp){
        return res.status(404).json({message:"Unable to update spare parts details"});
    }
    return res.status(200).json({sp});
};


//Delete Spare parts details
const deleteSpareParts = async(req,res,next)=>{
  const id = req.params.id;

  let sp;

  try{
    sp = await SpareP.findByIdAndDelete(id)
  }catch(err){
    console.lof(err);
  }
  if(!sp){
        return res.status(404).json({message:"Unable to delete spare parts details"});
    }
    return res.status(200).json({sp});
};


exports.getAllSpareParts = getAllSpareParts;
exports.getLowStock = getLowStock;
exports.addSpareParts = addSpareParts;
exports.getById = getById;
exports.updateSpareParts = updateSpareParts;
exports.deleteSpareParts = deleteSpareParts;