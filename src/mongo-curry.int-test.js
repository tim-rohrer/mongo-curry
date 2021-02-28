import { describe } from 'riteway';
import { pingDB } from './mongo-curry';

describe('pingDB', async assert => {
	
	assert({
		given: 'database connection',
		should: 'return OK ping',
		expected: 1,
		actual: (await pingDB(true))
	});
});
