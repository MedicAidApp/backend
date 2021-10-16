const mongoose = require("mongoose");
const Schema = mongoose.Schema

const PatientSchema = new mongoose.Schema({
    first_name: {
        type: String,
        minLength: 1,
        maxLength: 60,
        lowercase: true,
        required: [true, "First name is required"]
    },
    last_name: {
        type: String,
        minLength: 1,
        maxLength: 60,
        lowercase: true,
        required: [true, "Last name is required"]
    },
    age: {
        type:Number,
        min: 0,
        max: 200,
        required: [true, "Age is required"]
    },
    gender: {
        type:String,
        enum: ["Male", "Female", "Other"],
        required: [true, "gender is required"]
    },
    symptoms: [Number]
})

module.exports = mongoose.model("patient", PatientSchema);

//name [text]
//last name [text]
//age [int]
//gender [int]
//symptoms [arr of int in range []]