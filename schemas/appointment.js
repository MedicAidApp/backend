const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema({
    date: {type: Date, required: true},
    status: {type: String, enum: ["Completed", "Canceled", "Pending", "Incomplete"], required: true},
    notes : {type: String, maxLength: 5000},
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patient",
        required: true
    }
});

module.exports = mongoose.model("appointment", AppointmentSchema);