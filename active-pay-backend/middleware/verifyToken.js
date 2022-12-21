
// middleware to authenticate the user, using the bearer token

const jwt = require('jsonwebtoken');
const User = require('../model/user.js');


// const secret = process.env.SECRET;
const secret = 'supersecretsuper'


const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        // console.log(authHeader)
        const token = authHeader.split(' ')[1];
        // console.log(token)
        let decodedToken;
        decodedToken = jwt.verify(token, 'supersecretsuper');
        if (!decodedToken) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        const user = await User.findById(decodedToken.sub);

        // console.log(user)
        req.user = user
        // console.log(user)
        next();
        // console.log(decodedToken)
    } catch (err) {
        // err.statusCode = 500;
        return res.status(401).json({ message: "Unauthorized" });
    }
    // req.userId = decodedToken.userId;

}


module.exports = verifyToken;
