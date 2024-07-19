// backend/utils/notificationService.js
const nodemailer = require('nodemailer');

const notifyUser = (email, items) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Upcoming Expiration Alerts',
    text: `The following items are nearing their expiration date: ${items.join(', ')}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
};

module.exports = notifyUser;
