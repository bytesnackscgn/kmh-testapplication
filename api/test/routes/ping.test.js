import { test }  from 'tap';
import { build } from '../helper';

test('ping route', async (t) => {
	const app = await build(t);

	const res = await app.inject({
		url: '/ping'
	});
	t.same(JSON.parse(res.payload), { message: 'pong' });
});