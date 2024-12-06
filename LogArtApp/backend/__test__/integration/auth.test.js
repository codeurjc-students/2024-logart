const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

describe('Pruebas de Autenticación', () => {

  describe('POST /api/v1/users', () => {
    it('debería registrar un usuario nuevo con datos válidos', async () => {
      const newUserData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        username: 'juanperez',
        email: 'juan.perez@example.com',
        password: 'SecurePassword123'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(newUserData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body).toHaveProperty('message', 'User registered, please check your email to verify your account');
      expect(response.headers).toHaveProperty('location');

      const userInDb = await User.findOne({ email: newUserData.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb.isVerified).toBe(false); 
    });

    it('debería retornar 409 si el usuario ya existe', async () => {
      const existingUserData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        username: 'juanrepetido',
        email: 'juan.repetido@example.com',
        password: 'SecurePassword123'
      };

      await User.create({
        ...existingUserData,
        password: await bcrypt.hash('SecurePassword123', 10),
        isVerified: true,
      });

      const response = await request(app)
        .post('/api/v1/users')
        .send(existingUserData);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toBe('User already exists');
    });

    it('debería retornar 400 si faltan campos', async () => {
      const incompleteUserData = {
        firstName: 'Juan',
        email: 'falta.campos@example.com',
        password: 'SecurePassword123'

      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(incompleteUserData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toBe('All fields are required');
    });
  });

  describe('POST /api/v1/auth/', () => {
    let loginData;
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('hola123', 10);
      await User.create({
        username: 'pepeuser',
        email: 'pepe@gmail.com',
        firstName: 'Pepe',
        lastName: 'García',
        password: hashedPassword,
        isVerified: true,
        hastoken: false
      });

      loginData = {
        email: 'pepe@gmail.com',
        password: 'hola123',
      };
    });

    it('debería fallar con credenciales inválidas (contraseña incorrecta)', async () => {
      const invalidLoginData = {
        email: 'pepe@gmail.com',
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/v1/auth/')
        .send(invalidLoginData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('debería iniciar sesión con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/')
        .send(loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user).toHaveProperty('email', loginData.email);
      expect(response.body).toHaveProperty('message', 'Login successful');

      const user = await User.findOne({ email: loginData.email });
      expect(user.hastoken).toBe(true);
    });

    

    it('debería fallar con credenciales inválidas (usuario no existe)', async () => {
      const noUserData = {
        email: 'nonexistent@example.com',
        password: 'SomePassword'
      };

      const response = await request(app)
        .post('/api/v1/auth/')
        .send(noUserData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toBe('User not found');
    });

    it('debería fallar con campos inválidos', async () => {
      const incompleteLoginData = { email: 'nonexistent@example.com' };
      const response = await request(app)
        .post('/api/v1/auth/')
        .send(incompleteLoginData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toBe('Both fields are required');
    });

    it('debería fallar si el usuario no está verificado', async () => {
      const hashedPassword = await bcrypt.hash('AnotherPassword123', 10);
      await User.create({
        username: 'juanperez2',
        email: 'juan.perez2@example.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        password: hashedPassword,
        isVerified: false,
        hastoken: false,
      });

      const unverifiedData = {
        email: 'juan.perez2@example.com',
        password: 'AnotherPassword123'
      };

      const response = await request(app)
        .post('/api/v1/auth/')
        .send(unverifiedData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body.message).toBe('Please verify your email before logging in');
    });
  });

  
});
