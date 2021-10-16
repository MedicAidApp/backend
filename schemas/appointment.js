const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema({
    Date: {type: Date, required: true},
    Status: {type: String, enum: ["Completed", "Canceled", "Pending"], required: true},
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patient",
        required: true
    }
});

mongoose.model("appointment", AppointmentSchema)