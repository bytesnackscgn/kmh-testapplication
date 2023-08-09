import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('roles', (table) => {
		table.uuid('id').primary();
		table.string('name');
		table.unique('name');
	});

	await knex.schema.createTable('users', (table) => {
		table.uuid('id').primary();
		table.timestamp('date_created', { precision: 6 }).defaultTo(knex.fn.now(6));
		table.string('status');
		table.string('first_name');
		table.string('last_name');
		table.string('email');
		table.unique('email');
		table.string('password');
		table.uuid('role').references('id').inTable('roles'); // Add foreign key reference
		table.string('provider');
		table.string('token');
		table.string('password_reset_token');
		table.json('permitted_views');
		table.json('permitted_actions');
	});

	await knex.schema.createTable('posts', (table) => {
		table.uuid('id').primary();
		table.timestamp('date_created', { precision: 6 }).defaultTo(knex.fn.now(6));
		table.timestamp('date_updated', { precision: 6 });
		table.uuid('user_created').references('id').inTable('users'); // Add foreign key reference
		table.uuid('user_updated').references('id').inTable('users'); // Add foreign key reference
		table.string('title');
		table.string('meta_title', 60);
		table.string('meta_description', 155);
		table.string('excerpt', 512);
		table.text('content');
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('posts');
	await knex.schema.dropTableIfExists('users');
	await knex.schema.dropTableIfExists('roles');
}