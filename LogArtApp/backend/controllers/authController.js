const authService = require("../services/authService");

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
