import type { Knex } from 'knex';
import type { Query, AbstractController, AbstractControllerOptions, Item as AnyItem, Accountability, SchemaOverview } from '../../types';
import type { SQLError } from '../errors/database/dialects/types';
import { FilteringError, /*ForbiddenError,*/ NotFoundItemError } from '../errors/index';
import { translateDatabaseError } from '../errors/database/translate';
import { validateKeys } from '../utils/validate-keys';
//import { AuthController } from '../utils/auth/auth';
import { PayloadUtil } from '../utils/payload';
import { getFilter } from '../utils/filter';

export class ItemsController<Item extends AnyItem = AnyItem> implements AbstractController {
	collection: string;
	knex: Knex;
	accountability: Accountability | null;
	schema: SchemaOverview;

	constructor(collection: string, opts: AbstractControllerOptions) {
		this.collection = collection;
		this.knex = opts.knex;
		this.accountability = opts.accountability || null;
		this.schema = opts.schema;
		return this;
	}

	/**
	 * Create a single new item.
	 */
	async createOne(data: Partial<Item>): Promise<Partial<Item>> {
		const payloadKeys: string[] = Object.keys(data);
		validateKeys(this.schema[this.collection], payloadKeys);

		const newItem: object = await this.knex.transaction(async (trx) => {
			// We're creating new services instances so they can use the transaction as their Knex interface
			const payloadUtil = new PayloadUtil({
				schema: this.schema[this.collection],
				payload: data,
			});

			const payload = payloadUtil.getNormalizedPayload();

			/*
			const AuthController = new AuthController({
				accountability: this.accountability,
				knex: trx,
			});

			if (!AuthController.checkAccess('create', this.collection)) {
				throw new ForbiddenError('creating new Item');
			}
			*/

			try {
				const result = await trx
					.insert(payload)
					.into(this.collection)
					.returning('*')
					.then((result) => result[0]);

				return result;
			} catch (err: unknown) {
				throw await translateDatabaseError(this.knex, err as SQLError);
			}
		});

		return newItem;
	}

	/**
	 * Create multiple new items at once. Inserts all provided records sequentially wrapped in a transaction.
	 * Returns all new items
	 */
	async createMany(data: Partial<Item>[]): Promise<Partial<Item>[]> {
		const newItems = await this.knex.transaction(async (trx) => {
			const items: Partial<Item>[] = [];

			for (const payload of data) {
				const newItem = await this.createOne(payload);
				items[items.length] = newItem;
			}

			return items;
		});

		return await newItems;
	}

	/**
	 * Get items by query
	 */
	async readByQuery(query: Query): Promise<Partial<Item>[]> {
		const items: Partial<Item>[] = await this.knex.transaction(async (trx) => {
			let knexQuery = trx(this.collection);

			// Select specific fields if provided
			if (query.fields && Array.isArray(query.fields)) {
				knexQuery = knexQuery.select(query.fields);
			}

			// Apply filter if provided
			if (query.filter && typeof query.filter === 'object') {
				const { _and, _or, ...filters } = query.filter;

				// Apply regular filters
				for (const key in filters) {
					if (Object.prototype.hasOwnProperty.call(filters, key)) {
						const value = filters[key];
						if (typeof value === 'object' && !Array.isArray(value)) {
							for (const operator in value) {
								if (Object.prototype.hasOwnProperty.call(value, operator)) {
									const filterFn = getFilter(key, operator, value[operator]);
									if (filterFn) {
										knexQuery = filterFn(knexQuery);
									}
								}
							}
						} else {
							knexQuery = knexQuery.where(key, value);
						}
					}
				}

				// Apply logical operators '_and' and '_or'
				if (_and && Array.isArray(_and) && _and.length > 0) {
					for (const andFilter of _and) {
						for (const key in andFilter) {
							if (Object.prototype.hasOwnProperty.call(andFilter, key)) {
								const value = andFilter[key];
								if (typeof value === 'object' && !Array.isArray(value)) {
									for (const operator in value) {
										if (Object.prototype.hasOwnProperty.call(value, operator)) {
											const filterFn = getFilter(key, operator, value[operator]);
											if (filterFn) {
												knexQuery = filterFn(knexQuery);
											}
										}
									}
								} else {
									knexQuery = knexQuery.andWhere(key, value);
								}
							}
						}
					}
				}

				if (_or && Array.isArray(_or) && _or.length > 0) {
					for (const orFilter of _or) {
						for (const key in orFilter) {
							if (Object.prototype.hasOwnProperty.call(orFilter, key)) {
								const value = orFilter[key];
								if (typeof value === 'object' && !Array.isArray(value)) {
									for (const operator in value) {
										if (Object.prototype.hasOwnProperty.call(value, operator)) {
											const filterFn = getFilter(key, operator, value[operator]);
											if (filterFn) {
												knexQuery = filterFn(knexQuery);
											}
										}
									}
								} else {
									knexQuery = knexQuery.orWhere(key, value);
								}
							}
						}
					}
				}
			}


			// Apply filter if provided
			/*if (query.filter && typeof query.filter === 'object') {
				for (const key in query.filter) {
					if (Object.prototype.hasOwnProperty.call(query.filter, key)) {
						const value = query.filter[key];
						if (typeof value === 'object' && !Array.isArray(value)) {
							for (const operator in value) {
								if (Object.prototype.hasOwnProperty.call(value, operator)) {
									const filterFn = getFilter(key, operator, value[operator]);
									if (filterFn) {
										knexQuery = filterFn(knexQuery);
									}
								}
							}
						} else {
							knexQuery = knexQuery.where(key, value);
						}
					}
				}

				// Handle logical operators '_and' and '_or'
				if ('_and' in query.filter || '_or' in query.filter) {
					const andFilters = query.filter._and || [];
					const orFilters = query.filter._or || [];
					const combinedFilters = [];

					if (andFilters.length > 0) {
						combinedFilters[combinedFilters.length] = { _and: andFilters };
					}

					if (orFilters.length > 0) {
						combinedFilters[combinedFilters.length] = { _or: orFilters };
					}

					const combinedFilter = {
						[query.filter._and ? '_and' : '_or']: combinedFilters,
					};

					const filterFn = getFilter(null, Object.keys(combinedFilter)[0], combinedFilter[Object.keys(combinedFilter)[0]]);
					if (filterFn) {
						knexQuery = filterFn(knexQuery);
					}
				}
			}*/

			// Apply sorting if provided
			if (query.sort && typeof query.sort === 'string') {
				const sortOrder = query.sort.startsWith('-') ? 'desc' : 'asc';
				const sortField = query.sort.replace(/^-/, '');
				knexQuery = knexQuery.orderBy(sortField, sortOrder);
			}

			// Apply limit if provided
			if (query.limit && Number.isInteger(query.limit) && query.limit > 0) {
				knexQuery = knexQuery.limit(query.limit);
			}

			// Execute the query and return the result
			const result = await knexQuery;

			return result;
		});

		return items;
	}

