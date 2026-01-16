const mongoose = require ("mongoose");

const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique : true
    },
    email:{
        type:String,
        required:true,
        unique : true
    },
    password:{
        type:String,
        required:true,
        minlength: 6,
    },
    profilepic:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        required:true,
        enum : ["male" , "female"]
    },
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User