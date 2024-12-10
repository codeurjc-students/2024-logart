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
        UserRegistered: {
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
            }
          }
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
              $ref: '#/components/schemas/UserRegistered',
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
              example: 'Canciones',
            },
            description: {
              type: 'string',
              example: 'Canciones que has escuchado.',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-06-01T12:34:56Z',
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
            },
          },
        },
        Object: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc',
            },
            name: {
              type: 'string',
              example: 'Objeto de Ejemplo',
            },
            description: {
              type: 'string',
              example: 'Descripción del objeto de ejemplo.',
            },
            imageUrl: {
              type: 'string',
              example: 'https://example.com/images/objects/objeto-ejemplo.jpg',
            },
            discipline: {
              type: 'string',
              example: '60d0fe4f5311236168a109cb',
            },
            createdBy: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca', 
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-06-01T12:34:56Z',
            },
          },
        },
        ObjectCreated: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Objeto de Ejemplo',
            },
            description: {
              type: 'string',
              example: 'Descripción del objeto de ejemplo.',
            },
            imageUrl: {
              type: 'string',
              example: 'https://example.com/images/objects/objeto-ejemplo.jpg',
            },
            discipline: {
              type: 'string',
              example: '60d0fe4f5311236168a109cb',
            },
            createdBy: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca', 
            },
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
            __v: {
              type: 'integer',
              example: 0,
            },
            
            }
        },
        ObjectUpdated: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc',
            },
            name: {
              type: 'string',
              example: 'Objeto Actualizado',
            },
            description: {
              type: 'string',
              example: 'Descripción actualizada del objeto.',
            },
            imageUrl: {
              type: 'string',
              example: 'https://example.com/images/objects/objeto-actualizado.jpg',
            },
            discipline: {
              type: 'string',
              example: '60d0fe4f5311236168a109cb', 
            },
            createdBy: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca', 
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
            __v: {
              type: 'integer',
              example: 0,
            },
          },
        },
        ObjectGetGalleryByDiscipline: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc',
            },
            name: {
              type: 'string',
              example: 'Objeto de Ejemplo',
            },
            description: {
              type: 'string',
              example: 'Descripción del objeto de ejemplo.',
            },
            imageUrl: {
              type: 'string',
              example: 'https://example.com/images/objects/objeto-ejemplo.jpg',
            },
            discipline: {
              type: 'string',
              example: '60d0fe4f5311236168a109cb',
            },
            createdBy: {
              "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "60d0fe4f5311236168a109ca"
          },
          "username": {
            "type": "string",
            "example": "johndoe"
          },
          "firstName": {
            "type": "string",
            "example": "John"
          },
          "lastName": {
            "type": "string",
            "example": "Doe"
          }
        },
      },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
            __v: {
              type: 'integer',
              example: 0,
            },    
        }
        },
        CreateObjectRequest: {
          type: 'object',
          required: ['name', 'disciplineName'],
          properties: {
            name: {
              type: 'string',
              example: 'Objeto de Ejemplo',
            },
            description: {
              type: 'string',
              example: 'Descripción del objeto de ejemplo.',
            },
            disciplineName: {
              type: 'string',
              example: 'Canciones',
            },
            imageUrl: {
              type: 'string',
              example: 'https://example.com/images/objects/objeto-ejemplo.jpg',
            },
          },
        },
        CreateObjectResponse: {
          type: 'object',
          properties: {
            object: {
              $ref: '#/components/schemas/ObjectCreated',
            },
            message: {
              type: 'string',
              example: 'Object created successfully',
            },
          },
        },
        UpdateObjectRequest: {
          type: 'object',
          required: ['name', 'disciplineName'],
          properties: {
            name: {
              type: 'string',
              example: 'Objeto Actualizado',
            },
            description: {
              type: 'string',
              example: 'Descripción actualizada del objeto.',
            },
            disciplineName: {
              type: 'string',
              example: 'Canciones',
            },
            imageUrl: {
              type: 'string',
              example: 'https://example.com/images/objects/objeto-actualizado.jpg',
            },
          },
        },
        UpdateObjectResponse: {
          type: 'object',
          properties: {
            object: {
              $ref: '#/components/schemas/ObjectUpdated',
            },
            message: {
              type: 'string',
              example: 'Object updated successfully',
            },
          },
        },
        DeleteObjectResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Object deleted successfully',
            },
          },
        },
        GetGalleryByDisciplineResponse: {
          type: 'object',
          properties: {
            discipline: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '60d0fe4f5311236168a109cb',
                },
                name: {
                  type: 'string',
                  example: 'Canciones',
                },
              },
            },
            totalObjects: {
              type: 'integer',
              example: 1,
            },
            objects: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ObjectGetGalleryByDiscipline',
              },
            },
            currentPage: {
              type: 'integer',
              example: 1,
            },
            totalPages: {
              type: 'integer',
              example: 1,
            },
          },
        },
        GetObjectByIdResponse: {
          type: 'object',
          properties: {
            object: {
              $ref: '#/components/schemas/ObjectGetGalleryByDiscipline',
            },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109cd',
            },
            content: {
              type: 'string',
              example: 'Este es un comentario de ejemplo.',
            },
            object: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc', 
            },
            user: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca', 
            },
            isEditedByAdmin: {
              type: 'boolean',
              example: false,
            },
            editedBy: {
              type: 'string',
              example: null, 
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-02T12:34:56Z',
            },
          },
        },
        CommentUpdated: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d0fe4f5311236168a109cd',
            },
            content: {
              type: 'string',
              example: 'Contenido actualizado del comentario.',
            },
            object: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc', 
            },
            user: {
              type: 'string',
              example: '60d0fe4f5311236168a109ca', 
            },
            isEditedByAdmin: {
              type: 'boolean',
              example: false,
            },
            editedBy: {
              type: 'string',
              example: null, 
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-01T12:34:56Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2022-01-02T12:34:56Z',
            },
          },
        },
        CreateCommentRequest: {
          type: 'object',
          required: ['content', 'objectId'],
          properties: {
            content: {
              type: 'string',
              example: 'Este es un comentario de ejemplo.',
            },
            objectId: {
              type: 'string',
              example: '60d0fe4f5311236168a109cc',
            },
          },
        },
        CreateCommentResponse: {
          type: 'object',
          properties: {
            comment: {
              $ref: '#/components/schemas/Comment',
            },
            message: {
              type: 'string',
              example: 'Comment created successfully',
            },
          },
        },
        UpdateCommentRequest: {
          type: 'object',
          required: ['content'],
          properties: {
            content: {
              type: 'string',
              example: 'Contenido actualizado del comentario.',
            },
          },
        },
        UpdateCommentResponse: {
          type: 'object',
          properties: {
            comment: {
              $ref: '#/components/schemas/CommentUpdated',
            },
            message: {
              type: 'string',
              example: 'Comment updated successfully',
            },
          },
        },
        DeleteCommentResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Comment deleted successfully',
            },
          },
        },
        GetCommentsByObjectIdResponse: {
          type: 'object',
          properties: {
            comments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Comment',
                
              },
            },
          },
            example: {
            comments: [
              {
                _id: '60d0fe4f5311236168a109cd',
                content: 'Este es un comentario de ejemplo.',
                object: '60d0fe4f5311236168a109cc',
                user: '60d0fe4f5311236168a109ca',
                isEditedByAdmin: false,
                editedBy: null,
                createdAt: '2022-01-01T12:34:56Z',
                updatedAt: '2022-01-02T12:34:56Z',
              },
              {
                _id: '60d0fe4f5311236168a109ce',
                content: 'Este es otro comentario de ejemplo editado por un admin.',
                object: '60d0fe4f5311236168a109cc',
                user: '60d0fe4f5311236168a109ca',
                isEditedByAdmin: true,
                editedBy: '60d0fe4f5311236168a109ca',
                createdAt: '2022-01-02T12:34:56Z',
                updatedAt: '2022-01-03T12:34:56Z',
              },
            ],
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
