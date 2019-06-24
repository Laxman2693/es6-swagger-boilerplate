import jwt from 'jsonwebtoken';
import { User } from '../models';
import { userCtrl,
  tronCtrl, 
  deviceCtrl, 
  contentCtrl, 
  commonCtrl, 
  fitnessCtrl 
} from '../controllers';

const { Router } = require('express');

const checkAuthorization = (req, res, next) => {
  const header = req.get('Authorization');
  if (header) {
    const type = header.split(' ');
    if (type[0] === 'Bearer') {
      const usr = jwt.decode(type[1]);
      User.findOne({ _id: usr._id }, { password: 0 }).exec((err, user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).jsonp({ msg: 'User id is not valid!'});
        }
      });
    } else {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }
};

const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.json({
    title: 'Express'
  });
});

/** User routes */
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/check', checkAuthorization, userCtrl.check);
router.get('/requestVerification', checkAuthorization, userCtrl.requestVerification);
router.get('/verifyEmail/:id/:otp', userCtrl.verifyEmail);
router.get('/resetPasswordOTP', checkAuthorization, userCtrl.resetPasswordOTP);
router.post('/resetPassword', checkAuthorization, userCtrl.resetPassword);
router.post('/forgotPasswordOTP', userCtrl.forgotPasswordOTP);
router.post('/forgotPassword', userCtrl.changePassword);

/** Content API */
router.get('/content/all', contentCtrl.getAllContent);
router.get('/content/:id', contentCtrl.getContent);
router.post('/content/add', contentCtrl.addContent);
router.post('/content/:id', contentCtrl.updateContent);
router.delete('/content/:id', contentCtrl.removeContent);

/** common functionality like imageupload etc */
router.post('/fileUpload', commonCtrl.fileUpload);

module.exports = router;
