import { UsersController } from '../../lib/controllers/users';
import type { Item } from '../../types';

module.exports = async function (fastify, opts) {
	fastify.post('/ ', async function (req, res) {
		const isBodyArray = Array.isArray(req.body);

		const controller = new UsersController({
			knex: fastify.knex,
			schema: fastify.schema,
		});

		const processedItems: Item[] = [];

		if (isBodyArray) {
			const _processedItems = await controller.createMany(req.body);
			processedItems.push(..._processedItems);
		} else {
			const newItem = await controller.createOne(req.body);
			processedItems.push(newItem);
		}

		res.send({ 
			data: processedItems
		});
	});

	fastify.get('/ ', async function (req, res) {
		const controller = new UsersController({
			knex: fastify.knex,
			schema: fastify.schema,
		});

		const queriedItems = await controller.readByQuery(req.query);

		res.send({
			data: queriedItems || null
		});
	});

	fastify.get('/:id ', async function (req, res) {
		const controller = new UsersController({
			knex: fastify.knex,
			schema: fastify.schema,
		});

		const processedItem = await controller.readOne(req.params['id'], req.query);

		res.send({
			data: processedItem || null,
		});
	});

	fastify.patch('/ ', async function (req, res){
		const isBodyArray = Array.isArray(req.body);

		const controller = new UsersController({
			knex: fastify.knex,
			schema: fastify.schema,
		});

		const processedItems: Item[] = [];

		if (isBodyArray) {
			const _processedItems = await controller.updateMany(req.body);
			processedItems.push(..._processedItems);
		} else {
			const processedItem = await controller.updateOne(req.body);
			processedItems.push(processedItem);
		}

		res.send({ 
			data: processedItems
		});
	});

	fastify.patch('/:id ', async function (req, res){
		const controller = new UsersController({
			knex: fastify.knex,
			schema: fastify.schema,
		});

		const processedItem = await controller.updateOne(req.body);

		res.send({ 
			data: processedItem || null 
		});
	});

	fastify.delete('/', async function (req, res){
		const controller = new UsersController({
			knex: fastify.knex,
			schema: fastify.schema,
		});

		const isBodyArray = Array.isArray(req.body);

		const processedIds: string[] = [];

		if (isBodyArray) {
			const _processedIds = await controller.deleteMany(req.body);
			processedIds.push(..._processedIds);
		} else {
			const processedId = await controller.deleteOne(req.body);
			processedIds.push(processedId);
		}

		res.send({ 
			data: processedIds
		});
	});

	fastify.delete('/:id ', async function (req, res){
		const controller = new UsersController({
			knex: fastify.knex,
			schema: fastify.schema,
		});

		const processedId = await controller.deleteOne(req.params['id']);

		res.send({
			data: [ processedId ]
		});
	});
};