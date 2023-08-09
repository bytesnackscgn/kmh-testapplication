import { FetchUtil } from '../utils/fetch';

export class AuthController {
	private _token  = '';
	baseUrl: string;
	constructor(url: string){
		this.baseUrl = `${url}/auth`;
	}

	async static(token: string){
		this._token = token;
	}

	async login(email: string, password: string) : Promise<unknown>{
		const _fetch = new FetchUtil(this.baseUrl, '/login', {
			email,
			password
		});
		return await _fetch.post();
	}

	async logout(refresh_token: string ): Promise<unknown>{
		const _fetch = new FetchUtil(this.baseUrl, '/logout', {
			refresh_token
		});
		return await _fetch.post();
	}

	getToken(): string {
		return this._token;
	}

	async resetPassword(reset_token: string, password: string) : Promise<unknown>{
		const _fetch = new FetchUtil(this.baseUrl, '/password/reset', {
			token: reset_token,
			password
		});
		return await _fetch.post();
	}

	async requestPassword(email: string, reset_url: string) : Promise<unknown>{
		const _fetch = new FetchUtil(this.baseUrl, '/password/request', {
			email,
			reset_url
		});
		return await _fetch.post();
	}
}