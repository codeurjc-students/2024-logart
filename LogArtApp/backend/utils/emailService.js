const nodemailer = require('nodemailer');
const { email } = require('../config/environment');
const { password } = require('../config/environment');

const sendVerificationEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: email,
    to,
    subject: 'Verify your LogArt email',
    html: `<p>Click the link below to verify your email:</p><a href="${link}">${link}</a>`,
  };
  
    const info = await transporter.sendMail(mailOptions);
    
};

module.exports = sendVerificationEmail;