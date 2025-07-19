const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:["attendee","organizer","exhibitor"],
        default: 'attendee',
        required: true
    }
})

const userModel = mongoose.model("user",userSchema)
module.exports = userModel