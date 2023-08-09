import { FetchUtil } from '../utils/fetch';

export class RolesController {
	private baseUrl: string; 
	constructor(url: string){
		this.baseUrl = `${url}/roles`;
	}

	async readOne(id: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, id, null);
		return await _fetch.get();
	}

	async readByQuery(query: Record<string,unknown>) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, '', query);
		return await _fetch.get();
	}
}