const express = require("express");
const { userModel } = require("../models/user.model");
const {postModel} = require("../models/post.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticator } = require("../middlewares/authenticator");
const saltRounds = +process.env.saltRounds;
const key = process.env.key;

const socialMediaRouter = express.Router();

socialMediaRouter.get("/",(req,res)=>{
    res.send({msg:"welcome to social media app"});
})

socialMediaRouter.post("/register",async (req,res)=>{
    let data = req.body;
    if(data.name && data.email && data.gender && data.password){
        bcrypt.hash(data.password, saltRounds, async (err, hash)=> {
            if(err){
                res.send({msg:"something went wrong"})
                console.log(err);
            }
            else{
                data.password = hash;
                const user = new userModel(data);
                await user.save();
                res.send({msg:"registration successul"});
            }
        });

    }
    else{
        res.send({msg:"please provide name, email, gender and password"})
    }
})

socialMediaRouter.post("/login",async (req,res)=>{
    const data = req.body;
    const dbdata = await userModel.find({"email":data.email});
    bcrypt.compare(data.password, dbdata[0].password, (err, result)=>{
        if(err){
            res.send({msg:"something went wrong"});
            console.log(err);
        }
        else{
            if(result){
                jwt.sign(data, "secretkey", (err, token) => {
                    if(err){
                        res.send({msg:"something went wrong"});
                        console.log(err);
                    }
                    else{
                        res.send({msg:"login successful", token});
                    }
                });
            }
            else{
                res.send({msg:"password do not match"});
            }
        }
    });

})

socialMediaRouter.use(authenticator);

socialMediaRouter.post("/posts/create",async(req,res)=>{
    let data = req.body;
    const token = req.headers.authorization;
    jwt.verify(token, key, function(err, decoded) {
        if(err){
            console.log(err);
        }
        else{
            data.email = decoded.email
        }
    });
    if(data.title && data.body && data.device){
        const post = new postModel(data)
        await post.save();
        res.send({msg:"post successful"})
    }
    else{
        res.send({msg:"please provide title body and device"})
    }
})

socialMediaRouter.get("/posts",async(req,res)=>{
    const token = req.headers.authorization;
    jwt.verify(token, key, async (err, decoded) => {
        if(err){
            res.send({msg:"something went wrong"})
        }
        else{
            const posts = await postModel.find({email:decoded.email})
            res.send({msg:"posts",posts});
        }
    });
})

socialMediaRouter.patch("/posts/update/:id",async(req,res)=>{
    const data = req.body;
    const id = req.params.id;
    if(data.title || data.body || data.device){
        try{
            await postModel.findByIdAndUpdate(id,data)
            res.send({msg:"update successful"});
        }
        catch(err){
            res.send({msg:"something went wrong"});
            console.log(err);
        }
    }
    else{
        res.send({msg:"please provide data in order to update"})
    }
})

socialMediaRouter.delete("/posts/delete/:id",async(req,res)=>{
    const id = req.params.id;
    try{
        await postModel.findByIdAndDelete(id)
        res.send({msg:"deletion successful"});
    }
    catch(err){
        res.send({msg:"something went wrong"});
        console.log(err);
    }
})



module.exports = {
    socialMediaRouter
}