import { FetchUtil } from '../utils/fetch';

export class PostsController {
	private baseUrl: string; 
	constructor(url: string){
		this.baseUrl = `${url}/posts`;
	}

	async createOne(payload: Record<string,unknown>, token: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, '', payload, token);
		return await _fetch.post();
	}

	async readOne(id: string, token: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, id, null, token);
		return await _fetch.get();
	}

	async readByQuery(query: Record<string,unknown>, token: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, '', query, token);
		return await _fetch.get();
	}

	async deleteOne(id: string, token: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, id, null, token);
		return await _fetch.delete();
	}
}