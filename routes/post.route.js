const express = require("express")
const {PostModel} = require("../models/post.model")

const postRouter = express.Router()

postRouter.get("/",async(req,res)=>{
    let query = req.query
    try{
        if(query){
            const notes = await PostModel.find(query)
            res.send(notes)
        }
        else{
            const notes = await PostModel.find()
            res.send(notes)
        }
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

postRouter.post("/create", async(req,res)=>{
    const payload = req.body
    try{
        const note = await PostModel(payload)
        await note.save()
        res.send({message:"Post Created"})
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

postRouter.patch("/update/:id", async(req,res)=>{
    const payload = req.body
    const id = req.params.id
    const note = await PostModel.findOne({_id:id})
    const userID_in_note = note.userID
    const userID_in_making = req.body.userID
    try{
        if(userID_in_making !== userID_in_note){
            res.send({message:"You are not authorized"})
        }
        else{
            await PostModel.findByIdAndUpdate({_id:id},payload)
            res.send({message:"Updated the post"})
        }
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

postRouter.delete("/delete/:id", async(req,res)=>{
    const payload = req.body
    const id = req.params.id
    const note = await PostModel.findOne({_id:id})
    const userID_in_note = note.userID
    const userID_in_making = req.body.userID
    try{
        if(userID_in_making !== userID_in_note){
            res.send({message:"You are not authorized"})
        }
        else{
            await PostModel.findByIdAndDelete({_id:id},payload)
            res.send({message:"Deleted the post"})
        }
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

module.exports = {postRouter}