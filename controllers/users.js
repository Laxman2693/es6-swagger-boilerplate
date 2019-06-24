
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as otpGenerator from 'otp-generator';
import { User } from '../models';
import { save, promise } from '../services/common.services';
import { default as commonCtrl } from './common';
import * as conf from '../config.json';

const environment = process.env.NODE_ENV || 'development';
const config = conf[environment];

// function jwtsign(val) {
//   return jwt.sign(val, 'shhhhh');
// }

const secret = 'es6swaggerboilerplate';
/**
* @typedef UserRegister
* @property {string} name.required - username - eg: Test entry
* @property {string} email.required - email - eg: test@gmail.com
* @property {string} password.required - password - eg: [1,2]
* @property {string} dob.required - dob - eg: 1998-12-31
*/

/**
* Request for registering a user
* @group Users
* @route POST /register
* @param {UserRegister.model} user.body
*/
const register = async (req, res) => {
  try {
    const pass = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
    const checkQuery = User.findOne({ email: req.body.email }, { email: true });
    const check = await promise(checkQuery);
    if (check) {
      res.status(302).jsonp({ msg: 'User already exists' });
    } else {
      // create tron account
        const userObj = new User({
          name: req.body.name,
          email: req.body.email.toLowerCase(),
          password: pass,
          dob: new Date(req.body.dob)
        });
        const data = await save(userObj);
        if (data) {
          const { email, role, _id, name } = data;
          requestVerificationInternal(data._id);
          res.status(200).jsonp({ msg: 'Please check you email to verify your account.', data: { email, role, _id, name, privateKey, publicKey, address } });
        }
    }
  } catch (err) {
    res.status(401).jsonp({ err });
  }
};

/**
 * @typedef UserLogin
 * @property {string} email.required - email - eg: test@gmail.com
 * @property {string} password.required - password - eg: [1,2]
 */
/**
 * Request for registering a user
 * @group Users
 * @route POST /login
 * @param {UserLogin.model} user.body
 * @security JWT
 */
const login = async (req, res) => {
  try {
    const pass = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
    const query = User.findOne({ email: req.body.email }, { email: 1, name: 1, password: 1,email_verified:1 });
    const userFound = await promise(query);
    if (!userFound) {
      res.status(404).jsonp({ msg: 'User not found' });
    } else if (userFound.email_verified) {
      if (userFound.password === pass) {
        const options = {
          audience: 'NoDeGeNeRaToR',
          expiresIn: '10h',
        };
        const { email, role, _id, name } = userFound;
        try {
          const jwtToken = jwt.sign({ email, role, _id } , 'shhhhh', options);
          res.status(200).jsonp({ msg: 'success', data: { token: jwtToken, _id } });
        } catch (err) {
          res.status(404).jsonp({ err });
        }
      } else {
        res.status(404).jsonp({ msg: 'Email/Password is incorrect!' });
      }
    } else {
      res.status(404).jsonp({ msg: 'Please verify you Email!' });
    }
  } catch (err) {
    res.status(404).jsonp({ msg: err });
  }
};

const check = (req, res) => {
  try {
    console.log(req.user);

  } catch (e) {
    
    console.log(e);
  }
};

/**
 * @route GET /requestVerification
 * @group Users
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
const requestVerification = async (req, res) => {
  try {
    const subject = 'Email Verification OTP';
    const user = await User.findOne({ _id : req.user._id }, { email: 1, otp: 1, email_verified: 1 });
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    if (user) {
      if (!user.email_verified) {
        user.otp = otp;
        const userObj = await user.save();
        if (userObj) {
          const body = `<a href=${config.baseURL}/verifyEmail/${user._id}/${user.otp}> verify </a>`;
          commonCtrl.sendEmail(user.email, subject, body, (err, result) => {
            if (err) {
              res.status(404).jsonp({ msg: 'User not found', data: null });
            } else {
              res.status(200).jsonp({ msg: result, data: null });
            }
          });
        }
      } else {
        res.status(200).jsonp({ msg: 'Already verified' });
      }
    } else {
      res.status(404).jsonp({ msg: 'User not found', data: null });
    }
  }catch(e){
    res.status(404).jsonp({ msg: e, data: null });
  }
  
};

const requestVerificationInternal = async (userId) => {
  try {
    const subject = 'Email Verification OTP';
    const user = await User.findOne({ _id : userId }, { email: 1, otp: 1, email_verified: 1 });
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    if (user) {
      if (!user.email_verified) {
        user.otp = otp;
        const userObj = await user.save();
        if (userObj) {
          const body = `<a href=${config.baseURL}/verifyEmail/${user._id}/${user.otp}> verify </a>`;
          commonCtrl.sendEmail(user.email, subject, body, (err, result) => {
            if (err) {
              // res.status(404).jsonp({ msg: 'User not found', data: null });
            } else {
              console.log('success');
              // res.status(200).jsonp({ msg: result, data: null });
            }
          });
        }
      } else {
        console.log('already verified');
        // res.status(200).jsonp({ msg: 'Already verified' });
      }
    } else {
      console.log('user not found');
      // res.status(404).jsonp({ msg: 'User not found', data: null });
    }
  } catch (e) {
    console.log(e);
  }
};

const verifyEmail = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }, { email: 1, otp: 1, email_verified: 1 });
  if (user) {
    if (!user.email_verified) {
      if (user.otp === req.params.otp) {
        user.email_verified = true;
        user.otp = null;
        const userObj = await user.save();
        if (userObj) {
          res.status(200).jsonp({ msg: 'Verified' });
        }
      }
    } else {
      res.status(200).jsonp({ msg: 'Already verified' });
    }
  }
};

/**
 * @route GET /resetPasswordOTP
 * @group Users
 * @produces application/json
 * @consumes application/json
 * @security JWT
 */
