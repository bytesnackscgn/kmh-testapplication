import type { Schema } from '../../types';

export type PayloadUtilOptions = {
	schema?: Schema,
	payload?: object
}

export class PayloadUtil {
	primaryKeyValue: string;
	schema: Schema;
	payload: object = {};
	private _normalizedPayload: object = {};

	constructor(opts: PayloadUtilOptions) {
		this.schema = opts.schema as Schema;
		this.payload = opts.payload as object;

		const _primaryKeyValue = this.payload[this.schema.primary];
		if (_primaryKeyValue) {
			this.primaryKeyValue = _primaryKeyValue;
		}

		this.setNormalizedPayload(this.payload);
	}

	private setNormalizedPayload(payload: object, currentPath: string = ''): void {
		for (const key in payload) {
			if (Object.prototype.hasOwnProperty.call(payload, key)) {
				const field = this.schema.fields[key];
				const value = payload[key];

				const fullPath = currentPath ? `${currentPath}.${key}` : key;

				if (field && typeof field === 'object') {
					if (field.type === 'boolean') {
						this.setValue(fullPath, value == 1 || value === 'true' || value === '1' );
					} else if (field.type === 'integer') {
						this.setValue(fullPath, Number.parseInt(value));
					} else if (field.type === 'float') {
						this.setValue(fullPath, Number.parseFloat(value));
					} else if (field.type === 'string') {
						this.setValue(fullPath, String(value));
					} else if (field.type === 'json') {
						this.setValue(fullPath, String(value));
					}else if (field.type === 'object' || field.type === 'json') {
						this.setValue(fullPath, JSON.stringify(value));
						//this.setNormalizedPayload(value, fullPath);
					} else {
						this.setValue(fullPath, value);
					}
				} else {
					this.setValue(fullPath, value);
				}
			}
		}
	}

	private setValue(path: string, value: unknown): void {
		const keys = path.split('');
		let target = this._normalizedPayload;

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			if (!target[key]) {
				target[key] = {};
			}
			target = target[key];
		}

		target[keys[keys.length - 1]] = value;
	}

	public getNormalizedPayload(): object {
		return this._normalizedPayload;
	}
}
