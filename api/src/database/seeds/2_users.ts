import type { Knex } from 'knex';
import type { User } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import argon2 from 'argon2';

const currentDate = new Date();
const yesterday = new Date(currentDate);
yesterday.setDate(yesterday.getDate() - 1);

const users: User[] = [
	{
		id: uuidv4(),
		date_created: yesterday.toISOString(),
		status: 'active',
		first_name: 'Georgij',
		last_name: 'Michel',
		email: 'g.michel@bytesnacks.de',
		password: '',
		role: '',
		provider: 'local',
		permitted_views: {
			cms: [
				'users',
				'posts'
			]
		},
		permitted_actions: {
			users: [
				'create',
				'read',
				'update',
				'delete'
			],
			roles: [
				'create',
				'read',
				'update',
				'delete'
			],
			posts: [
				'create',
				'read',
				'update',
				'delete'
			],
			'invite': [
				'create'
			]
		}
	},
	{
		id: uuidv4(),
		date_created: yesterday.toISOString(),
		status: 'active',
		first_name: 'Editor',
		last_name: 'KMH',
		email: 'editor@bytesnacks.de',
		password: '',
		role: '',
		provider: 'local',
		permitted_views: {
			cms: [
				'users',
				'posts'
			]
		},
		permitted_actions: {
			users: [
				'create',
				'read',
				'update',
				'delete'
			],
			'roles': [
				'read',
			],
			posts: [
				'create',
				'read',
				'update',
				'delete'
			],
			invite: [
				'create'
			]
		}
	},
	{
		id: uuidv4(),
		date_created: yesterday.toISOString(),
		status: 'active',
		first_name: 'Gast',
		last_name: 'KMH',
		email: 'guest@bytesnacks.de',
		password: '',
		role: '',
		provider: 'local',
		permitted_views: {
			cms: [
				'users',
				'posts'
			]
		},
		permitted_actions: {
			users: [
				'read',
			],
			'roles': [
				'read',
			],
			posts: [
				'read'
			],
			invite: []
		}
	},
	{
		id: uuidv4(),
		date_created: yesterday.toISOString(),
		status: 'suspended',
		first_name: 'Suspended Guest',
		last_name: 'KMH',
		email: 'suspended@bytesnacks.de',
		password: '',
		role: '',
		provider: 'local',
		permitted_views: {
			cms: [
				'users',
				'posts'
			]
		},
		permitted_actions: {
			users: [
				'read',
			],
			'roles': [
				'read',
			],
			posts: [
				'read'
			],
			invite: []
		}
	}
];

const passwordList = [
	'Adminpw0908!',
	'Editorpw0908!',
	'Guestpw0908!',
	'Guestpw0908!',
];

export async function seed(knex: Knex): Promise<void> {
	try{
		const roles = await knex('roles').select('*');

		// Hash the passwords for users and assign roles based on index
		const  processedUsers = await Promise.all(users.map(async (user, index) => {
		// Hash the password using argon2
			const hashedPassword = await argon2.hash(passwordList[index]);
	
			// Assign roles based on index
			if (index === 0) {
				user.role = roles.filter(el => el.name === 'admin')[0].id;
			} else if (index === 1) {
				user.role = roles.filter(el => el.name === 'editor')[0].id;
			} else {
				user.role = roles.filter(el => el.name === 'guest')[0].id;
			}
	
			// Assign the hashed password to the user
			user.password = hashedPassword;
	
			return user;
		}));
		await knex('users').insert(processedUsers);
	}catch(e){
		console.warn(e);
	}
}