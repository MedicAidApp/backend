const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 1,
        maxLength: 60,
        lowercase: true,
        required: [true, "First name is required"]
    },
    lastName: {
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
        enum: ["male", "female", "other"],
        required: [true, "gender is required"]
    },
    symptoms: [Number],
    notes:{type:String, maxLength:5000}
})

module.exports = mongoose.model("patient", PatientSchema);

//name [text]
//last name [text]
//age [int]
//gender [int]
//symptoms [arr of int in range []]