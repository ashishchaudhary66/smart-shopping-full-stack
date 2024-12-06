const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String
    },
    role:{
        type:String,
        enum:["Admin","User","Visitor"],
        default:'User'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("User",userSchema);