const express= require('express')
const app =express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
//import routes
const authRoute = require("./routes/auth")
dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_CONNECT
,()=>{console.log("connecte to DB!")});

app.use(express.json());
//route middelwer
app.use("/api/user", authRoute)

//Middlwer




app.listen(4000, ()=>{console.log("server is running")});
