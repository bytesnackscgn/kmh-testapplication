import type { Knex } from 'knex';
import type { Post } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const users: Post[] = [];

export async function seed(knex: Knex): Promise<void> {
	const userIds = await knex('users').select('id');

	const posts: Post[] = [];
  
	for (let i = 0; i < 100; i++) {
		const currentDate = new Date();
		const yesterday = new Date(currentDate);
		yesterday.setDate(yesterday.getDate() - 1);
  
		const randomUserIndex = Math.floor(Math.random() * userIds.length);
		const randomUser = userIds[randomUserIndex];
  
		const item = {
			id: uuidv4(),
			date_created: yesterday.toISOString(),
			date_updated: currentDate.toISOString(),
			user_created: randomUser.id,
			user_updated: randomUser.id,
			title: faker.lorem.sentence(),
			meta_title: faker.lorem.sentence(3),
			meta_description: faker.lorem.sentences(1),
			excerpt: faker.lorem.sentences(5), // Max 1 paragraph
			content: faker.lorem.sentences(10), // 3 paragraphs of content
		};
  
		users.push(item);
	}
  
	await knex('posts').insert(posts);
}