export function isUUID(uuid: string): boolean {
	if(!uuid) return false;
	const pattern = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
	return pattern.test(uuid);
}

export function isEmpty(value: unknown) : boolean {
	if (typeof value === 'undefined' || value == null) {
		return true;
	}
	
	if (Array.isArray(value) || typeof value === 'string') {
		return value.length === 0;
	}
	
	if (typeof value === 'object') {
		return Object.keys(value).length === 0;
	}
	
	return false;
}