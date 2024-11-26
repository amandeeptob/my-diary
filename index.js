const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");

const {login,signup}=require('./controller/user.controller')
const auth = require('./controller/auth.controller')
const {send,save,entry} = require('./controller/diary.controller')

const port = parseInt(process.env.PORT) || 8080
dotenv.config()
const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname,'public')))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.get('/',auth,(req,res)=>{
    if(req.user===null || req.user===undefined)
        res.render('login')
    else res.render('index',{user:req.user.name})
})

app.post('/login',login)
app.post('/signup',signup)

app.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect("/");
})

app.post('/saveDiary',auth,save)

app.post('/getDiary',auth,send)

app.post('/entries',auth,entry)

mongoose.connect(process.env.DB,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server started on port ${port}`)
    });
    console.log("Connected to MongoAtlas")
}).catch((err)=>{
    console.log("Error connecting to MongoAtlas... Are you connected to HP??");
    console.log(err);
});