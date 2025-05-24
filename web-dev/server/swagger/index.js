const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blockchain Academic Certificates API',
      version: '1.0.0',
      description: 'API documentation for Blockchain Academic Certificates platform',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Universities',
        description: 'University management endpoints'
      },
      {
        name: 'Students',
        description: 'Student management endpoints'
      },
      {
        name: 'Certificates',
        description: 'Certificate management endpoints'
      },
      {
        name: 'Verification',
        description: 'Certificate verification endpoints'
      },
      {
        name: 'Health',
        description: 'API health endpoints'
      }
    ]
  },  apis: [
    './swagger/swagger.js',
    './routes/*.js',
    './models/*.js',
    './middleware/*.js',
    './index.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const path = require('path');
const fs = require('fs');
const express = require('express');

// Save the generated swagger spec to a file so it can be consumed by our custom UI
const apiSpecPath = path.join(__dirname, '../public/api-spec.json');
fs.writeFileSync(apiSpecPath, JSON.stringify(swaggerDocs, null, 2));

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: fs.readFileSync(path.join(__dirname, '../public/css/swagger-custom.css'), 'utf8'),
    customSiteTitle: "Blockchain Academic Certificates API Documentation",
    customfavIcon: '/images/favicon.png'
  }),
  serveCustomUI: (app) => {
    // Serve static files
    app.use(express.static(path.join(__dirname, '../public')));
    
    // Serve custom Swagger UI
    app.get('/api-custom', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/swagger-ui.html'));
    });
  }
};
