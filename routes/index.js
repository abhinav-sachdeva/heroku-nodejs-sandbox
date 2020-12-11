// Import Controllers
const fizzbuzzCtrl = require("../controllers/fizzbuzzCtrl");
const fastify = require("fastify");

const routes = [
  {
    method: "GET",
    url: "/api/fizzbuzz/:num",
    handler: fizzbuzzCtrl.getData,
    schema: {
      description: 'FizzBuzz Generator',
      tags: ['fizzbuzz'],
      summary: 'Generates fizzbuzz for the input number',
      params: {
        type: 'object',
        properties: {
          num: {
            type: 'number',
            description: 'FizzBuzz input number'
          }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'array',
          items: {
            type: ["number", "string"]
          }
        },
        429: {
          description: 'Rate limiting response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Invalid input response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }
];

module.exports = routes;
