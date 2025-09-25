const rammerheadScopes = [ "/rammerhead.js", "/hammerhead.js", "/transport-worker.js", "/task.js", "/iframe-task.js", "/worker-hammerhead.js", "/messaging", "/sessionexists", "/deletesession", "/newsession", "/editsession", "/needpassword", "/syncLocalStorage", "/api/shuffleDict", "/mainport" ];
const rammerheadSession = /^\/[a-z0-9]{32}/;
const { createServer } = require('http');
const createRammerhead = require('./src/server/index.js');
const rh = createRammerhead()
function shouldRouteRh(req) {
  const url = new URL(req.url, "http://0.0.0.0");
    console.log(url.pathname);
  return (rammerheadScopes.includes(url.pathname) || rammerheadSession.test(url.pathname));
}
function routeRhRequest(req, res) { rh.emit("request", req, res) }
function routeRhUpgrade(req, socket, head) { rh.emit("upgrade", req, socket, head) }

const proxyHandler = (handler, opts) => {
    return createServer().on('request', (req, res) => {
        if (shouldRouteRh(req)) {
            routeRhRequest(req, res);
        }
        else {
            handler(req, res);
        }
    })
    .on('upgrade', (req, socket, head) => {
        if (shouldRouteRh(req)) {
            routeRhUpgrade(req, socket, head);
        }
    });
};

const fastify = require('fastify')({
  logger: false,
  serverFactory: proxyHandler
})

fastify.get('/', (request, reply) => {
  reply.send({health: "ok"})
});

console.log(`Server started on port ${process.env.PORT || 3000}`)
fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
