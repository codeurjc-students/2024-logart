const authService = require("../services/authService");

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Operaciones relacionadas con la autenticación de usuarios
 */

/**
 * @swagger
 * /auth/:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Error, ambos campos son obligatorios
 *       401:
 *         description: Errores de autenticación, Credenciales inválidas/usuario no encontrado/token inválido, cuenta sin verificación.
 *       500:
 *         description: Error interno del servidor
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, user } = await authService.login(email, password);
    return res
      .status(200)
      .json({ accessToken, user, message: "Login successful" });
  } catch (error) {
    console.error("Error en login:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         headers:
 *           Location:
 *             description: URL del nuevo usuario
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Error, todos los campos son obligatorios
 *       401:
 *         description: Errores de autenticación, usuario ya logueado
 *       409:
 *         description: Error, el usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
const register = async (req, res) => {
  try {
    const registrationData = req.body;
    const { user, message } = await authService.register(registrationData);
    return res
      .status(201)
      .location(`/api/v1/users/${user._id}`)
      .json({ user, message });
  } catch (error) {
    console.error("Error en register:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await authService.verifyUser(token);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en verifyUser:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cerrar sesión de un usuario
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       401:
 *         description: Errores de autenticación, token vacio, token en la lista negra
 *       403:
 *         description: Error, token inválido
 *       500:
 *         description: Error interno del servidor
 */
const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const userId = req.user.userId;
    const result = await authService.logout(token, userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en logout:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo del usuario para el restablecimiento de contraseña
 *     responses:
 *       200:
 *         description: Se ha enviado el correo de restablecimiento de contraseña
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Error en los datos enviados
 *       500:
 *         description: Error interno del servidor
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Error interno del servidor" });
  }
};

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Restablecer la contraseña del usuario
 *     tags: [Autenticación]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token recibido para el restablecimiento de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Datos inválidos o token caducado
 *       500:
 *         description: Error interno del servidor
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authService.resetPassword(token, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en resetPassword:", error);
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ error: true, message: error.message });
    }
    return res
      .status(500)
      .json({ error: true, message: "Error interno del servidor" });
  }
};

module.exports = {
  login,
  register,
  verifyUser,
  logout,
  forgotPassword,
  resetPassword,
};
