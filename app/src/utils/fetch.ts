export class FetchUtil {
	private baseUrl: string;
	private path: string | unknown;
	private payload?: Record<string, unknown> | null;
	private token?: string;
  
	constructor(baseUrl: string,path?: string, payload?: Record<string, unknown> | null, token?: string) {
	  this.baseUrl = baseUrl;
	  this.path = path;
	  this.payload = payload;
	  this.token = token;
	}
  
	setToken(token: string): void {
	  this.token = token;
	}
  
	setPayload(payload: Record<string, unknown>): void {
	  this.payload = payload;
	}
  
	setURL(baseUrl: string): void {
	  this.baseUrl = baseUrl;
	}
  
	setPath(path: string): void {
	  if (path === '/' || path === '') {
		this.path = '';
	  } else {
		this.path = path.startsWith('/') ? path : `/${path}`;
	  }
	}
  
	private async fetchData(method: string): Promise<unknown> {
	  const url = this.path ? `${this.baseUrl}${this.path}` : this.baseUrl;
	  const headers = new Headers();

	  if (this.token) {
		headers.append('Authorization', `Bearer ${this.token}`);
	  }
  
	  const requestOptions: RequestInit = {
		method,
		headers,
	  };
  
	  if (this.payload) {
		if (method === 'GET') {
		  const queryParams = new URLSearchParams(this.payload as Record<string, any>);
		  this.baseUrl += `?${queryParams}`;
		} else {
		  headers.append('Content-Type', 'application/json');
		  requestOptions.body = JSON.stringify(this.payload);
		}
	  }
  
	  const response = await fetch(this.baseUrl, requestOptions);
	  const data = await response.json();
	  return data;
	}
  
	async get(): Promise<unknown> {
	  return this.fetchData('GET');
	}
  
	async post(): Promise<unknown> {
	  return this.fetchData('POST');
	}
  
	async patch(): Promise<unknown> {
	  return this.fetchData('PATCH');
	}
  
	async delete(): Promise<unknown> {
	  return this.fetchData('DELETE');
	}
  }