const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LogArt API',
      version: '1.0.0',
      description: 'Documentación API REST para la aplicación LogArt',
      contact: {
        name: 'David Moreno Martín',
        email: 'david.moreno.m.w@gmail.com',
        url: 'https://github.com/codeurjc-students/2024-logart',
      },
    },
    servers: [
      {
        url: 'https://localhost:443/api/v1',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Esquemas de Autenticación
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca',
            },
            firstName: {
              type: 'string',
              example: 'Juan',
            },
            lastName: {
              type: 'string',
              example: 'Pérez',
            },
            username: {
              type: 'string',
              example: 'juanperez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@example.com',
            },
            role: {
              type: 'string',
              example: 'user',
            },
            isVerified: {
              type: 'boolean',
              example: true,
            },
            hastoken: {
              type: 'boolean',
              example: true,
            },
            bio: {
              type: 'string',
              example: 'Bio del usuario',
            },
            profileImage: {
              type: 'string',
              example: 'https://example.com/profile.jpg',
            },
            verificationToken: {
              type: 'string',
              example: null,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'pepe@gmail.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'hola123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'username', 'email', 'password'],
          properties: {
            firstName: {
              type: 'string',
              example: 'Juan',
            },
            lastName: {
              type: 'string',
              example: 'Pérez',
            },
            username: {
              type: 'string',
              example: 'juanperez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123',
            },
          },
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            message: {
              type: 'string',
              example: 'User registered, please check your email to verify your account',
            },
          },
        },
        VerifyUserResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'User verified successfully',
            },
          },
        },
        LogoutResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Logout successful',
            },
          },
        },
        // Esquemas de Usuarios
        AllUsersResponse: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
            totalUsers: {
              type: 'integer',
              example: 50,
            },
            currentPage: {
              type: 'integer',
              example: 1,
            },
            totalPages: {
              type: 'integer',
              example: 10,
            },
          },
        },
        FindUserByIdResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            message: {
              type: 'string',
              example: 'User found',
            },
          },
        },
        DeleteUserResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'User and Data deleted successfully',
            },
          },
        },
        UserProfileResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            message: {
              type: 'string',
              example: 'User profile retrieved successfully',
            },
          },
        },
        UpdateUserProfileRequest: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              example: 'Juan',
            },
            lastName: {
              type: 'string',
              example: 'Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@example.com',
            },
            username: {
              type: 'string',
              example: 'juanperez',
            },
            bio: {
              type: 'string',
              example: 'Nueva bio del usuario',
            },
          },
        },
        UpdateUserProfileResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            message: {
              type: 'string',
              example: 'User updated successfully',
            },
          },
        },
        Discipline: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109cb',
            },
            name: {
              type: 'string',
              enum: ['Libros', 'Canciones', 'Videojuegos'],
              example: 'Canciones',
            },
            description: {
              type: 'string',
              example: 'Canciones que has escuchado',
            },
          },
        },
        GetAllDisciplinesResponse: {
          type: 'object',
          properties: {
            disciplines: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Discipline',
              },
              minItems: 1,
              maxItems:3,
              uniqueItems: true,
              example: [
                { _id: '60d0fe4f5311236168a109cb', name: 'Libros', description: 'Libros que has leído' },
                { _id: '60d0fe4f5311236168a109cc', name: 'Canciones', description: 'Canciones que has escuchado' },
                { _id: '60d0fe4f5311236168a109cd', name: 'Videojuegos', description: 'Videojuegos que has jugado' },
              ]
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '../controllers/*.js')], // Ruta a tus controladores con anotaciones Swagger
};

const swaggerSpec = swaggerJSDoc(options);

// Generar YAML
const swaggerYaml = yaml.dump(swaggerSpec);

// Escribir el archivo YAML
fs.writeFileSync(path.join(__dirname, 'api-docs.yaml'), swaggerYaml, 'utf8');

console.log('Archivo api-docs.yaml generado exitosamente.');

module.exports = swaggerSpec;
