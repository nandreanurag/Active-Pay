const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    cardNumber: {
        type: String,
        required: true
    },
    cardOwnerName: {
        type: String,
        required: true
    },
    outstandingAmount: {
        type: Number,
        default:0
    },
    expiryMonth: {
        type: Number,
        required: true
    },
    expiryYear: {
        type: Number,
        required: true
    },
    profile:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
        required:true
    }],
    transcation:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transcation',
        // required:true
    }],
    
},{timestamps:true}
)
module.exports = mongoose.model('Card', cardSchema);