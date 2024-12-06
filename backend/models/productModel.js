const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    rating:{
        type:{
            rate:Number,
            count:Number,
        },
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("Product",productSchema);