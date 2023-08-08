import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { InvalidTokenError, ServiceUnavailableError, ExpiredError } from '../../errors';
import type { TokenPayload } from '../../../types';

export function verifyJWT(token: string, secret: string): Record<string, unknown> {
	let payload;

	try {
		payload = jwt.verify(token, secret, {
			issuer: env.API_JWT_ISSUER,
		}) as Record<string, string | unknown>;
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			throw new ExpiredError('JWT-Token');
		} else if (err instanceof jwt.JsonWebTokenError) {
			throw new InvalidTokenError();
		} else {
			throw new ServiceUnavailableError('jwt', 'Could not verify token');
		}
	}

	return payload;
}

export function verifyAccessJWT(token: string, secret: string): TokenPayload {
	const { id, role, permitted_views, permitted_actions} = verifyJWT(token, secret);
	
	if (!role || !permitted_views || !permitted_actions) {
		throw new InvalidTokenError();
	}

	return { id, role, permitted_views, permitted_actions  };
}