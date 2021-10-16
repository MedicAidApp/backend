const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const AppError = require("./utils/ExpressError.js");
//const session = require("express-session");

//TODO: add to routes

mongoose.connect("mongodb://localhost:27017/medicaid",{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
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

});

app.get("/patient", (req, res) =>{
    //view all patients
});

app.post("/patient", (req, res) =>{
    //create new patient
});

app.get("/patient/:id", (req, res)=>{
    //read one patient
})

app.put("/patient/:id", (req, res)=>{
    //update one patient
})

app.delete("/patient/:id", (req, res)=>{
    //delete one patient
})

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