
// This is middleware which will verify the data coming in the form body


const verifySchema = (req, res, next, schema) => {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
    };
    const { error, value } = schema.validate(req.body, options);
    if(error) {
        res.statusCode = 422;
        next(`Validation Error: ${error.details.map(x => x.message).join(', ')}`);
    }
    else {
        req.body = value;
        next();
    }
}
module.exports = verifySchema;
