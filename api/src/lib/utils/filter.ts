import { filterOperator } from '../constants/filter';

export function getFilter(key, operator, value) {
	if (operator in filterOperator) {
		const _filterOperator = filterOperator[operator];
		switch (operator) {
		case '_in':
		case '_nin':
			return (query) => query.where(key, _filterOperator, value);
		case '_between':
		case '_nbetween':
			return (query) => query.whereBetween(key, value);
		case '_intersects':
		case '_nintersects':
			return (query) => query.whereRaw(`${key} ${_filterOperator} ?`, [value]);
		default:
			return (query) => query.where(key, _filterOperator, value);
		}
	}
	return null;
}