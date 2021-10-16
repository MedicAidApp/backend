const Patient = require("./schemas/patient");
const axios = require("axios");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/medicaid");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});


function randomNumber(min, max){return Math.floor(Math.random() * (max - min + 1)) + min;}

function randomArr(){
    let arr = [];
    const len = randomNumber(1, 20);
    for(let i = 0; i <= len; i++){
        arr.push(randomNumber(0, 500));
    }
    return arr;
}

async function saveRandUser(){
    await Patient.deleteMany({});
    for(let i = 0; i < 30; i++)
    {
        const fakeProfile = (await axios.get("https://randomuser.me/api/")).data.results[0];
        const data = {
            "email": fakeProfile.email,
            "gender": fakeProfile.gender,
            "firstName": fakeProfile.name.first,
            "lastName": fakeProfile.name.last,
            "age": fakeProfile.dob.age,
            "symptoms": randomArr(),
            "notes": `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
            molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
            numquam blanditiis harum quisquam eius sed odit fugiat iusto.`
        }
        console.log(data, ",");
        const newPatient = new Patient(data);
        await newPatient.save();
    }
}

saveRandUser().then(()=>mongoose.connection.close())