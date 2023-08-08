import { URL } from 'url';

export function constructURL(baseURL: string, relPath? : string | null, query?: object) : string{
	const url = new URL(baseURL);
	
	if (relPath) {
		if (!relPath.startsWith('/')) {
			relPath = `/${relPath}`;
		}
		url.pathname = `${url.pathname}${relPath}`;
	}

	if(typeof query === 'object'){
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.set(key, value);
		}
	}

	return url.toString();
}