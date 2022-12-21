
//transaction schema stores transaction details like the card used, amount involved, vendor involved and datetime.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({

    // transcation_id:{
    //     type: Schema.Types.ObjectId,
    //     default:new mongoose.Types.ObjectId().toHexString()
    // },
    amount: {
        type: Schema.Types.Decimal128,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    credDeb: {
        type: Boolean,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    transactionDateTime: {
        type: Date,
        required:true
    },
    userAssociated: {
        type: String,
        required:true
    }
},{timestamps:true})
module.exports = mongoose.model('Transcation', transactionSchema);