	/**
	 * Get single item by primary key
	 */
	async readOne(id: string, query: Query = {}): Promise<Partial<Item | undefined>> {
		query.filter = {
			id: {
				_eq: id
			}
		};

		const results: Partial<Item>[] = await this.knex.transaction(async (trx) => {
			const knexQuery = trx(this.collection);
			knexQuery.select('*').where('id',id);
			return await knexQuery;
		});
		
		if (results.length === 1) {
			return results[0];
		}

		if (results.length === 0) {
			throw new NotFoundItemError(this.collection, id);
		}

		if (results.length > 1) {
			throw new FilteringError(this.collection, id);
		}
	}

	/**
	 * Update a single item by primary key
	 */
	async updateOne(data: Partial<Item>): Promise<Partial<Item>> {
		const payloadKeys: string[] = Object.keys(data);
		validateKeys(this.schema[this.collection], payloadKeys, true);

		const updatedItem: object = await this.knex.transaction(async (trx) => {
			const payloadUtil = new PayloadUtil({
				schema: this.schema[this.collection],
				payload: data,
			});

			const payload = payloadUtil.getNormalizedPayload();

			/*const AuthController = new AuthController({
				accountability: this.accountability,
				knex: trx,
			});

			if (!AuthController.checkAccess('update', this.collection, payloadUtil.primaryKeyValue)) {
				throw new ForbiddenError('updating Item');
			}*/

			try {
				const result = await trx(this.collection)
					.update(payload)
					.where(this.schema[this.collection].primary, payloadUtil.primaryKeyValue as string)
					.returning('*')
					.then((result) => result[0]);

				return result;
			} catch (err: unknown) {
				throw await translateDatabaseError(this.knex, err as SQLError);
			}
		});

		return updatedItem;
	}

	/**
	 * Update many items
	 */
	async updateMany(data: Partial<Item>[]): Promise<Partial<Item>[]> {
		const updatedItems: Partial<Item>[] = await this.knex.transaction(async (trx) => {
			/*
			const controller = new ItemsController(this.collection, {
				accountability: this.accountability,
				schema: this.schema,
				knex: trx,
			});
			*/

			const items: Partial<Item>[] = [];

			for (const payload of data) {
				const newItem = await this.updateOne(payload);
				items[items.length] = newItem;
			}

			return items;
		});

		return await updatedItems;
	}

	/**
	 * Delete a single item by primary key
	 */
	async deleteOne(id: string): Promise<string> {
		/*
		const AuthController = new AuthController({
			accountability: this.accountability,
			schema: this.schema,
			knex: this.knex,
		});

		await AuthController.checkAccess('delete', this.collection, id);
		*/

		const primaryKey = this.schema[this.collection].primary;

		await this.knex.transaction(async (trx) => {
			await trx(this.collection).where(primaryKey, id).del();
		});

		return id;
	}

	/**
	 * Delete multiple items by primary key
	 */
	async deleteMany(ids: string[]): Promise<string[]> {
		/*
		const AuthController = new AuthController({
			accountability: this.accountability,
			schema: this.schema,
			knex: this.knex,
		});

		await AuthController.checkAccess('delete', this.collection, ids);
		*/

		const primaryKey = this.schema[this.collection].primary;

		await this.knex.transaction(async (trx) => {
			await trx(this.collection).whereIn(primaryKey, ids).del();
		});

		return ids;
	}
}
