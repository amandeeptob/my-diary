const userModel = require('../model/user.model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req,res)=>{
    const {name,password,email} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        let user = await userModel.findOne({email: email})
        if(user){
            res.render('wrongPassword',{title:"Ye to coincidence ho gya bhai🫨",leftHeading:"Duniya me ek jaise 7 log hote hain😶",leftMessage:"Tumse pahle v ek aaya tha tumhare jaisa🙂",message:"Ye thobda to dekhela lag rha hai bhai🫠"});
        }
        newUser = await userModel.create({
            name: name,
            password: hashedPassword,
            email: email
        });
    }catch(error){
        console.log(error);
        res.render('wrongPassword',{title:"Arre mujhe chakkar aa rhe hain🫨",leftHeading:"Kuch to gadbad hai Daya🤔",leftMessage:"Jra pta lagao ki ye hua kaise??🤨",message:"Tum ghar jao ham prabandh karte hain!!"});
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
    const {email,password} = req.body
    console.log('dl: ',password)
    const user = await userModel.findOne({email: email});
    if(!user){
        res.render('wrongPassword',{title:"Gajab topibaaj aadmi ho bee😶",leftHeading:"Arre kya, kya karu main iska!!",leftMessage:"control! control Uday control🫢",message:"firse signup kyu kar rhe ho tum🫠"});
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        res.render('wrongPassword',{title:"Itne galat kaise ho sakte ho?? 🥲",leftHeading:"Kaise kaise log rahte hain yha!!",leftMessage:"Ek din kachre wala utha ke le jayega🤪",message:"Wrong Password!!!"});
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
            res.render('wrongPassword',{title:"Le ho gya change🙂",leftHeading:"Chalo munna ab ghar jao",leftMessage:"Aur agli baar bhoole to mere paas mat aana🫢",message:"Chalo ab ghar jao🫠"});
        }
        user.password=hashedPassword
        console.log('Dw: ',password)
        await user.save({ validateBeforeSave: false });
        return res.status(200)
        .redirect('/'); 
    }catch(error){
        console.log(error);
        res.render('wrongPassword',{title:"Arre mujhe chakkar aa rhe hain🫨",leftHeading:"Kuch to gadbad hai Daya🤔",leftMessage:"Jra pta lagao ki ye hua kaise??🤨",message:"Tum ghar jao ham prabandh karte hain!!"});
    }
}

module.exports = {login,signup,resetPassword};