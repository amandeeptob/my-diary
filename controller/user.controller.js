const userModel = require('../model/user.model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req,res)=>{
    console.log('body: ',req.body)
    const {name,password,email} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        let user = await userModel.findOne({email: email})
        if(user){
            return res.status(400).json({msg: "User already exists"});
        }
        newUser = await userModel.create({
            name: name,
            password: hashedPassword,
            email: email
        });
        console.log(newUser)
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"something went wrong..."});
    }

    let token = jwt.sign({email:newUser.email,name:newUser.name},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
    console.log('signup:',token)
    res.status(200)
    .cookie("token", token, {
        httpOnly: true,
        maxAge: process.env.TOKEN_EXPIRY_DURATION
    })
    .redirect('/');
}

const login = async (req,res)=>{
    console.log("Login:",req.body)
    const {email,password} = req.body
    const user = await userModel.findOne({email: email});
    if(!user){
        return res.status(400).json({msg: "Invalid credentials"});
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({msg: "Invalid credentials"});
    }else{
        const token = jwt.sign({email:user.email,name:user.name},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
        res.status(200)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: process.env.TOKEN_EXPIRY_DURATION
        })
        .redirect('/'); 
    }
}

const resetPassword = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        let user = await userModel.findOne({email: email})
        if(!user){
            return res.status(201).json({msg: "Passwor changed!!"});
        }
        user.password=hashedPassword
        console.log('Dw: ',password)
        await user.save({ validateBeforeSave: false });
        return res.status(200)
        .redirect('/'); 
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"something went wrong..."});
    }
}

module.exports = {login,signup,resetPassword};