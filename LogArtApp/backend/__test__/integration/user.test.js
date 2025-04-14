const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user.model");
const Discipline = require("../../models/discipline.model");
const ObjectModel = require("../../models/object.model");
const authService = require("../../services/authService");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs");

const createUser = async (overrides = {}) => {
  const defaultData = {
    firstName: "Test",
    lastName: "User",
    username: `testuser${Date.now()}${Math.random()}`,
    email: `testuser${Date.now()}${Math.random()}@example.com`,
    password: "password123",
    isVerified: true,
    role: "user",
    favorites: [],
  };
  const userData = { ...defaultData, ...overrides };
  if (!userData.password.startsWith("$2b$")) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
  }
  return await User.create(userData);
};

const loginUser = async (email, password = "password123") => {
  const result = await authService.login(email, password);
  if (!result || !result.accessToken) {
    throw new Error(`Login failed for ${email}`);
  }
  return result.accessToken;
};

const createDiscipline = async (overrides = {}) => {
  const defaultData = {
    name: "Libros",
    description: "Libros que has leído",
  };
  const disciplineData = { ...defaultData, ...overrides };
  const discipline = await Discipline.create(disciplineData);
  return discipline;
};

const createObject = async (userId, disciplineId, overrides = {}) => {
  const defaultData = {
    name: `Test Obj ${Date.now()}`,
    description: "Test Obj Desc",
    imageUrl: "/public/images/objects/test-image.jpg",
    discipline: disciplineId,
    createdBy: userId,
  };
  return await ObjectModel.create({ ...defaultData, ...overrides });
};

