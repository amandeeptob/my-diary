const mongoose = require("mongoose")

const diarySchema = mongoose.Schema({
    data:{
        type:String,
        required:true,
        trim: true,
    },
    date:{
        type: String,
        required:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    },
    {
        Timestamps:true
    }
)
module.exports = mongoose.model('Diary', diarySchema)