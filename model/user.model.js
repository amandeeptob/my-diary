const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required:true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"], // pass array with second one is error message
        minlength:6,
    },
    },{Timestamps:true}
)

module.exports = mongoose.model('User', userSchema);
// exports const User = mongoose.model('User',userSchema)