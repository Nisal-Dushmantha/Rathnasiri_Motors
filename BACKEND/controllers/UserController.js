const User = require("../Model/UserModel");

//data display
const getAllUsers = async (req, res, next) => {

    let users;

    try{
        users = await User.find();
    }catch(err){
        console.log(err);
    }
    //not found
    if(!users || users.length === 0){
        return res.status(404).json({message:"User not found"})
    }
    //Display all users
    return res.status(200).json({ users });
};

//data insert
const addUsers = async (req, res, next) => {

    const { name,gmail,age,address} = req.body;

    let users;

    try{
        users =  new User({name,gmail,age,address});
        await users.save();
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Failed to add user" });
    }
    return res.status(201).json({users});

};

//get by id
const getById = async(req, res, next) => {

    const id = req.params.id;

    let users;

    try{
        users = await User.findById(id);
    }catch (err){
        console.error(err);
        return res.status(500).json({message:"Error fetching user"});
    }
    if (!users){
        return res.status(404).json({message:"user not found"});
    }
    return res.status(200).json({users});

}

//update user details
const updateUser = async(req, res, next) =>{

    const id = req.params.id;
    const { name,gmail,age,address} = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id,
            {name: name, gmail: gmail, age: age, address: address});
            users = await users.save();
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"unable to update user details."});
    }
    if (!users){
        return res.status(404).json({message:"user not found"});
    }
    return res.status(200).json({users});

}

//delete user details
const deleteUser = async(req, res, next) =>
{
     const id = req.params.id;

     let users;

     try{
        users = await User.findByIdAndDelete(id)
     }catch(err){
        console.error(err);
        return res.status(500).json({message:"unable to delete user details."});
     }
    if (!users){
        return res.status(404).json({message:"user not found"});
    }
    return res.status(200).json({users});

}
exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;