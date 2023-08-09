import { Knex } from 'knex';
import { Role } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const roles: Role[] = [
	{
		id: uuidv4(),
		name: 'admin',
	},
	{
		id: uuidv4(),
		name: 'editor',
	},
	{
		id: uuidv4(),
		name: 'guest',
	},
];

export async function seed(knex: Knex): Promise<void> {
	try{	
		await knex('roles').insert(roles);
	}catch(e){
		console.warn(e);
	}
}