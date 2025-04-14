const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user.model");
const ObjectModel = require("../../models/object.model");
const Discipline = require("../../models/discipline.model");
const Comment = require("../../models/comment.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const createUser = async (overrides = {}) => {
  const defaultData = {
    firstName: "Dash",
    lastName: "Test",
    username: `dashtest${Date.now()}${Math.random()}`,
    email: `dashtest${Date.now()}${Math.random()}@example.com`,
    password: "password123",
    isVerified: true,
    role: "user",
    favorites: [],
    createdAt: new Date(),
  };
  const userData = { ...defaultData, ...overrides };
  if (!userData.password.startsWith("$2b$")) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
  }
  return await User.findOneAndUpdate({ email: userData.email }, userData, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
};

const loginUser = async (email, password = "password123") => {
  const response = await request(app)
    .post("/api/v1/auth")
    .send({ email, password });
  if (response.statusCode !== 200 || !response.body.accessToken) {
    console.error(
      `Login failed in test for ${email}: ${JSON.stringify(response.body)}`
    );
    throw new Error(`Login failed for ${email}`);
  }
  return response.body.accessToken;
};

const createDiscipline = async (overrides = {}) => {
  const validNames = ["Libros", "Canciones", "Videojuegos"];
  const name =
    overrides.name && validNames.includes(overrides.name)
      ? overrides.name
      : validNames[Math.floor(Math.random() * validNames.length)];
  const disciplineData = { name, description: "Test Desc", ...overrides };
  return await Discipline.findOneAndUpdate(
    { name: disciplineData.name },
    disciplineData,
    { upsert: true, new: true }
  );
};

const createObject = async (userId, disciplineId, overrides = {}) => {
  const defaultData = {
    name: `Dash Obj ${Date.now()}`,
    description: "Test Desc",
    imageUrl: "/public/images/objects/test-image.jpg",
    discipline: disciplineId,
    createdBy: userId,
    createdAt: new Date(),
  };
  return await ObjectModel.create({ ...defaultData, ...overrides });
};

const createComment = async (userId, objectId, overrides = {}) => {
  const defaultData = {
    content: `Test Comment ${Date.now()}`,
    user: userId,
    object: objectId,
    createdAt: new Date(),
  };
  return await Comment.create({ ...defaultData, ...overrides });
};

