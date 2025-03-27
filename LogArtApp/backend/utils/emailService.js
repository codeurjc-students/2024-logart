const nodemailer = require("nodemailer");
const { email } = require("../config/environment");
const { password } = require("../config/environment");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
};

const sendVerificationEmail = async (to, link) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: email,
    to,
    subject: "Verifica tu correo en LogArt",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Verificación de Correo Electrónico</h1>
        <p style="color: #666; line-height: 1.5;">Gracias por registrarte en LogArt. Para activar tu cuenta, haz clic en el botón de abajo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verificar Correo</a>
        </div>
        <p style="color: #666; line-height: 1.5;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} LogArt. Todos los derechos reservados.</p>
        </div>
      </div>
    `,
  };
  return await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (to, link) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: email,
    to,
    subject: "Recupera tu contraseña en LogArt",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Recuperación de Contraseña</h1>
        <p style="color: #666; line-height: 1.5;">Has solicitado restablecer tu contraseña en LogArt. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Restablecer Contraseña</a>
        </div>
        <p style="color: #666; line-height: 1.5;">Este enlace expirará en 1 hora. Si no has solicitado restablecer tu contraseña, puedes ignorar este correo.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} LogArt. Todos los derechos reservados.</p>
        </div>
      </div>
    `,
  };
  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
