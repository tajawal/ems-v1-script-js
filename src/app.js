const cors = require('cors');
const { config } = require('./helper/config');
const { v1RoutesMiddleware } = require('./routes');
const { handleExit, handleUncaughtErrors } = require('./helper/fatal');

const fastifyOpts   = config.get('fastify', {});
const fastifyConfig = typeof fastifyOpts === 'string' ? JSON.parse(fastifyOpts) : fastifyOpts;
const fastify       = require('fastify')(fastifyConfig);

// Export fastify for later reference
module.exports = fastify;

(async function() {
    try {

        handleExit();
        handleUncaughtErrors();


        // Middlewares
        fastify.use(cors());
        // Endpoints to monitor server

        fastify.get('/ping', (req,res)=>{
            res.send('ok');
        })

        fastify.get('/health', (req,res)=>{
            res.send('200');
        })

        
        // Plugins
        fastify.register(v1RoutesMiddleware, { prefix: '/v1' });

        // Server
        await fastify.listen(config.get('API_HTTP_PORT', 80), '0.0.0.0');
        fastify.log.info(
            '%s listening in %s environment',
            config.name,
            process.env.NODE_ENV
        );
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();
