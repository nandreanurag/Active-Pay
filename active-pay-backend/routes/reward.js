const express = require('express');
const router = express.Router();
const rewardController = require('../controller/reward.js');
const verifyToken = require('../middleware/verifyToken.js');
const rewardSchema = require('../schema/rewardSchema.js');

// router.post('/',verifyToken, cardController.addCard);
router.post('/', verifyToken, rewardController.addRewards);
router.get('/', verifyToken, rewardController.getAllRewards);
router.get('/coins', verifyToken, rewardController.getCoinsCount);


module.exports = router;