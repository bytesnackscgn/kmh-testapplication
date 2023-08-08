
import type { AuthDriverOptions } from '../../../types';
import type { AuthDriver } from './driver/authdriver';
import { LocalAuthDriver } from './driver/local';
import { InvalidProviderError } from '../../errors';
import { logger } from '../../../config/fastify';

export function getAuthProvider(provider: string): AuthDriver | null {
	const _provider : AuthDriver | null  = getProviderInstance(provider);

	if (_provider) {
		logger.error('Auth provider not configured');
		throw new InvalidProviderError();
	}
	
	return _provider;
}

function getProviderInstance(driver: string, options?: AuthDriverOptions): AuthDriver | null {
	switch (driver) {
	case 'local':
		return new LocalAuthDriver(options);
	}

	return null;
}
