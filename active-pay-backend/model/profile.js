const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({

    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    reminders: {
        type: Boolean,
        required: true,
        default:true
    },
    phoneNumber: {
        type: String,
        deafult:"999999999"
    },
    //coins: will store all the coins earned by this user
    coins: {
        type: Number,
        required: true
    },
    //card: will store all the cards associated with this user, cards will be stored as array
    card:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Card'
    }],
    reward:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Reward'
    }]
})
module.exports = mongoose.model('Profile', profileSchema);
