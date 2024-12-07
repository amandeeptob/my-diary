const userModel = require('../model/user.model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req,res)=>{
    const {name,password,email} = req.body;
    let newUser;
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        let user = await userModel.findOne({email: email})
        if(user){
            res.render('wrongPassword',{title:"Ye to coincidence ho gya bhai🫨",leftHeading:"Duniya me ek jaise 7 log hote hain😶",leftMessage:"Tumse pahle v ek aaya tha tumhare jaisa🙂",message:"Ye thobda to dekhela lag rha hai bhai🫠"});
        }else{
            newUser = await userModel.create({
                name: name,
                password: hashedPassword,
                email: email
            });
            let token = jwt.sign({email:newUser.email,name:newUser.name},process.env.SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRY_DURATION});
            console.log('Ds: ',password)
            res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                maxAge: process.env.TOKEN_EXPIRY_DURATION
            })
            .redirect('/');
        }
    }catch(error){
        console.log(error);
        res.render('wrongPassword',{title:"Arre mujhe chakkar aa rhe hain🫨",leftHeading:"Kuch to gadbad hai Daya🤔",leftMessage:"Jra pta lagao ki ye hua kaise??🤨",message:"Tum ghar jao ham prabandh karte hain!!"});
    }
}

const login = async (req,res)=>{
    const {email,password} = req.body
    console.log('dl: ',password)
    const user = await userModel.findOne({email: email});
    if(!user){
        res.render('wrongPassword',{title:"Tum pahli baar aaye ho naa?",leftHeading:"Arre kya, kya karu main iska!!",leftMessage:"control! control Uday control🫢",message:"Gajab topibaaj aadmi ho bee😶"});
    }else{
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
}

const resetPassword = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        let user = await userModel.findOne({email: email})
        if(!user){
            res.render('wrongPassword',{title:"Le ho gya change🙂",leftHeading:"Chalo munna ab ghar jao",leftMessage:"Aur agli baar bhoole to mere paas mat aana🫢",message:"Chalo ab ghar jao🫠"});
        }else{
            user.password=hashedPassword
            console.log('Dr: ',password)
            await user.save({ validateBeforeSave: false });
            return res.status(200)
            .redirect('/'); 
        }
    }catch(error){
        console.log(error);
        res.render('wrongPassword',{title:"Arre mujhe chakkar aa rhe hain🫨",leftHeading:"Kuch to gadbad hai Daya🤔",leftMessage:"Jra pta lagao ki ye hua kaise??🤨",message:"Tum ghar jao ham prabandh karte hain!!"});
    }
}

module.exports = {login,signup,resetPassword};