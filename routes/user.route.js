const express = require("express")
const {UserModel} = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()

const userRouter = express.Router()

userRouter.post("/register", async(req,res)=>{
    const {name,email,gender,password,city,age} = req.body
    try{
        bcrypt.hash(password, 5, async(err,secure_password)=>{
            if(err){
                res.send({message:"Something went wrong", error:err.message})
            }
            else{
                const user = new UserModel({name,email,gender,password:secure_password ,city,age})
                await user.save()
                res.send({message:"User Registered"})
            }
        })
    }catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

userRouter.post("/login", async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = await UserModel.find({email})
        const hashed_pass = user[0].password
        if(user.length>0){
            bcrypt.compare(password, hashed_pass, (err,result)=>{
                if(result){
                    const token = jwt.sign({userID:user[0]._id}, process.env.key)
                    res.send({message:"Login Successful", token:token})
                }
                else{
                    res.send({message:"Wrong Credentials"})
                }
            })
        }
        else{
            res.send({message:"Wrong Credentials"})
        }
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

module.exports = {userRouter}