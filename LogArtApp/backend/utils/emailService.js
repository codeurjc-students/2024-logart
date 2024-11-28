const nodemailer = require('nodemailer');

const sendVerificationEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your email',
    html: `<p>Click the link below to verify your email:</p><a href="${link}">${link}</a>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;