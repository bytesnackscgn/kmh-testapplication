import path from 'path';
import autoLoad from '@fastify/autoload';
import fastifyCors from '@fastify/cors';

const fastifyPlugin = (fastify, opts, next) => {
	// https://github.com/fastify/fastify-cors
	fastify.register(fastifyCors);
  
	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	fastify.register(autoLoad, {
		dir: path.join(__dirname, 'plugins'),
		options: {},
		//includeTypeScript: true,
	});

	fastify.register(autoLoad,{
		dir: path.join(__dirname, 'routes')
	});
	
	// Make sure to call next when done
	next();
};
  

export default fastifyPlugin;
