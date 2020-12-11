// Import App Options
const conf = require("./config/dev");

// Setup logger
const log = require("./logger")();

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  logger: log,
  maxParamLength: 50,
  onProtoPoisoning: "remove"
});

// Set rate limiting
fastify.register(require('fastify-rate-limit'), conf.RATE_LIMITING);

// Swagger
fastify.register(require('fastify-swagger'), {
  routePrefix: '/documentation',
  swagger: {
    basePath: `:${conf.PORT}`,
    info: {
      title: 'API Docs',
      description: 'Testing API using Swagger'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    // schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
})

// Import Routes
const routes = require("./routes");

// Loop over each route
routes.forEach((route, index) => {
  fastify.route(route);
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(conf.PORT, "127.0.0.1");
    log.info(`server listening on ${fastify.server.address().port}`);
    console.log(`In your browser navigate to: http://127.0.0.1:3000/documentation`)
  } catch (err) {
    log.error(err);
    console.log(`Error listening on port ${conf.PORT}`)
    if (err.code === "EADDRINUSE")
      console.log(`Port ${conf.PORT} is being used by another application. Modify port in config/dev.js and re-lauch`)
    else
      console.log(`${JSON.stringify(err)}`);
    process.exit(1);
  }
};
start();