const resetPasswordOTP = async (req, res) => {
  try {
    const subject = 'Password change OTP';
    const { user } = req;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    if (user) {
      if (user.email_verified) {
        user.otp = otp;
        const userObj = await user.save();
        if (userObj) {
          const body = `<p>OTP for password verification is ${userObj.otp}</p>`;
          commonCtrl.sendEmail(user.email, subject, body, (err, result) => {
            if (err) {
              res.status(404).jsonp({ msg: 'User not found', data: null });
            } else {
              res.status(200).jsonp({ msg: result, data: null });
            }
          });
        }
      } else {
        res.status(200).jsonp({ msg: 'Your email is not verified' });
      }
    } else {
      res.status(404).jsonp({ msg: 'User not found', data: null });
    }
  } catch (e) {
    res.status(404).jsonp({ msg: e, data: null });
  }
};

/**
 * @typedef resetPassword
 * @property {string} otp.required - otp - eg: string
 * @property {string} password.required - password - eg: [1,2]
 * @property {string} oldPassword.required - password - eg: [1,2]
 */
/**
 * Request for resetting password
 * @group Users
 * @route POST /resetPassword
 * @param {resetPassword.model} user.body
 * @security JWT
 */
const resetPassword = async (req, res) => {
  try {
    if (req.body.password && req.body.oldPassword) {
      const pass = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
      const oldPass = crypto.createHmac('sha256', secret).update(req.body.oldPassword).digest('hex');
      let user = await User.findOne({ _id: req.user._id });
      if (user) {
        if (user.password === oldPass) {
          if (user.password === pass) {
            res.status(404).jsonp({ msg: 'Current Password and New Password cannot be same, please choose a different one!' });
          } else if (user.otp == req.body.otp) {
              user.password = pass;
              user.otp = null;
              const userobj = await user.save();
              if (userobj) {
                res.status(200).jsonp({ msg: 'Password updated successfully' });
              }
            } else {
              res.status(200).jsonp({ msg: 'Wrong OTP' });
            }
        } else {
          res.status(404).jsonp({ msg: "Current Password doesn't match!" });
        }
      } else {
        res.status(404).jsonp({ msg: 'User not found' });
      }
    } else {
      res.status(404).jsonp({ msg: 'New Password and Current Password are required!' });
    }
  } catch (e) {
    res.status(404).jsonp({ msg: e });
  }
};

/**
 * @typedef forgotPasswordOTP
 * @property {string} email.required - email - eg: string
 */

/**
 * @route POST /forgotPasswordOTP
 * @group Users
 * @param {forgotPasswordOTP.model} user.body
 * @produces application/json
 * @consumes application/json
 */

const forgotPasswordOTP = async (req, res) => {
  const subject = 'Forgot password OTP';
  const user = await User.findOne({ email: req.body.email }, { email: 1, otp: 1, email_verified: 1 });
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  if (user) {
    if (user.email_verified) {
      user.otp = otp;
      const userObj = await user.save();
      if (userObj) {
        const body = `<p>OTP for forgotpassword : ${userObj.otp}</p>`;
        commonCtrl.sendEmail(user.email, subject, body, (err, result) => {
          if (err) {
            res.status(404).jsonp({ msg: 'User not found', data: null });
          } else {
            res.status(200).jsonp({ msg: result, data: null });
          }
        });
      }
    } else {
      res.status(200).jsonp({ msg: 'Email not verified' });
    }
  } else {
    res.status(404).jsonp({ msg: 'User not found', data: null });
  }
};


/**
 * @typedef changePassword
 * @property {string} otp.required - otp - eg: string
 * @property {string} email.required - email - eg: string
 * @property {string} password.required - password - eg: [1,2]
 * @property {string} confirmPassword.required - password - eg: [1,2]
 */
/**
 * Request for registering a user
 * @group Users
 * @route POST /forgotPassword
 * @param {changePassword.model} user.body
 */
const changePassword = async (req, res) => {
  try {
    if (req.body.password && req.body.confirmPassword) {
      const pass = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');
      const confirmPassword = crypto.createHmac('sha256', secret).update(req.body.confirmPassword).digest('hex');
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        if (confirmPassword === pass) {
          if (user.password === pass) {
            res.status(404).jsonp({ msg: 'Current Password and New Password cannot be same, please choose a different one!' });
          } else if (user.otp == req.body.otp) {
              user.password = pass;
              user.otp = null;
              const userobj = await user.save();
              if (userobj) {
                res.status(200).jsonp({ msg: 'Password updated successfully' });
              }
            } else {
              res.status(200).jsonp({ msg: 'Wrong OTP' });
            }
        } else {
          res.status(404).jsonp({ msg: 'Password and confirm password are not matched!' });
        }
      } else {
        res.status(404).jsonp({ msg: 'User not found' });
      }
    } else {
      res.status(404).jsonp({ msg: 'New Password and Current Password are required!' });
    }
  } catch (e) {
    res.status(404).jsonp({ msg: e });
  }
};
const user = {
  register,
  login,
  check,
  requestVerification,
  verifyEmail,
  resetPasswordOTP,
  resetPassword,
  forgotPasswordOTP,
  changePassword
};

export default user;
