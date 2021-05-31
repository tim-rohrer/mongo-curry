import { describe } from 'riteway';
import { config, pingDB } from './mongo-curry';

config({
	DB_URL: 'localhost',
	DB_PORT: 27017,
	DB_NAME: 'mongo-curry',
	TEST_DB_NAME: 'mongo-curry-test',
});



describe('pingDB', async assert => {
		
	assert({
		given: 'database connection',
		should: 'return OK ping',
		expected: 1,
		actual: (await pingDB(true))
	});
});
