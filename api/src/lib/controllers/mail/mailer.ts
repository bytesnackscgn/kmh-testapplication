import type { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';
import { env } from '../../../config/env';
import { NotMaintainedTransporterError } from '../../errors';

export function getMailer(): Transporter {
	let transporter: Transporter;
	const transportType = env.API_EMAIL_TRANSPORT;

	if (transportType === 'sendmail') {
		transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: env.API_EMAIL_SENDMAIL_PATH,
		});
	} else if (transportType === 'smtp') {
		let auth: boolean | { user?: string; pass?: string } = false;

		if (env?.API_SMTP_USER || env?.API_SMTP_PASSWORD) {
			auth = {
				user: env.API_SMTP_USER,
				pass: env.API_SMTP_PASSWORD,
			};
		}

		transporter = nodemailer.createTransport({
			host: env.API_SMTP_HOST,
			port: env.API_SMTP_PORT,
			secure: env.API_SMTP_SECURE,
			ignoreTLS: env.API_SMTP_IGNORE_TLS,
			auth
		} as Record<string, unknown>);
	} else {
		throw new NotMaintainedTransporterError();
	}

	return transporter;
}
