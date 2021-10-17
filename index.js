if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const asyncCatch = require("./utils/asyncCatch");
const AppError = require("./utils/ExpressError.js");
const Patient = require("./schemas/patient");
const Appointment = require("./schemas/appointment");
const db = mongoose.connection;
const dbURL = process.env.DB_URL;

//TODO: add to routes

mongoose.connect(dbURL);
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.json());


/*Landing Page*/
app.get("/", (req, res)=>{
    res.send("Landing page");
});

/*View all patients*/
app.get("/patient", asyncCatch(async (req, res) =>{
    const patients = await Patient.find({});
    console.log(patients);
    res.send(patients);
}));

/*Create new patient page*/
app.get("/patient/new", (req ,res)=>{
    res.send("Patient creation page");
})

/*Create new patient*/
app.post("/patient/new", asyncCatch(async (req, res) =>{
    const data = req.body[0];
    console.log(data);
    const newPatient = new Patient(data)
    await newPatient.save()
    res.redirect(`/patient/${newPatient._id}`);
}));

/*View a patient page*/
app.get("/patient/:id", asyncCatch(async(req, res)=>{
    const patient = await Patient.findById(req.params.id);
    res.send(patient);
}));

/*Edit a patient page*/
app.get("/patient/:id/edit", function(req, res){
    //TODO: prepopulate the form
    res.send("edit patient");
})

/*Edit a patient*/
app.put("/patient/:id", asyncCatch(async(req, res)=>{
    const id = req.params.id;
    await Patient.findByIdAndUpdate(id, {...req.body[0]});
    res.redirect(`/patient/${id}`);
}));

/*Delete a patient*/
app.delete("/patient/:id", asyncCatch(async(req, res)=>{
    const patientId = req.params.id;
    await Patient.findByIdAndDelete(patientId);
    await Appointment.deleteMany({patient:patientId});
    res.redirect("/patient");
}))

/*Create a new appointment*/
app.post("/appointment/new", asyncCatch(async (req, res)=>{
    const data = req.body[0]; /*{date:year/month/day, status:"Completed"/"Pending"/"Cancelled/Incomplete", notes:"String", patient: ObjectId}*/
    const patient = await Patient.findById(data.patient);
    const newAppointment = new Appointment(data);
    patient.appointments.push(newAppointment);
    await patient.save();
    await newAppointment.save();
    res.redirect(`/patient/${data.patient}`);
}));

/*Edit an appointment*/
app.put("/appointment/:id/edit", asyncCatch(async (req, res)=>{
    const data = req.body[0]
    await Appointment.findByIdAndUpdate(data.patient, {...data});
    console.log({...req.body[0]});
    res.redirect(`/patient/${data.patient}`);
}));

/*Delete an appointment*/
app.delete("/appointment/:id", asyncCatch(async (req, res)=>{
    const appointmentId = req.params.id;
    let patientId;
    const appointment = Appointment.findById(appointmentId);
    await appointment.populate().
    exec(async function (err, story) {
      if (err) return AppError(500, "Cant populate DB");
      patientId = story.patient;
      await Patient.findByIdAndUpdate(patientId, {$pull:{appointments:appointmentId}})
    });
    await Appointment.findByIdAndDelete(appointmentId);
    res.redirect(`/patient/`);
}));

app.all('*', (req, res, next)=>{
    next(new AppError(404, "Page Not Found"))
})

app.use((err, req, res, next)=>{
    const {status = 500, message="Internal Server Error"} = err
    res.status(status)
    res.send(`Error ${status}\n${message}`);
})

app.listen(3000, ()=>{
    console.log("hi")
})
