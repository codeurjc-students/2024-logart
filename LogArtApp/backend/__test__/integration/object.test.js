const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user.model");
const Discipline = require("../../models/discipline.model");
const ObjectModel = require("../../models/object.model");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");

const createUser = async (overrides = {}) => {
  const defaultData = {
    firstName: "Usuario",
    lastName: "Prueba",
    username: `usuario${Date.now()}`,
    email: `usuario${Date.now()}@example.com`,
    password: "Password123",
    isVerified: true,
    hastoken: false,
    role: "user",
  };

  const userData = { ...defaultData, ...overrides };
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return user;
};

const loginUser = async (email, password) => {
  const response = await request(app)
    .post("/api/v1/auth/")
    .send({ email, password });

  return response.body.accessToken;
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

describe("Pruebas de Objetos", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Discipline.deleteMany({});
    await ObjectModel.deleteMany({});
  });

  describe("POST /api/v1/objects/", () => {
    it("debería crear un objeto exitosamente", async () => {
      const user = await createUser({
        email: "usuario@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Libros",
        description: "Libros que has leído",
      });

      const newObjectData = {
        name: "Objeto1",
        description: "Descripción del objeto 1",
        disciplineName: "Libros",
      };

      const response = await request(app)
        .post("/api/v1/objects/")
        .set("Authorization", `Bearer ${userToken}`)
        .field("name", newObjectData.name)
        .field("description", newObjectData.description)
        .field("disciplineName", newObjectData.disciplineName)
        .attach(
          "imageUrl",
          path.join(__dirname, "imagesTest", "test-image.jpg")
        );

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("object");
      expect(response.body.object.name).toBe(newObjectData.name);
      expect(response.body.object.description).toBe(newObjectData.description);
      expect(response.body.object).toHaveProperty("imageUrl");
      expect(response.headers).toHaveProperty("location");
    });

    it("debería fallar al crear un objeto sin imagen", async () => {
      const user = await createUser({
        email: "usuario2@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Canciones",
        description: "Canciones que has escuchado",
      });

      const newObjectData = {
        name: "Objeto2",
        description: "Descripción del objeto 2",
        disciplineName: "Canciones",
      };

      const response = await request(app)
        .post("/api/v1/objects/")
        .set("Authorization", `Bearer ${userToken}`)
        .send(newObjectData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Image is required");
    });

    it("debería fallar al crear un objeto con datos incompletos", async () => {
      const user = await createUser({
        email: "usuario3@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Videojuegos",
        description: "Videojuegos que has jugado",
      });

      const newObjectData = {
        name: "Objeto3",
        description: "Descripción del objeto 3",
      };

      const response = await request(app)
        .post("/api/v1/objects/")
        .set("Authorization", `Bearer ${userToken}`)
        .field("name", newObjectData.name)
        .field("description", newObjectData.description)
        .attach(
          "imageUrl",
          path.join(__dirname, "imagesTest", "test-image.jpg")
        );

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body.message).toBe(
        "Both name and discipline are required"
      );
    });

    it("debería fallar al crear un objeto con una disciplina inexistente", async () => {
      const user = await createUser({
        email: "usuario4@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const newObjectData = {
        name: "Objeto4",
        description: "Descripción del objeto 4",
        disciplineName: "Fotografía",
      };

      const response = await request(app)
        .post("/api/v1/objects/")
        .set("Authorization", `Bearer ${userToken}`)
        .field("name", newObjectData.name)
        .field("description", newObjectData.description)
        .field("disciplineName", newObjectData.disciplineName)
        .attach(
          "imageUrl",
          path.join(__dirname, "imagesTest", "test-image.jpg")
        );

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body.message).toBe("Discipline not found");
    });
  });

  describe("PUT /api/v1/objects/:objectId", () => {
    it("debería actualizar un objeto exitosamente sin imagen", async () => {
      const user = await createUser({
        email: "usuario6@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Canciones",
        description: "Canciones que has escuchado",
      });

      const object = await ObjectModel.create({
        name: "Objeto6",
        description: "Descripción del objeto 6",
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const updatedData = {
        name: "Objeto6 Actualizado",
        description: "Descripción actualizada del objeto 6",
        disciplineName: "Canciones",
      };

      const response = await request(app)
        .put(`/api/v1/objects/${object._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("object");
      expect(response.body.object.name).toBe(updatedData.name);
      expect(response.body.object.description).toBe(updatedData.description);
      expect(response.body.object.imageUrl).toBe(
        "/public/images/objects/test-image.jpg"
      );
      expect(response.body).toHaveProperty(
        "message",
        "Object updated successfully"
      );
    });

    it("debería actualizar un objeto exitosamente con imagen", async () => {
      const user = await createUser({
        email: "usuario7@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Videojuegos",
        description: "Videojuegos que has jugado",
      });

      const object = await ObjectModel.create({
        name: "Objeto7",
        description: "Descripción del objeto 7",
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const updatedData = {
        name: "Objeto7 Actualizado",
        description: "Descripción actualizada del objeto 7",
        disciplineName: "Videojuegos",
      };

      const response = await request(app)
        .put(`/api/v1/objects/${object._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .field("name", updatedData.name)
        .field("description", updatedData.description)
        .field("disciplineName", updatedData.disciplineName)
        .attach(
          "imageUrl",
          path.join(__dirname, "imagesTest", "test-image-2.jpg")
        );

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("object");
      expect(response.body.object.name).toBe(updatedData.name);
      expect(response.body.object.description).toBe(updatedData.description);
      expect(response.body.object.imageUrl).toMatch(
        /\/public\/images\/objects\/\d+\.jpg$/
      );
      expect(response.body).toHaveProperty(
        "message",
        "Object updated successfully"
      );
    });

    it("debería fallar al actualizar un objeto sin autenticación", async () => {
      const discipline = await createDiscipline({
        name: "Libros",
        description: "Libros que has leído",
      });

      const object = await ObjectModel.create({
        name: "Objeto8",
        description: "Descripción del objeto 8",
        discipline: discipline._id,
        createdBy: new mongoose.Types.ObjectId(),
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const updatedData = {
        name: "Objeto8 Actualizado",
        description: "Descripción actualizada del objeto 8",
        disciplineName: "Libros",
      };

      const response = await request(app)
        .put(`/api/v1/objects/${object._id}`)
        .send(updatedData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Necesitas estar logueado para realizar esta acción"
      );
    });

    it("debería fallar al actualizar un objeto con un ID inválido", async () => {
      const user = await createUser({
        email: "usuario9@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const invalidId = "12345";
      const updatedData = {
        name: "Objeto9 Actualizado",
        description: "Descripción actualizada del objeto 9",
        disciplineName: "Libros",
      };

      const response = await request(app)
        .put(`/api/v1/objects/${invalidId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid object ID format"
      );
    });

    it("debería fallar al actualizar un objeto que no existe", async () => {
      const user = await createUser({
        email: "usuario10@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedData = {
        name: "Objeto10 Actualizado",
        description: "Descripción actualizada del objeto 10",
        disciplineName: "Libros",
      };

      const response = await request(app)
        .put(`/api/v1/objects/${nonExistentId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Object not found");
    });

    it("debería fallar al actualizar un objeto sin permisos", async () => {
      const ownerUser = await createUser({
        email: "owner@example.com",
        password: "password123",
      });
      const ownerToken = await loginUser(ownerUser.email, "password123");

      const anotherUser = await createUser({
        email: "another@example.com",
        password: "password123",
      });
      const anotherToken = await loginUser(anotherUser.email, "password123");

      const discipline = await createDiscipline({
        name: "Canciones",
        description: "Canciones que has escuchado",
      });

      const object = await ObjectModel.create({
        name: "Objeto11",
        description: "Descripción del objeto 11",
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const updatedData = {
        name: "Objeto11 Actualizado",
        description: "Descripción actualizada del objeto 11",
        disciplineName: "Canciones",
      };

      const response = await request(app)
        .put(`/api/v1/objects/${object._id}`)
        .set("Authorization", `Bearer ${anotherToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "You are not authorized to update this object"
      );
    });
  });

  describe("DELETE /api/v1/objects/:objectId", () => {
    it("debería eliminar un objeto exitosamente como admin", async () => {
      const adminUser = await createUser({
        email: "admin2@example.com",
        password: "adminpass123",
        role: "admin",
      });
      const adminToken = await loginUser(adminUser.email, "adminpass123");

      const discipline = await createDiscipline({
        name: "Videojuegos",
        description: "Videojuegos que has jugado",
      });

      const object = await ObjectModel.create({
        name: "Objeto12",
        description: "Descripción del objeto 12",
        discipline: discipline._id,
        createdBy: new mongoose.Types.ObjectId(),
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const response = await request(app)
        .delete(`/api/v1/objects/${object._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Object deleted successfully"
      );
    });

    it("debería fallar al eliminar un objeto sin permisos", async () => {
      const ownerUser = await createUser({
        email: "owner2@example.com",
        password: "password123",
      });
      const ownerToken = await loginUser(ownerUser.email, "password123");

      const anotherUser = await createUser({
        email: "another2@example.com",
        password: "password123",
      });
      const anotherToken = await loginUser(anotherUser.email, "password123");

      const discipline = await createDiscipline({
        name: "Libros",
        description: "Libros que has leído",
      });

      const object = await ObjectModel.create({
        name: "Objeto13",
        description: "Descripción del objeto 13",
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const response = await request(app)
        .delete(`/api/v1/objects/${object._id}`)
        .set("Authorization", `Bearer ${anotherToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "You are not authorized to delete this object"
      );
    });

    it("debería fallar al eliminar un objeto que no existe", async () => {
      const adminUser = await createUser({
        email: "admin3@example.com",
        password: "adminpass123",
        role: "admin",
      });
      const adminToken = await loginUser(adminUser.email, "adminpass123");

      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/v1/objects/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Object not found");
    });

    it("debería fallar al eliminar un objeto con un ID inválido", async () => {
      const adminUser = await createUser({
        email: "admin4@example.com",
        password: "adminpass123",
        role: "admin",
      });
      const adminToken = await loginUser(adminUser.email, "adminpass123");

      const invalidId = "12345";
      const response = await request(app)
        .delete(`/api/v1/objects/${invalidId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid object ID format"
      );
    });

    it("debería funcionar al eliminar un objeto como propietario (no admin)", async () => {
      const ownerUser = await createUser({
        email: "owner3@example.com",
        password: "password123",
      });
      const ownerToken = await loginUser(ownerUser.email, "password123");

      const discipline = await createDiscipline({
        name: "Canciones",
        description: "Canciones que has escuchado",
      });

      const object = await ObjectModel.create({
        name: "Objeto14",
        description: "Descripción del objeto 14",
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const response = await request(app)
        .delete(`/api/v1/objects/${object._id}`)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Object deleted successfully"
      );
    });
  });

  describe("GET /api/v1/objects/:disciplineName", () => {
    it("debería obtener la galería de objetos por disciplina", async () => {
      const user = await createUser({
        email: "usuario11@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Libros",
        description: "Libros que has leído",
      });

      for (let i = 1; i <= 5; i++) {
        await ObjectModel.create({
          name: `Objeto${i}`,
          description: `Descripción del objeto ${i}`,
          discipline: discipline._id,
          createdBy: user._id,
          imageUrl: `/public/images/objects/objeto${i}.jpg`,
        });
      }

      const response = await request(app)
        .get(`/api/v1/objects/${discipline.name}`)
        .set("Authorization", `Bearer ${userToken}`)
        .query({ page: 1, limit: 3 });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("discipline");
      expect(response.body.discipline.name).toBe("Libros");
      expect(response.body).toHaveProperty("totalObjects", 5);
      expect(response.body).toHaveProperty("objects");
      expect(Array.isArray(response.body.objects)).toBe(true);
      expect(response.body.objects.length).toBe(3);
      expect(response.body).toHaveProperty("currentPage", 1);
      expect(response.body).toHaveProperty("totalPages", 2);
    });

    it("debería obtener una galería vacía si no hay objetos para la disciplina", async () => {
      const user = await createUser({
        email: "usuario12@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Canciones",
        description: "Canciones que has escuchado",
      });

      const response = await request(app)
        .get(`/api/v1/objects/${discipline.name}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("discipline");
      expect(response.body.discipline.name).toBe("Canciones");
      expect(response.body).toHaveProperty("totalObjects", 0);
      expect(response.body).toHaveProperty("objects");
      expect(Array.isArray(response.body.objects)).toBe(true);
      expect(response.body.objects.length).toBe(0);
      expect(response.body).toHaveProperty("currentPage", 1);
      expect(response.body).toHaveProperty("totalPages", 0);
    });

    it("debería fallar al obtener una galería con una disciplina inexistente", async () => {
      const user = await createUser({
        email: "usuario13@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const nonExistentDiscipline = "Cocina";

      const response = await request(app)
        .get(`/api/v1/objects/${nonExistentDiscipline}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Discipline not found");
    });
  });

  describe("GET /api/v1/objects/details/:objectId", () => {
    it("debería obtener un objeto exitosamente como propietario", async () => {
      const user = await createUser({
        username: "pepeuser",
        firstName: "Pepe",
        lastName: "García",
        email: "usuario14@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const discipline = await createDiscipline({
        name: "Canciones",
        description: "Canciones que has escuchado",
      });

      const object = await ObjectModel.create({
        name: "Objeto15",
        description: "Descripción del objeto 15",
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const response = await request(app)
        .get(`/api/v1/objects/details/${object._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("object");
      expect(response.body.object.name).toBe("Objeto15");
      expect(response.body.object.description).toBe(
        "Descripción del objeto 15"
      );
      expect(response.body.object.discipline.name).toBe("Canciones");
      expect(response.body.object.createdBy.username).toBe("pepeuser");
    });

    it("debería obtener un objeto exitosamente como administrador", async () => {
      const adminUser = await createUser({
        email: "admin5@example.com",
        password: "adminpass123",
        role: "admin",
      });
      const adminToken = await loginUser(adminUser.email, "adminpass123");

      const discipline = await createDiscipline({
        name: "Videojuegos",
        description: "Videojuegos que has jugado",
      });

      const ownerUser = await createUser({
        username: "owner",
        firstName: "Owner",
        lastName: "User",
        email: "owner4@example.com",
        password: "password123",
      });
      const object = await ObjectModel.create({
        name: "Objeto16",
        description: "Descripción del objeto 16",
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const response = await request(app)
        .get(`/api/v1/objects/details/${object._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("object");
      expect(response.body.object.name).toBe("Objeto16");
      expect(response.body.object.description).toBe(
        "Descripción del objeto 16"
      );
      expect(response.body.object.discipline.name).toBe("Videojuegos");
      expect(response.body.object.createdBy.username).toBe("owner");
    });

    it("debería fallar al obtener un objeto sin permisos", async () => {
      const ownerUser = await createUser({
        email: "owner5@example.com",
        password: "password123",
      });
      const ownerToken = await loginUser(ownerUser.email, "password123");

      const anotherUser = await createUser({
        email: "another3@example.com",
        password: "password123",
      });
      const anotherToken = await loginUser(anotherUser.email, "password123");

      const discipline = await createDiscipline({
        name: "Libros",
        description: "Libros que has leído",
      });

      const object = await ObjectModel.create({
        name: "Objeto17",
        description: "Descripción del objeto 17",
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: "/public/images/objects/test-image.jpg",
      });

      const response = await request(app)
        .get(`/api/v1/objects/details/${object._id}`)
        .set("Authorization", `Bearer ${anotherToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "You are not authorized to view this object"
      );
    });

    it("debería fallar al obtener un objeto con un ID inválido", async () => {
      const user = await createUser({
        email: "usuario18@example.com",
        password: "password123",
      });
      const userToken = await loginUser(user.email, "password123");

      const invalidId = "12345";
      const response = await request(app)
        .get(`/api/v1/objects/details/${invalidId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid object ID format"
      );
    });

    it("debería fallar al obtener un objeto que no existe", async () => {
      const adminUser = await createUser({
        email: "admin6@example.com",
        password: "adminpass123",
        role: "admin",
      });
      const adminToken = await loginUser(adminUser.email, "adminpass123");

      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/objects/details/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Object not found");
    });
  });
});
