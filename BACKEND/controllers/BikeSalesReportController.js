 const Breport = require("../Model/BikeSalesReportModel");

 //Display all bike sales reports
const getAllBikeSalesReports = async (req, res, next) => {

    let reports;
// Get all bike sales reports
    try {
        reports = await Breport.find();
    }
    catch (err) {
        console.log(err);
    }  
    // If no reports found
    if(!reports){
        return res.status(404).json({message: "No reports found"});
    }
    //display all reports
    return res.status(200).json({reports});
};

//data insert
const addReports = async (req, res, next) => {
    const { name, license_no, NIC, address, contact_no, bike_model, color, chassis_no, reg_year, last_price, date } = req.body;

    let reports;
    try {
        reports = new Breport({name, license_no, NIC, address, contact_no, bike_model, color, chassis_no, reg_year, last_price, date});
        await reports.save();
    }catch (err) {
        console.log(err);
    }
    //dont insert reports
    if(!reports){
        return res.status(500).send({message: "Unable to add"});
    }
    return res.status(201).json({reports});
};
        
//get by id
const getByID = async (req, res, next) => {
    const id = req.params.id;

    let reports;

    try {
        reports = await Breport.findById(id);
    }
    catch (err) {     
        console.log(err);
    }
    //if no reports found
    if(!reports){
        return res.status(404).json({message: "No reports found"});
    }
    return res.status(200).json({reports});
}        

//update report details
const updateReport = async (req, res, next) => {
    const id = req.params.id;
    const { name, license_no, NIC, address, contact_no, bike_model, color, chassis_no, reg_year, last_price, date } = req.body;   
   
    let reports;

    try {
        reports = await Breport.findByIdAndUpdate(id, 
            {name, license_no, NIC, address, contact_no, bike_model, color, chassis_no, reg_year, last_price, date});
        reports = await reports.save();
    } 
    catch (err) {
        console.log(err);
    } 

    if(!reports){
        return res.status(404).json({message: "Unable to update by this ID"});
    }
    return res.status(200).json({reports});
}

//delete reports
const deleteReport = async (req, res, next) => {
    const id = req.params.id;

    let reports;

    try {
        reports = await Breport.findByIdAndDelete(id);
    }   
    catch (err) {
        console.log(err);
    }   
    if(!reports){       
        return res.status(404).json({message: "Unable to delete by this ID"});
    }   
    return res.status(200).json({reports});
}


exports.getAllBikeSalesReports = getAllBikeSalesReports;
exports.addReports = addReports;
exports.getByID = getByID;
exports.updateReport = updateReport;
exports.deleteReport = deleteReport;