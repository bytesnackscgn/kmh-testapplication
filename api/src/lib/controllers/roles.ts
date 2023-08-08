import type { Query, AbstractControllerOptions, Item} from '../../types';
import { ItemsController } from './items';

export class RolesController extends ItemsController {
	constructor(opts: AbstractControllerOptions) {
		super('roles', opts);
	}

	/**
	 * Create a single new item.
	 */
	override async createOne(data: Partial<Item>): Promise<Partial<Item>> {
		return await super.createOne(data);
	}

	/**
	 * Create multiple new items at once. Inserts all provided records sequentially wrapped in a transaction.
	 * Returns all new items
	 */
	override async createMany(data: Partial<Item>[]): Promise<Partial<Item>[]> {
		return await super.createMany(data);
	}

	/**
	 * Get single item by primary key
	 */
	async readOne(id: string, query: Query = {}): Promise<Partial<Item | undefined>> {
		return await super.readOne(id, query);
	}

	/**
	 * Update a single item by primary key
	 */
	async updateOne(data: Partial<Item>): Promise<Partial<Item>> {
		return await super.updateOne(data);
	}

	/**
	 * Update many items should not be supported
	 */
	override async updateMany(data: Partial<Item>[]): Promise<Partial<Item>[]> {
		return await super.updateMany(data);
	}

	/**
	 * Delete a single item by primary key
	 */
	async deleteOne(id: string): Promise<string> {
		return await super.deleteOne(id);
	}

	/**
	 * Delete multiple items by primary key
	 */
	async deleteMany(ids: string[]): Promise<string[]> {
		return await super.deleteMany(ids);
	}
}