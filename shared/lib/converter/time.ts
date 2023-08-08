import { NoInputError } from '../errors'

export function secondsToMs(val: string | number ) : number {
	if(!val || typeof val === 'undefined'){
		throw new NoInputError();
	}
	
	if (typeof val !== 'number') {
		val = Number.parseInt(val);
	}

	return val * 1000;
}