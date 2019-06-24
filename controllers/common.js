import * as path from 'path';
import * as formidable from 'formidable';
// var formidable = require('formidable');
import * as nodemailer from 'nodemailer';
import * as moment from 'moment';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.ethereal.email',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


const fileUpload = async (req, res) => {
  let imgName;
  let form = new formidable.IncomingForm();
  form.parse(req);
  try {
    form.on('fileBegin', (name, file) => {
      // console.log("filename",file)
      if (file.type.split('/')[0] === 'image') {
        imgName = `img_${Date.now()}`;
        file.path = path.resolve(`${__dirname}/../public/images/${imgName}.${file.type.split('/')[file.type.split('/').length-1]}`);
        res.status(200).jsonp({ msg: 'Image uploaded successfully!', data: file.path });
      } else if (file.type.split('/')[0] === 'video') {
        imgName = `img_${Date.now()}`;
        // file.path = __dirname + '/../public/images/' + imgName;
        file.path = path.resolve(`${__dirname}/../public/video/${imgName}.${file.type.split('/')[file.type.split('/').length-1]}`);
        res.status(200).jsonp({ msg: 'Image uploaded successfully!', data: file.path });
      } else {
        res.status(404).jsonp({ msg: 'Only file type image/video is supported!' });
      }
    });
  } catch (err) {
    res.status(404).jsonp({ msg: err });
  }
};

const sendEmail = async (to, subject, body, cb ) => {
  const mailOptions = {
    from: process.env.SMTP_USER, // sender address
    to, // list of receivers
    subject, // Subject line
    html: body// plain text body
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'success');
    }
  });
};

const common = {
  fileUpload,
  sendEmail
};

export default common;
