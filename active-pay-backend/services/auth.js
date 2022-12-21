// const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.js')
const Profile = require('../model/profile.js')
// const encryptDecrypt = require('./encryptDecrypt');
const emailValidator = require('deep-email-validator');

//helper functions

const omitHash = (user) => {
    const { password, ...userwithouthash } = user;
    return userwithouthash;
};

const isValidEmail = async (email) => {
    console.log(email + "   " + emailValidator.validate(email))
    console.log(emailValidator.validate(email))
    return emailValidator.validate(email);
}

module.exports = {
      login: async (params, res) => {
        const { email, password } = params;
        // const {valid, reason, validators} = await isValidEmail(email);
        const valid=true //should revert changes
        if(valid) {
          const user = await User.findOne(
            { email:email },
          ).catch((err) => {
            res.statusCode = 500;
            throw new Error(err);
          })
          if (!user || !(await bcrypt.compare(password, user.password))) {
            res.statusCode = 401;
            throw new Error('Username or password is incorrect');
          }
          //authentication succesful
          const token = jwt.sign({ sub: user._id },'supersecretsuper' , {
            expiresIn: '7d',
          });
          res.status(200).json({ user,token});
        }
        else {
          res.statusCode = 400;
          throw new Error('Please provide a valid email address !');
        }
      },

    signup: async (params, res) => {
        // validate
        if (await User.findOne({ email: params.email })) {
            res.statusCode = 409;
            throw new Error(`email "${params.email}" is already registered!`);
        }
        console.log(params)
        // const { valid, reason, validators } = await isValidEmail(params.email);
        const valid=true
        console.log(valid)
        if (valid) {
            // hash password
            if (params.password) {
                params.password = await bcrypt.hash(params.password,10);
            }
            const user = new User({
                email: params.email, password: params.password
            })
            // save user
            await user.save()
                .catch((err) => {
                    res.statusCode = 500;
                    throw new Error(err);
                })
              const token = jwt.sign({ sub: user._id }, 'supersecretsuper', {
                expiresIn: '7d',
              });

            // make dummy profile
            const profile = new Profile({
                _id:user._id,
                name: '',
                email: params.email,
                UserId: user._id,
                coins: 0
            })
            await profile.save()
                .catch((err) => {
                    res.statusCode = 500;
                    throw new Error(err);
                })
            res.status(200).json({ user ,token});
        }
        else {
            res.statusCode = 400;
            throw new Error('Enter a valid email');
        }
    },
      getProfile: async (req, res) => {
        // getting profile using req.user.id
        try {
          const userId = req.user._id;
          const userProfile = await Profile.findOne({
              _id: userId,
            })
            res.status(200).json(userProfile);
        }
        catch (err) {
          res.statusCode = 500;
          throw new Error(err);
        };
      },
      editProfile: async (req, res) => {
        // getting profile using req.user.id

        // rightnow there is only name and authCode to be updated.

        // assuming email can'be changed
        console.log(req.body)
        try {
          const userId = req.user._id;
          const userProfile = await Profile.findOne({
            _id:userId
          })
          console.log(userProfile)
          //const duplicate = {...userProfile.dataValues};
          if (req.body.name !== null && req.body.name !== undefined) {
            userProfile.name = req.body.name;
          }

          // if (req.body.authCode !== null && req.body.authCode !== undefined) {
          //   duplicate.authCode = await encryptDecrypt.encrypt(req.body.authCode);
          // }


          if(req.body.phoneNumber !== null && req.body.phoneNumber !== undefined) {
            userProfile.phoneNumber = req.body.phoneNumber;
          }
          if(req.body.reminders !== null && req.body.reminders !== undefined) {
            userProfile.reminders = req.body.reminders;
          }
          await userProfile.save();
          res.status(200).send(userProfile);
        } catch (error) {
          res.statusCode = 500;
          throw new Error(error);
        }
      },
};
