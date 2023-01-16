const express = require("express");
const { connection } = require("./configs/db");
require("dotenv").config();
const cors = require("cors");
const { socialMediaRouter } = require("./routes/social-media.routes");
const app = express();

app.use(express.json())
app.use(cors());
app.use("/socialMedia",socialMediaRouter);

app.get("/",(req,res)=>{
    res.send("welcome")
})

app.listen(process.env.port,async ()=>{
    try {
        await connection;
        console.log("connected to DB");
    }
    catch (error) {
        console.log("Error while connecting to DB");
        console.log(error);
    }
    console.log(`server is runnig at ${process.env.port}`);
})