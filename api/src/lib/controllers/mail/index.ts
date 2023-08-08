import type { SendMailOptions, Transporter } from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { Liquid } from 'liquidjs';
import { env } from '../../../config/env';
import { InvalidPayloadError } from '../../errors';
import { getMailer } from './mailer';
import { constructURL } from '../../utils/url';
import { pathExists } from '../../utils/fs';

const liquidEngine = new Liquid({
	root: [path.resolve(__dirname, 'templates')],
	extname: '.liquid',
});

export type EmailOptions = SendMailOptions & {
	template?: {
		name: string;
		data: Record<string, unknown>;
	};
};

export class MailUtil {
	mailer: Transporter;

	constructor() {
		this.mailer = getMailer();
	}

	async send<T>(options: EmailOptions): Promise<T> {
		const { template, ...emailOptions } = options;
		let { html } = options;

		const defaultTemplateData = await this.getDefaultTemplateData();

		const from = `${env.API_EMAIL_FROM_NAME} <${options.from || (env.API_EMAIL_FROM_EMAIL)}>`;

		if (template) {
			let templateData = template.data;

			templateData = {
				...defaultTemplateData,
				...templateData,
			};

			html = await this.renderTemplate(template.name, templateData);
		}

		if (typeof html === 'string') {
			html = html
				.split('\n')
				.map((line) => line.trim())
				.join('\n');
		}

		const info = await this.mailer.sendMail({ ...emailOptions, from, html });
		return info;
	}

	private async renderTemplate(template: string, variables: Record<string, unknown>) {
		const systemTemplatePath = path.join(__dirname, 'templates', `${template}.liquid`);

		if (await pathExists(systemTemplatePath) === false) {
			throw new InvalidPayloadError(`Template "${template}" doesn't exist`);
		}

		const templateString = await fs.promises.readFile(systemTemplatePath, 'utf8');
		const html = await liquidEngine.parseAndRender(templateString, variables);

		return html;
	}

	private async getDefaultTemplateData() {
		return {
			projectName: env.APP_NAME,
			projectColor: env.APP_PRIMARY_COLOR,
			projectLogo: constructURL(env.APP_PUBLIC_URL,'img/brand.png'),
			projectUrl: env.APP_PUBLIC_URL,
		};
	}
}
