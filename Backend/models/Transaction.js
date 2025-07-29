const mongoose=  require("mongoose")
const transactionSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    reciever:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    amount:{
        type:Number,
        required:true,
        min:0,
    },
    description:{
        type:String,
        trim:true,
    },
    status:{
        type:String,
        enum:[
            'Pending',
            'Completed',
            'Failed'
        ],
        default:'Pending',
    },
    
});
module.exports = mongoose.model('Transaction', transactionSchema);