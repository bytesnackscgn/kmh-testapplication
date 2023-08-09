import { AuthController } from './auth';
import { PostsController } from './posts';
import { RolesController } from './roles';
import { UsersController } from './users';

export class CMS {
	auth;
	posts;
	roles;
	users;

	constructor(url: string){
		this.auth = new AuthController(url);
		this.posts = new PostsController(url);
		this.roles = new RolesController(url);
		this.users = new UsersController(url);
	}
}