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
