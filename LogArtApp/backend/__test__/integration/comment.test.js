const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user.model');
const Discipline = require('../../models/discipline.model');
const ObjectModel = require('../../models/object.model');
const Comment = require('../../models/comment.model');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');

const createUser = async (overrides = {}) => {
  const timestamp = Date.now();
  const defaultData = {
    firstName: 'Usuario',
    lastName: 'Prueba',
    username: `usuario${timestamp}`,
    email: `usuario${timestamp}@example.com`,
    password: 'Password123',
    isVerified: true,
    hastoken: false,
    role: 'user', 
    
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
    .post('/api/v1/auth/')
    .send({ email, password });

  return response.body.accessToken;
};

const createDiscipline = async (overrides = {}) => {
  const timestamp = Date.now();
  const defaultData = {
    name: `Libros${timestamp}`,
    description: 'Disciplina relacionada con libros',
  };

  const disciplineData = { ...defaultData, ...overrides };

  const discipline = await Discipline.create(disciplineData);

  return discipline;
};

const createObject = async (overrides = {}) => {
  const timestamp = Date.now();
  const defaultData = {
    name: `Objeto${timestamp}`,
    description: 'Descripción del objeto',
    imageUrl: `/public/images/objects/objeto${timestamp}.jpg`,
  };

  const objectData = { ...defaultData, ...overrides };

  const object = await ObjectModel.create(objectData);

  return object;
};

const createComment = async (overrides = {}) => {
  const defaultData = {
    content: 'Este es un comentario de prueba',
  };

  const commentData = { ...defaultData, ...overrides };

  const comment = await Comment.create(commentData);

  return comment;
};

describe('Pruebas de Comentarios', () => {

  beforeEach(async () => {
    await User.deleteMany({});
    await Discipline.deleteMany({});
    await ObjectModel.deleteMany({});
    await Comment.deleteMany({});
  });


  describe('POST /api/v1/comments/', () => {
    it('debería crear un comentario exitosamente como propietario', async () => {
      const user = await createUser({
        email: 'usuario1@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Libros',
        description: 'Disciplina relacionada con libros',
      });

      const object = await ObjectModel.create({
        name: 'Objeto1',
        description: 'Descripción del objeto 1',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto1.jpg',
      });

      const newCommentData = {
        content: 'Este es un comentario de prueba',
        objectId: object._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/comments/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCommentData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('comment');
      expect(response.body.comment.content).toBe(newCommentData.content);
      expect(response.body.comment.object.toString()).toBe(object._id.toString());
      expect(response.body.comment.user.toString()).toBe(user._id.toString());
      expect(response.body).toHaveProperty('message', 'Comment created successfully');
      expect(response.headers).toHaveProperty('location');

      const commentInDb = await Comment.findOne({ content: newCommentData.content });
      expect(commentInDb).not.toBeNull();
      expect(commentInDb.object.toString()).toBe(object._id.toString());
      expect(commentInDb.user.toString()).toBe(user._id.toString());
    });

    it('debería crear un comentario exitosamente como admin en objeto de otro usuario', async () => {
      const ownerUser = await createUser({
        email: 'owner1@example.com',
        password: 'password123',
      });
      const ownerToken = await loginUser(ownerUser.email, 'password123');

      const adminUser = await createUser({
        email: 'admin1@example.com',
        password: 'adminpass123',
        role: 'admin',
      });
      const adminToken = await loginUser(adminUser.email, 'adminpass123');

      const discipline = await createDiscipline({
        name: 'Canciones',
        description: 'Disciplina relacionada con canciones',
      });

      const object = await ObjectModel.create({
        name: 'Objeto2',
        description: 'Descripción del objeto 2',
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: '/public/images/objects/objeto2.jpg',
      });

      const newCommentData = {
        content: 'Comentario realizado por admin',
        objectId: object._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/comments/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCommentData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('comment');
      expect(response.body.comment.content).toBe(newCommentData.content);
      expect(response.body.comment.object.toString()).toBe(object._id.toString());
      expect(response.body.comment.user.toString()).toBe(adminUser._id.toString());
      expect(response.body).toHaveProperty('message', 'Comment created successfully');
      expect(response.headers).toHaveProperty('location');

      const commentInDb = await Comment.findOne({ content: newCommentData.content });
      expect(commentInDb).not.toBeNull();
      expect(commentInDb.object.toString()).toBe(object._id.toString());
      expect(commentInDb.user.toString()).toBe(adminUser._id.toString());
    });

    it('debería fallar al crear un comentario sin contenido', async () => {
      const user = await createUser({
        email: 'usuario2@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Videojuegos',
        description: 'Disciplina relacionada con videojuegos',
      });

      const object = await ObjectModel.create({
        name: 'Objeto3',
        description: 'Descripción del objeto 3',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto3.jpg',
      });

      const newCommentData = {
        objectId: object._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/comments/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCommentData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Both content and object Id are required');

      const commentInDb = await Comment.findOne({ object: object._id });
      expect(commentInDb).toBeNull();
    });

    it('debería fallar al crear un comentario con un objectId inválido', async () => {
      const user = await createUser({
        email: 'usuario3@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const newCommentData = {
        content: 'Comentario con objectId inválido',
        objectId: '12345', 
      };

      const response = await request(app)
        .post('/api/v1/comments/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCommentData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Invalid object ID format');

      const commentInDb = await Comment.findOne({ content: newCommentData.content });
      expect(commentInDb).toBeNull();
    });

    it('debería fallar al crear un comentario en un objeto inexistente', async () => {
      const user = await createUser({
        email: 'usuario4@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const nonExistentObjectId = new mongoose.Types.ObjectId();

      const newCommentData = {
        content: 'Comentario en objeto inexistente',
        objectId: nonExistentObjectId.toString(),
      };

      const response = await request(app)
        .post('/api/v1/comments/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCommentData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Object not found');

      const commentInDb = await Comment.findOne({ content: newCommentData.content });
      expect(commentInDb).toBeNull();
    });

    it('debería fallar al crear un comentario como usuario no autorizado (no propietario ni admin)', async () => {
      const ownerUser = await createUser({
        email: 'owner2@example.com',
        password: 'password123',
      });
      const ownerToken = await loginUser(ownerUser.email, 'password123');

      const anotherUser = await createUser({
        email: 'usuario5@example.com',
        password: 'password123',
      });
      const anotherToken = await loginUser(anotherUser.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Libros',
        description: 'Disciplina relacionada con libros',
      });

      const object = await ObjectModel.create({
        name: 'Objeto4',
        description: 'Descripción del objeto 4',
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: '/public/images/objects/objeto4.jpg',
      });

      const newCommentData = {
        content: 'Comentario no autorizado',
        objectId: object._id.toString(),
      };

      const response = await request(app)
        .post('/api/v1/comments/')
        .set('Authorization', `Bearer ${anotherToken}`)
        .send(newCommentData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'You are not authorized to comment on this object');

      const commentInDb = await Comment.findOne({ content: newCommentData.content });
      expect(commentInDb).toBeNull();
    });
  });

  describe('PUT /api/v1/comments/:commentId', () => {
    it('debería actualizar un comentario exitosamente como propietario', async () => {
      const user = await createUser({
        email: 'usuario6@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Canciones',
        description: 'Disciplina relacionada con canciones',
      });

      const object = await ObjectModel.create({
        name: 'Objeto5',
        description: 'Descripción del objeto 5',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto5.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario original',
        object: object._id,
        user: user._id,
      });

      const updatedCommentData = {
        content: 'Comentario actualizado por propietario',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${comment._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedCommentData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('comment');
      expect(response.body.comment.content).toBe(updatedCommentData.content);
      expect(response.body).toHaveProperty('message', 'Comment updated successfully');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb.content).toBe(updatedCommentData.content);
      expect(commentInDb.isEditedByAdmin).toBe(false);
      expect(commentInDb.editedBy).toBeNull();
    });

    it('debería actualizar un comentario exitosamente como admin', async () => {
      const ownerUser = await createUser({
        email: 'owner3@example.com',
        password: 'password123',
      });
      const ownerToken = await loginUser(ownerUser.email, 'password123');

      const adminUser = await createUser({
        email: 'admin2@example.com',
        password: 'adminpass123',
        role: 'admin',
      });
      const adminToken = await loginUser(adminUser.email, 'adminpass123');

      const discipline = await createDiscipline({
        name: 'Videojuegos',
        description: 'Disciplina relacionada con videojuegos',
      });

      const object = await ObjectModel.create({
        name: 'Objeto6',
        description: 'Descripción del objeto 6',
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: '/public/images/objects/objeto6.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario original del propietario',
        object: object._id,
        user: ownerUser._id,
      });

      const updatedCommentData = {
        content: 'Comentario actualizado por admin',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${comment._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedCommentData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('comment');
      expect(response.body.comment.content).toBe(updatedCommentData.content);
      expect(response.body.comment.isEditedByAdmin).toBe(true);
      expect(response.body.comment.editedBy.toString()).toBe(adminUser._id.toString());
      expect(response.body).toHaveProperty('message', 'Comment updated successfully');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb.content).toBe(updatedCommentData.content);
      expect(commentInDb.isEditedByAdmin).toBe(true);
      expect(commentInDb.editedBy.toString()).toBe(adminUser._id.toString());
    });

    it('debería fallar al actualizar un comentario sin autenticación', async () => {
      const user = await createUser({
        email: 'usuario7@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Libros',
        description: 'Disciplina relacionada con libros',
      });

      const object = await ObjectModel.create({
        name: 'Objeto7',
        description: 'Descripción del objeto 7',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto7.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario original sin autenticación',
        object: object._id,
        user: user._id,
      });

      const updatedCommentData = {
        content: 'Intento de actualización sin autenticación',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${comment._id}`)
        .send(updatedCommentData);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Necesitas estar logueado y un token válido para realizar esta acción');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb.content).toBe('Comentario original sin autenticación');
    });

    it('debería fallar al actualizar un comentario con un commentId inválido', async () => {
      const user = await createUser({
        email: 'usuario8@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const invalidCommentId = '12345';
      const updatedCommentData = {
        content: 'Intento de actualización con ID inválido',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${invalidCommentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedCommentData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Invalid comment ID format');
    });

    it('debería fallar al actualizar un comentario que no existe', async () => {
      const user = await createUser({
        email: 'usuario9@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const nonExistentCommentId = new mongoose.Types.ObjectId();
      const updatedCommentData = {
        content: 'Intento de actualización en comentario inexistente',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${nonExistentCommentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedCommentData);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Comment not found');
    });

    it('debería fallar al actualizar un comentario como usuario no autorizado', async () => {
      const ownerUser = await createUser({
        email: 'owner4@example.com',
        password: 'password123',
      });
      const ownerToken = await loginUser(ownerUser.email, 'password123');

      const anotherUser = await createUser({
        email: 'usuario10@example.com',
        password: 'password123',
      });
      const anotherToken = await loginUser(anotherUser.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Videojuegos',
        description: 'Disciplina relacionada con videojuegos',
      });

      const object = await ObjectModel.create({
        name: 'Objeto8',
        description: 'Descripción del objeto 8',
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: '/public/images/objects/objeto8.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario del propietario',
        object: object._id,
        user: ownerUser._id,
      });

      const updatedCommentData = {
        content: 'Intento de actualización por usuario no autorizado',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${comment._id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send(updatedCommentData);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'You are not authorized to update this comment');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb.content).toBe('Comentario del propietario');
    });
  });

  describe('DELETE /api/v1/comments/:commentId', () => {
    it('debería eliminar un comentario exitosamente como propietario', async () => {
      const user = await createUser({
        email: 'usuario11@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Libros',
        description: 'Disciplina relacionada con libros',
      });

      const object = await ObjectModel.create({
        name: 'Objeto9',
        description: 'Descripción del objeto 9',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto9.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario a eliminar',
        object: object._id,
        user: user._id,
      });

      const response = await request(app)
        .delete(`/api/v1/comments/${comment._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Comment deleted successfully');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb).toBeNull();
    });

    it('debería eliminar un comentario exitosamente como admin', async () => {
      const ownerUser = await createUser({
        email: 'owner5@example.com',
        password: 'password123',
      });
      const ownerToken = await loginUser(ownerUser.email, 'password123');

      const adminUser = await createUser({
        email: 'admin3@example.com',
        password: 'adminpass123',
        role: 'admin',
      });
      const adminToken = await loginUser(adminUser.email, 'adminpass123');

      const discipline = await createDiscipline({
        name: 'Canciones',
        description: 'Disciplina relacionada con canciones',
      });

      const object = await ObjectModel.create({
        name: 'Objeto10',
        description: 'Descripción del objeto 10',
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: '/public/images/objects/objeto10.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario a eliminar por admin',
        object: object._id,
        user: ownerUser._id,
      });

      const response = await request(app)
        .delete(`/api/v1/comments/${comment._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Comment deleted successfully');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb).toBeNull();
    });

    it('debería fallar al eliminar un comentario sin autenticación', async () => {
      const user = await createUser({
        email: 'usuario12@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Videojuegos',
        description: 'Disciplina relacionada con videojuegos',
      });


      const object = await ObjectModel.create({
        name: 'Objeto11',
        description: 'Descripción del objeto 11',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto11.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario sin autenticación',
        object: object._id,
        user: user._id,
      });

      const response = await request(app)
        .delete(`/api/v1/comments/${comment._id}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Necesitas estar logueado y un token válido para realizar esta acción');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb).not.toBeNull();
    });

    it('debería fallar al eliminar un comentario con un commentId inválido', async () => {
      const user = await createUser({
        email: 'usuario13@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const invalidCommentId = '12345';

      const response = await request(app)
        .delete(`/api/v1/comments/${invalidCommentId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Invalid comment ID format');
    });

    it('debería fallar al eliminar un comentario que no existe', async () => {
      const adminUser = await createUser({
        email: 'admin4@example.com',
        password: 'adminpass123',
        role: 'admin',
      });
      const adminToken = await loginUser(adminUser.email, 'adminpass123');

      const nonExistentCommentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/v1/comments/${nonExistentCommentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Comment not found');
    });

    it('debería fallar al eliminar un comentario como usuario no autorizado (no propietario ni admin)', async () => {
      const ownerUser = await createUser({
        email: 'owner6@example.com',
        password: 'password123',
      });
      const ownerToken = await loginUser(ownerUser.email, 'password123');

      const anotherUser = await createUser({
        email: 'usuario14@example.com',
        password: 'password123',
      });
      const anotherToken = await loginUser(anotherUser.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Libros',
        description: 'Disciplina relacionada con libros',
      });

      const object = await ObjectModel.create({
        name: 'Objeto12',
        description: 'Descripción del objeto 12',
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: '/public/images/objects/objeto12.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario protegido',
        object: object._id,
        user: ownerUser._id,
      });

      const response = await request(app)
        .delete(`/api/v1/comments/${comment._id}`)
        .set('Authorization', `Bearer ${anotherToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'You are not authorized to delete this comment');

      const commentInDb = await Comment.findById(comment._id);
      expect(commentInDb).not.toBeNull();
    });
  });

  describe('GET /api/v1/comments/:objectId', () => {
    it('debería obtener todos los comentarios de un objeto exitosamente como propietario', async () => {
      const user = await createUser({
        email: 'usuario15@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Canciones',
        description: 'Disciplina relacionada con canciones',
      });

      const object = await ObjectModel.create({
        name: 'Objeto13',
        description: 'Descripción del objeto 13',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto13.jpg',
      });

      const commentsData = [
        { content: 'Comentario 1', object: object._id, user: user._id },
        { content: 'Comentario 2', object: object._id, user: user._id },
        { content: 'Comentario 3', object: object._id, user: user._id },
      ];

      await Comment.insertMany(commentsData);

      const response = await request(app)
        .get(`/api/v1/comments/${object._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .query({ page: 1, limit: 2 });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('comments');
      expect(Array.isArray(response.body.comments)).toBe(true);
      expect(response.body.comments.length).toBe(2);
      expect(response.body).toHaveProperty('totalComments', 3);
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(response.body).toHaveProperty('totalPages', 2);
    });

    it('debería obtener comentarios específicos por commentId', async () => {
      const user = await createUser({
        email: 'usuario16@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Videojuegos',
        description: 'Disciplina relacionada con videojuegos',
      });

      const object = await ObjectModel.create({
        name: 'Objeto14',
        description: 'Descripción del objeto 14',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto14.jpg',
      });

      const comment1 = await Comment.create({
        content: 'Comentario 1',
        object: object._id,
        user: user._id,
      });
      const comment2 = await Comment.create({
        content: 'Comentario 2',
        object: object._id,
        user: user._id,
      });

      const response = await request(app)
        .get(`/api/v1/comments/${object._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .query({ commentId: comment1._id.toString() });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('comments');
      expect(Array.isArray(response.body.comments)).toBe(true);
      expect(response.body.comments.length).toBe(1);
      expect(response.body.comments[0].content).toBe('Comentario 1');
      expect(response.body).toHaveProperty('totalComments', 1);
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(response.body).toHaveProperty('totalPages', 1);
    });

    it('debería obtener comentarios con paginación', async () => {
      const user = await createUser({
        email: 'usuario17@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Libros',
        description: 'Disciplina relacionada con libros',
      });

      const object = await ObjectModel.create({
        name: 'Objeto15',
        description: 'Descripción del objeto 15',
        discipline: discipline._id,
        createdBy: user._id,
        imageUrl: '/public/images/objects/objeto15.jpg',
      });

      const commentsData = [];
      for (let i = 1; i <= 5; i++) {
        commentsData.push({
          content: `Comentario ${i}`,
          object: object._id,
          user: user._id,
        });
      }
      await Comment.insertMany(commentsData);

      const response = await request(app)
        .get(`/api/v1/comments/${object._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .query({ page: 2, limit: 2 });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('comments');
      expect(Array.isArray(response.body.comments)).toBe(true);
      expect(response.body.comments.length).toBe(2);
      expect(response.body).toHaveProperty('totalComments', 5);
      expect(response.body).toHaveProperty('currentPage', 2);
      expect(response.body).toHaveProperty('totalPages', 3);
    });

    it('debería fallar al obtener comentarios sin autenticación', async () => {
      const discipline = await createDiscipline({
        name: 'Canciones',
        description: 'Disciplina relacionada con canciones',
      });

      const object = await ObjectModel.create({
        name: 'Objeto16',
        description: 'Descripción del objeto 16',
        discipline: discipline._id,
        createdBy: new mongoose.Types.ObjectId(),
        imageUrl: '/public/images/objects/objeto16.jpg',
      });

      const response = await request(app)
        .get(`/api/v1/comments/${object._id}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Necesitas estar logueado y un token válido para realizar esta acción');
    });

    it('debería fallar al obtener comentarios con un objectId inválido', async () => {
      const user = await createUser({
        email: 'usuario18@example.com',
        password: 'password123',
      });
      const userToken = await loginUser(user.email, 'password123');

      const invalidObjectId = '12345';

      const response = await request(app)
        .get(`/api/v1/comments/${invalidObjectId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Invalid object ID format');
    });

    it('debería fallar al obtener comentarios de un objeto inexistente', async () => {
      const adminUser = await createUser({
        email: 'admin5@example.com',
        password: 'adminpass123',
        role: 'admin',
      });
      const adminToken = await loginUser(adminUser.email, 'adminpass123');

      const nonExistentObjectId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v1/comments/${nonExistentObjectId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'Object not found');
    });

    it('debería fallar al obtener comentarios como usuario no autorizado (no propietario ni admin)', async () => {
      const ownerUser = await createUser({
        email: 'owner7@example.com',
        password: 'password123',
      });
      const ownerToken = await loginUser(ownerUser.email, 'password123');

      const anotherUser = await createUser({
        email: 'usuario19@example.com',
        password: 'password123',
      });
      const anotherToken = await loginUser(anotherUser.email, 'password123');

      const discipline = await createDiscipline({
        name: 'Libros',
        description: 'Disciplina relacionada con libros',
      });

      const object = await ObjectModel.create({
        name: 'Objeto17',
        description: 'Descripción del objeto 17',
        discipline: discipline._id,
        createdBy: ownerUser._id,
        imageUrl: '/public/images/objects/objeto17.jpg',
      });

      const comment = await Comment.create({
        content: 'Comentario protegido',
        object: object._id,
        user: ownerUser._id,
      });

      const response = await request(app)
        .get(`/api/v1/comments/${object._id}`)
        .set('Authorization', `Bearer ${anotherToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message', 'You are not authorized to view comments for this object');
    });
  });

});
