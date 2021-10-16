const mongoose = require("mongoose");

const validateEmail = function(email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const PatientSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    firstName: {
        type: String,
        minLength: 1,
        maxLength: 60,
        trim: true,
        lowercase: true,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        minLength: 1,
        maxLength: 60,
        trim: true,
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
    notes:{type:String, maxLength:5000},
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "appointment"
        }
    ]
})

module.exports = mongoose.model("patient", PatientSchema);

//name [text]
//last name [text]
//age [int]
//gender [int]
//symptoms [arr of int in range []]