// Import App Options
const conf = require("./config/dev");

// Setup logger
// const log = require("./logger")();

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // logger: log,
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
    fastify.listen({
      port: process.env.PORT || conf.PORT,
      host: '0.0.0.0'
    }, function (err, addr) {
      if (err) throw err;
      console.log(`In your browser navigate to ${addr}/documentation`)
    });
    // log.info(`server listening on ${fastify.server.address().port}`);

  } catch (err) {
    // log.error(err);
    console.log(`Error listening on port ${process.env.PORT || conf.PORT}`)
    if (err.code === "EADDRINUSE")
      console.log(`Port ${conf.PORT} is being used by another application. Modify port in config/dev.js and re-lauch`)
    else
      console.log(`${JSON.stringify(err)}`);
    process.exit(1);
  }
};
start();
