const mongoose = require('mongoose')
const clubSchema  = new mongoose.Schema(
    {
        name:{
        type:'String',
        required:true,
        },
    
    description:{
        type:String,
        trim:true,
    },
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    members:[{
        type:mongoose.Schema.ObjectId,
        ref:'Users',
    }],
    media:{
        type:String,
        default:'',
    },
    expenses:[
        {
            description:String,
            amount:Number,
            date:{
                type:Date,
                default:Date.now
            },
            createdAt:{
                type:Date,
                default:Date.now,
            }
        }
    ]
}
);
module.exports = mongoose.model('Club',clubSchema);