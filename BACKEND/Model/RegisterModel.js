const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({

    Email: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Number: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model(
    "registerModel",
    registerSchema
)