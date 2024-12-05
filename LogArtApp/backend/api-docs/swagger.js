const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { profile } = require('console');

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
              example: 'juan.perez@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePassword123',
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
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '../controllers/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerYaml = yaml.dump(swaggerSpec);

fs.writeFileSync(path.join(__dirname, 'api-docs.yaml'), swaggerYaml, 'utf8');

console.log('Archivo api-docs.yaml generado exitosamente.');

module.exports = swaggerSpec;
