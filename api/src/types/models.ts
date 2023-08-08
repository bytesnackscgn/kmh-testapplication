import type { Item } from './common';
import type { Query } from './query';
import type { Knex } from 'knex';
import type { Accountability } from './accountabillity';
import type { SchemaOverview } from './schema';

export type AbstractControllerOptions = {
	knex?: Knex;
	accountability?: Accountability | null | undefined;
	schema?: SchemaOverview;
};

export interface AbstractController {
	//knex: Knex;
	//accountability: Accountability | null | undefined;
	createOne(data: Partial<Item>): Promise<Partial<Item>>;
	createMany(data: Partial<Item>[]): Promise<Partial<Item>[]>;

	readOne(key: string, query?: Query): Promise<Partial<Item>>;
	readByQuery(query: Query): Promise<Partial<Item>[]>;

	updateOne(data: Partial<Item>): Promise<Partial<Item>>;
	updateMany(data: Partial<Item>[]): Promise<Partial<Item>[]>;

	deleteOne(key: string): Promise<string>;
	deleteMany(keys: string[]): Promise<string[]>;
}