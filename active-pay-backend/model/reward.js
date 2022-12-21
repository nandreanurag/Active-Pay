
//rewards will have a couponId, what company name is that reward and how many cions will be required to purchase it.

const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new Schema({
    couponId: {
        type: String,
        required : true
    },
    companyName: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    imageUrl: {
        type: String,
        required : true
    },
    promocode: {
        type: String,
        required : true
    },
    coinsNeeded: {
        type: String,
        required : true
    }
},{timestamps:true}
)
module.exports = mongoose.model('Reward', rewardSchema);
