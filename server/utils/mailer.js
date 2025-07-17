const nodemailer = require('nodemailer');

// You can also use Gmail or Outlook SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // Your email
    pass: process.env.EMAIL_PASS      // App password
  }
});

const sendReminderEmail = (to, subject, text) => {
  const mailOptions = {
    from: `"EventCraft" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendReminderEmail;
