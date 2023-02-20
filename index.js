const express = require("express")
const {connection} = require("./configs/db")
const {userRouter} = require("./routes/user.route")
const {postRouter} = require("./routes/post.route")
const {authenticate} = require("./middlewares/authenticate.middleware")
require("dotenv").config()
const cors = require("cors")

const app = express()
app.use(cors({
    origin:"*"
})
)
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Homepage")
})

app.use("/users", userRouter)
app.use(authenticate)
app.use("/posts",postRouter)


app.listen(process.env.port, async(req,res)=>{
    try{
        await connection
        console.log("Connected to the DB")
    }
    catch(err){
        console.log("Something went wrong")
    }
    console.log(`Listening to port ${process.env.port}`)
})