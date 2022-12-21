
//controller for managing the user authentication or user registration

const authService = require('../services/auth.js');

module.exports = {
    signup: (req, res, next) => {   //user registration
        authService.signup(req.body, res)
            .catch(next);
    },
    login: (req, res, next) => {    //user login
        authService.login(req.body, res)
            .catch(next);
    },
    getProfile: (req, res, next) => {   //user profile retrieval
        authService.getProfile(req,res)
            .catch(next);
    },
    editProfile: (req, res, next) => {    //user profile updation
        authService.editProfile(req, res)
            .catch(next);
    }
};