describe("Pruebas del Dashboard de Administrador", () => {
  let adminToken, adminId;
  let userToken, userId;
  let disciplineLibros, disciplineCancio, discipineVideo;
  let obj1, obj2, obj3, obj4;
  beforeEach(async () => {
    await User.deleteMany({});
    await Discipline.deleteMany({});
    await ObjectModel.deleteMany({});
    await Comment.deleteMany({});
    const adminData = await createUser({
      role: "admin",
      email: "dashboardadmin@example.com",
      createdAt: new Date("2024-01-10"),
    });
    adminId = adminData._id.toString();
    adminToken = await loginUser("dashboardadmin@example.com");
    const userData = await createUser({
      role: "user",
      email: "dashboarduser@example.com",
      createdAt: new Date("2024-02-15"),
    });
    userId = userData._id.toString();
    userToken = await loginUser("dashboarduser@example.com");
    disciplineLibros = await createDiscipline({ name: "Libros" });
    disciplineCancio = await createDiscipline({ name: "Canciones" });
    disciplineVideo = await createDiscipline({ name: "Videojuegos" });
    obj1 = await createObject(userId, disciplineLibros._id, {
      name: "Libro Viejo",
      createdAt: new Date("2024-01-20"),
    });
    obj2 = await createObject(userId, disciplineCancio._id, {
      name: "Cancion Vieja",
      createdAt: new Date("2024-02-25"),
    });
    obj3 = await createObject(adminId, disciplineLibros._id, {
      name: "Libro Admin",
      createdAt: new Date("2024-03-01"),
    });
    obj4 = await createObject(userId, disciplineLibros._id, {
      name: "Libro Reciente",
      createdAt: new Date("2024-03-10"),
    });
    await createComment(userId, obj1._id, {
      createdAt: new Date("2024-01-25"),
    });
    await createComment(adminId, obj4._id, {
      createdAt: new Date("2024-03-11"),
    });
    expect(adminToken).toBeDefined();
    expect(userToken).toBeDefined();
  });

  const testAdminAccess = (method, endpoint) => {
    it(`(${method.toUpperCase()} ${endpoint}) debería devolver 401 si el usuario no es admin`, async () => {
      const response = await request(app)
        [method](endpoint)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toContain("Access denied");
    });
    it(`(${method.toUpperCase()} ${endpoint}) debería devolver 401 si no está autenticado`, async () => {
      const response = await request(app)[method](endpoint);
      expect(response.statusCode).toBe(401);
    });
  };

  describe("GET /api/v1/dashboard/overview", () => {
    const endpoint = "/api/v1/dashboard/overview";
    testAdminAccess("get", endpoint);
    it("debería obtener estadísticas generales para el admin", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("totalUsers");
      expect(response.body).toHaveProperty("totalObjects");
      expect(response.body).toHaveProperty("totalComments");
      expect(response.body).toHaveProperty("objectsByDiscipline");
      expect(response.body).toHaveProperty("recentObjects");
      expect(response.body).toHaveProperty("objectsGrowth");
      expect(typeof response.body.totalUsers).toBe("number");
      expect(Array.isArray(response.body.objectsByDiscipline)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/users", () => {
    const endpoint = "/api/v1/dashboard/users";
    testAdminAccess("get", endpoint);
    it("debería obtener estadísticas de usuarios para el admin", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("totalUsers");
      expect(response.body).toHaveProperty("usersByRole");
      expect(response.body).toHaveProperty("usersByObjectCount");
      expect(typeof response.body.totalUsers).toBe("number");
      expect(Array.isArray(response.body.usersByRole)).toBe(true);
      expect(Array.isArray(response.body.usersByObjectCount)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/content", () => {
    const endpoint = "/api/v1/dashboard/content";
    testAdminAccess("get", endpoint);
    it("debería obtener estadísticas de contenido para el admin", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("objectsByDiscipline");
      expect(response.body).toHaveProperty("mostCommentedObjects");
      expect(Array.isArray(response.body.objectsByDiscipline)).toBe(true);
      expect(Array.isArray(response.body.mostCommentedObjects)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/activity", () => {
    const endpoint = "/api/v1/dashboard/activity";
    testAdminAccess("get", endpoint);
    it("debería obtener estadísticas de actividad (weekly por defecto)", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("period", "weekly");
      expect(response.body).toHaveProperty("objectsActivity");
      expect(Array.isArray(response.body.objectsActivity)).toBe(true);
      if (response.body.objectsActivity.length > 0) {
        expect(response.body.objectsActivity[0]).toHaveProperty("period");
        expect(response.body.objectsActivity[0]).toHaveProperty("count");
      }
    });
    it("debería obtener estadísticas de actividad para el periodo 'monthly'", async () => {
      const response = await request(app)
        .get(`${endpoint}?period=monthly`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("period", "monthly");
      expect(Array.isArray(response.body.objectsActivity)).toBe(true);
    });
    it("debería obtener estadísticas de actividad para el periodo 'daily'", async () => {
      const response = await request(app)
        .get(`${endpoint}?period=daily`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("period", "daily");
      expect(Array.isArray(response.body.objectsActivity)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/growth", () => {
    const endpoint = "/api/v1/dashboard/growth";
    testAdminAccess("get", endpoint);
    it("debería obtener análisis de crecimiento (monthly por defecto)", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("period", "monthly");
      expect(response.body).toHaveProperty("metrics");
      expect(response.body.metrics).toHaveProperty("users");
      expect(response.body.metrics).toHaveProperty("objects");
      expect(response.body.metrics).toHaveProperty("comments");
      expect(response.body.metrics.users).toHaveProperty("current");
      expect(response.body.metrics.users).toHaveProperty("previous");
      expect(response.body.metrics.users).toHaveProperty("growth");
    });
    it("debería obtener análisis de crecimiento para el periodo 'weekly'", async () => {
      const response = await request(app)
        .get(`${endpoint}?period=weekly`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("period", "weekly");
      expect(response.body).toHaveProperty("metrics");
    });
    it("debería obtener análisis de crecimiento para el periodo 'quarterly'", async () => {
      const response = await request(app)
        .get(`${endpoint}?period=quarterly`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("period", "quarterly");
      expect(response.body).toHaveProperty("metrics");
    });
  });

  describe("GET /api/v1/dashboard/all-objects", () => {
    const endpoint = "/api/v1/dashboard/all-objects";
    testAdminAccess("get", endpoint);
    it("debería obtener objetos paginados para el admin", async () => {
      const response = await request(app)
        .get(`${endpoint}?page=1&limit=2`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("objects");
      expect(Array.isArray(response.body.objects)).toBe(true);
      expect(response.body.objects.length).toBeLessThanOrEqual(2);
      expect(response.body).toHaveProperty("pagination");
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("filters");
      expect(Array.isArray(response.body.filters.disciplines)).toBe(true);
    });
    it("debería filtrar objetos por searchTerm", async () => {
      const response = await request(app)
        .get(`${endpoint}?searchTerm=Libro Reciente`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.objects.length).toBeGreaterThanOrEqual(1);
      expect(
        response.body.objects.some((obj) => obj.name === "Libro Reciente")
      ).toBe(true);
    });
    it("debería filtrar objetos por disciplineName", async () => {
      const response = await request(app)
        .get(`${endpoint}?disciplineName=Canciones`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      if (response.body.objects.length > 0) {
        expect(
          response.body.objects.every(
            (obj) => obj.discipline.name === "Canciones"
          )
        ).toBe(true);
      }
    });
    it("debería combinar filtros de searchTerm y disciplineName", async () => {
      const response = await request(app)
        .get(`${endpoint}?disciplineName=Libros&searchTerm=Admin`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
      if (response.body.objects.length > 0) {
        expect(response.body.objects[0].name).toContain("Admin");
        expect(response.body.objects[0].discipline.name).toBe("Libros");
      }
    });
  });
});
