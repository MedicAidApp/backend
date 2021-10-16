const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const asyncCatch = require("./utils/asyncCatch");
const AppError = require("./utils/ExpressError.js");
const Patient = require("./schemas/patient");
//const session = require("express-session");

//TODO: add to routes

mongoose.connect("mongodb://localhost:27017/medicaid");
const db = mongoose.connection;
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
    const id = req.params.id;
    await Patient.findByIdAndDelete(id);
    res.redirect("/patient");

}))

app.all('*', (req, res, next)=>{
    next(new AppError(404, "Page Not Found"))
})

/*app.use((err, req, res, next)=>{
    const {status = 500, message="Internal Server Error"} = err
    res.status(status)
    res.send(`Error ${status}\n${message}`);
})*/

app.listen(3000, ()=>{
    console.log("Connected")
})