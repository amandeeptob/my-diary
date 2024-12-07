const jwt = require('jsonwebtoken')
const diaryModel = require('../model/diary.model')
const userModel = require('../model/user.model')
const auth = require('./auth.controller')

const save = async (req,res)=>{
    const token=req.cookies?.token
    await jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if (err) {
            // return res.status(403).json({ error: 'Invalid user',isAuthenticated: false });
            return res.status(403).json({'msg':'session expired...'})
        }else{
            user = decodedToken
            req.body.user=user
            try {
                const user = await userModel.findOne({'email':req.body.user.email})
                const mydate=new Date(req.body.date)
                mydate.setHours(mydate.getHours()+8)
                const updatedContent = await diaryModel.findOneAndUpdate(
                  { 'user':user._id,'date':mydate.toISOString().substring(0,10)},
                  { 'data': req.body.content },
                  { 
                    new: true,
                    upsert: true,
                  }
                );
                return res.status(200).json({'msg':'saved successfully'})
            } catch (error) {
                console.error('Error while updating or creating log:', error);
                return res.status(403).json({'msg':'unable to save...'})
            }
        }
    })
}

const send = async (req,res)=>{
    const token=req.cookies?.token
    await jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if(err){
            console.log('unable to verify')
            return res.status(403).json({'msg':'session expired...'})
        }else{
            user = decodedToken
            req.body.user=user
            
            queryDate=new Date(req.body.date)
            queryDate.setHours(0)
            queryDate.setDate(queryDate.getDate()+1)
            queryDate=queryDate.toISOString().substring(0,10)
            try {
                const user = await userModel.findOne({'email':req.body.user.email})
                const data = await diaryModel.findOne(
                  { 'user':user._id,date: {
                    $regex: `^${queryDate}`,  // Match documents where the date starts with '2024-11-11'
                    $options: 'i'  // Optional: case-insensitive matching   
                  }}
                );
                if(!data)
                    return res.status(200).json({'msg':'-1'})
                else return res.status(200).json({'msg':'fetched successfully','content':data.data})
            } catch (error) {
                console.error('Error while updating or creating log:', error);
                return res.status(403).json({'msg':'unable to save...'})
            }
        }
    })
}

const entry = async (req,res)=>{
    const token=req.cookies?.token
    await jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if(err){
            return res.status(403).redirect('/')
        }else{
            user = decodedToken
            req.body.user=user
            let queryDate=new Date(req.body.date)
            queryDate=queryDate.toISOString().substring(0,7)

            try {
                const user = await userModel.findOne({'email':req.body.user.email})
                const data = await diaryModel.find(
                    { 'user':user._id,date: {
                      $regex: `^${queryDate}`,  // Match documents where the date starts with '2024-11-11'
                      $options: 'i'  // Optional: case-insensitive matching   
                    }}
                  );
                if(!data)
                    return res.status(200).json({'msg':'-1'})
                else {
                    let dates=[]
                    data.forEach(element => {
                        dates.push(new Date(element.date).getDate())
                    });
                    return res.status(200).json({'msg':'fetched successfully','dates':dates})
                }
                // else return res.status(200).json({'msg':'fetched successfully','content':data.data})
            } catch (error) {
                console.error('Error while updating or creating log:', error);
                return res.status(403).json({'msg':'unable to save...'})
            }
        }
    })
}

module.exports={send,save,entry}