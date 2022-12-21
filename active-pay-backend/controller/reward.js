
//controller for managing the reward coins earned by the user for each transaction

const rewardService = require('../services/reward.js');

module.exports = {
    getCoinsCount: async(req, res, next) => {   //retrieve coins earned by the user
        rewardService.getCoinsCount(req, res, next)
            .catch(next);
    },
    addRewards: async(req, res, next) => {    //add the rewards to user profile
        rewardService.addRewards(req, res, next)
            .catch(next)
    },
    getAllRewards: async(req, res, next) => {   //retrieve the rewards user is eligible for.
        rewardService.getAllRewards(req, res, next)
            .catch(next)
    }
}
