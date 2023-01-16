const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    name:String,
    email:String,
    gender:String,
    password:String
})

const userModel = mongoose.model("users",userSchema);

module.exports = {
    userModel
}