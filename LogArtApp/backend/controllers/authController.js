const authService = require("../services/authService");


/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Operaciones relacionadas con la autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
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
 *         description: Solicitud incorrecta
 *       401:
 *         description: Credenciales inválidas
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
 * /auth/register:
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
 *         description: Solicitud incorrecta
 *       409:
 *         description: El usuario ya existe
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

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verificar la cuenta de un usuario
 *     tags: [Autenticación]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de verificación enviado por correo electrónico
 *     responses:
 *       200:
 *         description: Usuario verificado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyUserResponse'
 *       400:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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
 * /auth/logout:
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
 *         description: Token de autenticación inválido o ausente
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

module.exports = {
  login,
  register,
  verifyUser,
  logout,
};
