const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
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

app.get("/", (req, res)=>{
    //landing page
    console.log("Landing page");
});

app.get("/patient", asyncCatch(async (req, res) =>{
    //view all patients
    const patients = await Patient.find({});
    res.send(patients);
}));

app.post("/patient", asyncCatch(async (req, res) =>{
    //create new patient
    const newPatient = await Patient.insertOne(req.body);
    await Patient.save()
    res.redirect(`patient/${newPatient/_id}`);
}));

app.get("/patient/:id", asyncCatch(async(req, res)=>{
    //read one patient
    const patient = await Patient.findById(req.params.id);
    res.send(patient);
}));

app.put("/patient/:id", asyncCatch(async(req, res, next)=>{
    //update one patient
    const id = req.params.id;
    await Patient.findByIdAndUpdateid(id, {...req.body.body});
    next(e);
    res.redirect(`patient/${newPatient/_id}`);
}));

app.delete("/patient/:id", asyncCatch(async(req, res)=>{
    //delete one patient
    const id = req.params.id;
    await Patient.findByIdAndDelete(id);
    res.redirect("/patients");

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