const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080', // Sesuaikan dengan URL server Anda
        description: 'Development server',
      },
    ],
  };
  
  module.exports = swaggerDefinition;
  