describe("Pruebas de Usuarios", () => {
  let userToken;
  let adminToken;
  let userId;
  let adminId;
  beforeAll(async () => {
    const user = await User.create({
      firstName: "Usuario",
      lastName: "Regular",
      username: "usuario",
      email: "usuario@example.com",
      password: await bcrypt.hash("password123", 10),
      isVerified: true,
      role: "user",
    });
    userId = user._id.toString();
    const userLogin = await authService.login(
      "usuario@example.com",
      "password123"
    );
    userToken = userLogin.accessToken;
    const admin = await User.create({
      firstName: "Administrador",
      lastName: "Principal",
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("adminpass123", 10),
      isVerified: true,
      role: "admin",
    });
    adminId = admin._id.toString();
    const { accessToken } = await authService.login(
      "admin@example.com",
      "adminpass123"
    );
    adminToken = accessToken;
  });

  describe("GET /api/v1/users/", () => {
    it("debería obtener todos los usuarios con paginación", async () => {
      for (let i = 1; i <= 10; i++) {
        await User.create({
          firstName: `User${i}`,
          lastName: `Test${i}`,
          username: `user${i}`,
          email: `user${i}@example.com`,
          password: await bcrypt.hash("password123", 10),
          isVerified: true,
          role: "user",
        });
      }
      const response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ page: 2, limit: 5 });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("users");
      expect(response.body.users.length).toBe(5);
      expect(response.body).toHaveProperty("totalUsers", 12);
      expect(response.body).toHaveProperty("currentPage", 2);
      expect(response.body).toHaveProperty("totalPages", 3);
    });

    it("debería retornar 401 si no está autenticado", async () => {
      const response = await request(app).get("/api/v1/users");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Necesitas estar logueado y un token válido para realizar esta acción"
      );
    });
  });

  describe("GET /api/v1/users/profile", () => {
    it("debería obtener el perfil del usuario autenticado", async () => {
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .get("/api/v1/users/profile")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("pepe3@gmail.com");
    });

    it("debería retornar 401 si no está autenticado", async () => {
      const response = await request(app).get("/api/v1/users/profile");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Necesitas estar logueado y un token válido para realizar esta acción"
      );
    });
  });

  describe("PUT /api/v1/users/profile", () => {
    it("debería actualizar el perfil del usuario autenticado sin imagen", async () => {
      const updateData = {
        firstName: "UsuarioActualizado",
        bio: "Esta es mi nueva bio.",
      };
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken, user } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .put("/api/v1/users/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateData);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.firstName).toBe("UsuarioActualizado");
      expect(response.body.user.bio).toBe("Esta es mi nueva bio.");
      expect(response.body).toHaveProperty(
        "message",
        "User updated successfully"
      );
    });

    it("debería actualizar el perfil del usuario autenticado con imagen", async () => {
      const updateData = {
        firstName: "UsuarioConImagen",
      };
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const imagePath = path.join(__dirname, "imagesTest", "test-image.jpg");
      if (!fs.existsSync(imagePath)) {
        throw new Error(
          `El archivo de imagen no existe en la ruta: ${imagePath}`
        );
      }
      const response = await request(app)
        .put("/api/v1/users/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .field("firstName", "UsuarioConImagen")
        .attach(
          "profileImage",
          path.join(__dirname, "imagesTest", "test-image.jpg")
        );
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.firstName).toBe("UsuarioConImagen");
      expect(response.body.user.profileImage).toMatch(
        /\/public\/images\/profiles\/\d+\.jpg$/
      );
      expect(response.body).toHaveProperty(
        "message",
        "User updated successfully"
      );
    });

    it("debería retornar 401 si no está autenticado", async () => {
      const updateData = {
        firstName: "SinAutenticacion",
      };
      const response = await request(app)
        .put("/api/v1/users/profile")
        .send(updateData);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Necesitas estar logueado y un token válido para realizar esta acción"
      );
    });
  });

  describe("GET /api/v1/users/:userId", () => {
    let targetUserId;
    beforeEach(async () => {
      const targetUser = await User.create({
        firstName: "Target",
        lastName: "User",
        username: "targetuser",
        email: "target@example.com",
        password: await bcrypt.hash("password123", 10),
        isVerified: true,
        role: "user",
      });
      targetUserId = targetUser._id.toString();
    });

    it("debería obtener un usuario por su ID como el mismo usuario", async () => {
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "user",
      });
      const { accessToken, user } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const userIddb = user._id.toString();
      const response = await request(app)
        .get(`/api/v1/users/${userIddb}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("pepe3@gmail.com");
      expect(response.body).toHaveProperty("message", "User found");
    });

    it("debería obtener un usuario por su ID como admin", async () => {
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .get(`/api/v1/users/${targetUserId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("target@example.com");
      expect(response.body).toHaveProperty("message", "User found");
    });

    it("debería retornar 401 si un usuario no admin intenta obtener otro usuario", async () => {
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "user",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .get(`/api/v1/users/${targetUserId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });

    it("debería retornar 404 si el usuario no existe", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/users/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "User not found");
    });

    it("debería retornar 400 si el formato del ID es inválido", async () => {
      const invalidId = "12345";
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .get(`/api/v1/users/${invalidId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Invalid user ID format");
    });
  });

  describe("DELETE /api/v1/users/:userId", () => {
    let targetUserId;
    let accessTokenAdmin;
    let hashedPassword;
    beforeEach(async () => {
      const targetUser = await User.create({
        firstName: "Delete",
        lastName: "Me",
        username: "deleteme",
        email: "deleteme@example.com",
        password: await bcrypt.hash("password123", 10),
        isVerified: true,
        role: "user",
      });
      targetUserId = targetUser._id.toString();
    });

    it("debería eliminar un usuario como admin", async () => {
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .delete(`/api/v1/users/${targetUserId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User and Data deleted successfully"
      );
      const userInDb = await User.findById(targetUserId);
      expect(userInDb).toBeNull();
    });

    it("debería retornar 401 si un usuario no admin intenta eliminar otro usuario", async () => {
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "user",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .delete(`/api/v1/users/${targetUserId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Access denied");
    });

    it("debería retornar 401 si un admin intenta eliminar su propia cuenta", async () => {
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken, user } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const Id = user._id.toString();
      const response = await request(app)
        .delete(`/api/v1/users/${Id}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "You cannot delete your own account, contact the system administrator"
      );
    });

    it("debería retornar 404 si el usuario a eliminar no existe", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .delete(`/api/v1/users/${nonExistentId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "User not found");
    });

    it("debería retornar 400 si el formato del ID es inválido", async () => {
      const invalidId = "abcde";
      const hashedPassword = await bcrypt.hash("hola123", 10);
      const userDB = await User.create({
        username: "pepeuser",
        email: "pepe3@gmail.com",
        firstName: "Pepe",
        lastName: "García",
        password: hashedPassword,
        isVerified: true,
        hastoken: false,
        role: "admin",
      });
      const { accessToken } = await authService.login(
        "pepe3@gmail.com",
        "hola123"
      );
      const response = await request(app)
        .delete(`/api/v1/users/${invalidId}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Invalid user ID format");
    });
  });

  describe("GET /api/v1/users/favorites (getUserFavorites)", () => {
    let userToken, userId;
    let favObject1, favObject2, nonFavObject;
    beforeEach(async () => {
      const user = await createUser({ email: "favusertest@example.com" });
      userId = user._id.toString();
      userToken = await loginUser("favusertest@example.com");
      const discipline = await createDiscipline({
        name: "Libros",
        description: "Libros que has leído",
      });
      favObject1 = await createObject(userId, discipline._id, {
        name: "User Fav Obj 1",
      });
      favObject2 = await createObject(userId, discipline._id, {
        name: "User Fav Obj 2",
      });
      nonFavObject = await createObject(userId, discipline._id, {
        name: "User Non Fav Obj",
      });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favorites: [favObject1._id, favObject2._id] },
      });
    });

    it("debería obtener la lista de IDs de objetos favoritos del usuario", async () => {
      const response = await request(app)
        .get("/api/v1/users/favorites")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("favorites");
      expect(Array.isArray(response.body.favorites)).toBe(true);
      expect(response.body.favorites).toHaveLength(2);
      expect(response.body.favorites).toContain(favObject1._id.toString());
      expect(response.body.favorites).toContain(favObject2._id.toString());
      expect(response.body.favorites).not.toContain(
        nonFavObject._id.toString()
      );
    });

    it("debería devolver un array vacío si el usuario no tiene favoritos", async () => {
      const noFavUser = await createUser({ email: "nofavuser@example.com" });
      const noFavToken = await loginUser("nofavuser@example.com");
      const response = await request(app)
        .get("/api/v1/users/favorites")
        .set("Authorization", `Bearer ${noFavToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("favorites");
      expect(Array.isArray(response.body.favorites)).toBe(true);
      expect(response.body.favorites).toHaveLength(0);
    });

    it("debería devolver 401 si no está autenticado", async () => {
      const response = await request(app).get("/api/v1/users/favorites");
      expect(response.statusCode).toBe(401);
    });

    it("debería manejar el caso donde el campo favorites no existe en el documento (y crearlo)", async () => {
      const edgeUser = await createUser({ email: "edgefav@example.com" });
      await User.findByIdAndUpdate(edgeUser._id, { $unset: { favorites: "" } });
      const edgeToken = await loginUser("edgefav@example.com");

      const response = await request(app)
        .get("/api/v1/users/favorites")
        .set("Authorization", `Bearer ${edgeToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("favorites", []);

      const userDb = await User.findById(edgeUser._id);
      expect(userDb.favorites).toBeDefined();
      expect(Array.isArray(userDb.favorites)).toBe(true);
      expect(userDb.favorites).toHaveLength(0);
    });
  });
});
