const request = require("supertest");
const app = require("../../app");
const Discipline = require("../../models/discipline.model");

describe("Pruebas de Disciplinas", () => {
  beforeEach(async () => {
    await Discipline.deleteMany({});
  });

  describe("GET /api/v1/disciplines/", () => {
    it("debería obtener todas las disciplinas", async () => {
      const disciplinesData = [
        { name: "Libros", description: "Disciplina relacionada con libros" },
        {
          name: "Canciones",
          description: "Disciplina relacionada con canciones",
        },
        {
          name: "Videojuegos",
          description: "Disciplina relacionada con videojuegos",
        },
      ];

      await Discipline.insertMany(disciplinesData);

      const response = await request(app).get("/api/v1/disciplines/").send();

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("disciplines");
      expect(Array.isArray(response.body.disciplines)).toBe(true);
      expect(response.body.disciplines.length).toBe(3);

      const returnedNames = response.body.disciplines.map((d) => d.name).sort();
      const expectedNames = disciplinesData.map((d) => d.name).sort();
      expect(returnedNames).toEqual(expectedNames);
    });

    it("debería obtener un array vacío si no hay disciplinas", async () => {
      const response = await request(app).get("/api/v1/disciplines/").send();

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("disciplines");
      expect(Array.isArray(response.body.disciplines)).toBe(true);
      expect(response.body.disciplines.length).toBe(0);
    });

    it("debería manejar errores del servidor", async () => {
      const originalFind = Discipline.find;
      Discipline.find = jest.fn().mockImplementation(() => {
        throw new Error("Error de base de datos");
      });

      const response = await request(app).get("/api/v1/disciplines/").send();

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty(
        "message",
        "Error obteniendo disciplinas"
      );

      Discipline.find = originalFind;
    });
  });
});
