const verifySchema = require('../middleware/verifySchema.js');
const Joi = require('joi');
const billSchema = (req, res, next) => {
    const schema = Joi.object({
        amount: Joi.number().precision(2).required(),
    })
    verifySchema(req, res, next, schema);
}

module.exports = billSchema;