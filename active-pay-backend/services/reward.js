const Card = require('../model/card.js')
var crypto = require('crypto');
const Profile = require('../model/profile.js')
const Reward = require('../model/reward.js')
const Transaction = require('../model/transaction.js');
const { json } = require('body-parser');
const cypherKey = "mySecretKey";

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex')
        .slice(0,len).toUpperCase();
}

module.exports = {
    getCoinsCount: async(req, res, next) => {
        // getProfileAssociated
        const userId = req.user._id;
        const profileAssociated = await Profile.findById({
                _id: userId
            //if profile is found ,get the coins associated to it
        })
        .catch((err) => {
            res.statusCode = 500;
            throw new Error(err);
        })
        console.log(profileAssociated)
        res.status(200).json({ coins: profileAssociated.coins.toString() });
    },

    addRewards: async(req, res) => {
        try {
            // getProfileAssociated
            const profileAssociated = await Profile.findById({
                    _id: req.user.id
            })

            const duplicate = {...profileAssociated};
            duplicate.coins = parseInt(profileAssociated.coins) - parseInt(req.body.coinsNeeded);
            // when user purchases a reward just generate a coupon code and share it to the user.
            const couponPromoCode = randomValueHex(4) + "-" + randomValueHex(4) + "-" + randomValueHex(4);

            const reward_created=await Reward.create({
                couponId: req.body.couponId,
                companyName: req.body.companyName,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                promocode: couponPromoCode,
                coinsNeeded: req.body.coinsNeeded,
                ProfileId: profileAssociated.id
            })
            // duplicate.reward=[...duplicate.reward,reward_created._id]
            await profileAssociated.update({
                _id: profileAssociated._id,
                reward:[...profileAssociated.reward,reward_created._id],
                coins:duplicate.coins

            });

            res.status(200).json({ msg: "Reward Added Successfully !"});
        } catch(error) {
            console.log(error)
            res.statusCode = 500;
            throw new Error(error);
        }
    },
    getAllRewards: async(req, res) => {
        try {
            // getProfileAssociated
            const profileAssociated = await Profile.findById({
                    _id: req.user.id
                
            });
            console.log(profileAssociated)
            // when user is eligible for rewards just show all the rewards user can purchase with the coins earned
            let allRewards=[]
            for(const rewardId of profileAssociated.reward){
                console.log(rewardId)
                const reward_item=await Reward.findById({
                    _id:rewardId.toString()
                })
                console.log(reward_item+"  80")
                allRewards.push(reward_item)
            }
            console.log(allRewards+"  89")
            res.status(200).send(allRewards);
        }
        catch(error) {
            console.log(error)
            res.statusCode = 500;
            throw new Error(error);
        }
    }
}
