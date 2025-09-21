const register = require("../Model/RegisterModel");

//data display
const getAllregister = async (req, res, next) => {
  let registers;
    //Get all registers
    try {
        registers = await register.find();
    } catch (err) {
        console.log(err);
    }
    //not found
    if (!registers) {
        return res.status(404).json({ message: "User Not found" });
    }

    //display all registers
    return res.status(200).json({ registers });
}
//data insert
const addRegister = async (req, res, next) => {
    const {Email, Name, Password, Number } = req.body;
    let registers;
    try {
        registers = new register({
            Email,
            Name,
            Password,
            Number
        });
        await registers.save();
    } catch (err) {
        console.log(err);
    } 
    //If insert not working
    if (!registers) {
        return res.status(404).send({ message: "Unable to add" });
    }
    return res.status(200).json({ registers });
};
//Get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let registers;
    try {
        registers = await register.findById(id);
    } catch (err) {
        console.log(err);
    }
    //not found
    if (!registers) {
        return res.status(404).json({ message: "User Not found" });
    }
    //display by id
    return res.status(200).json({ registers });
}
//exports
exports.getAllregister = getAllregister;
exports.addRegister = addRegister;
exports.getById = getById;

