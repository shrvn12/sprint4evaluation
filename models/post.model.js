const mongoose = require("mongoose");

let postSchema = mongoose.Schema({
    title:String,
    body:String,
    device:String
})

const postModel = mongoose.model("posts",postSchema);

module.exports = {
    postModel
}