import { MongoClient, ObjectId } from 'mongodb';


export const config = ({DB_URL, DB_PORT, DB_NAME, TEST_DB_NAME}) => {

	const notDefinedError = key => `[ERROR] [mongo-curry]: ${key} is required but is not defined`;

	if(!DB_URL)
		throw notDefinedError('DB_URL');
	if(!DB_PORT)
		throw notDefinedError('DB_PORT');
	if(!DB_NAME)
		throw notDefinedError('DB_NAME');
	if(!TEST_DB_NAME)
		throw notDefinedError('TEST_DB_NAME');

	const configOptions = {
		DB_URL,
		DB_PORT,
		DB_NAME,
		TEST_DB_NAME
	};

	Object.keys(configOptions).forEach(key =>
		Object.prototype.hasOwnProperty.call(process.env, key) 
			? console.log(`${key} is already defined in process.env.`) 
			: process.env[key] = configOptions[key]
	);
};



/**
 * Creates a connection to the database and returns the client.
 */
const connectToDB = async () => 
	MongoClient
		.connect(`mongodb://${process.env.DB_URL}:${process.env.DB_PORT}`, { useUnifiedTopology: true})
		.then((client) => client)
		.catch((err) => {
			console.error(err);
			return err;
		});


/**
 * Connects to the specific database you want to use and returns the specific database object
 * @param { object } client - the database client
 * @param {string} dbName - the name of the database ex. 'test'
 */
const useDB = client => async dbName => client.db(dbName);


/**
 * Uses the collection
 * @param { object } db - the specific database object from the client
 * @param { string } collection - the name of the collection
 */
const useCollection = db => async collection => await db.collection(collection);


/**
 * Pings the database to make sure a valid connection has been established
 * @param { boolean } useTestDb - whether or not to use the test database
 * @returns { number } ok - number of ok connections (0 if none, 1 if one, etc.)
 */ 
export const pingDB = async (useTestDb = false) => {
	const client = await connectToDB();
	const db = await useDB(client)(useTestDb ? process.env.TEST_DB_NAME : process.env.DB_NAME);
	const result = await db.command({ping: 1});
	client.close();
	const { ok } = result;
	return ok;
};


/**
 * Runs a request on the database and returns the results
 * @param { boolean } useTestDb - Use the test database or not (safer when running unit tests)
 * Defaults to false.
 * @param { function } request - the request you want to run ex. `insertUser`
 * @param requestParams - the parameters you want to pass to the request function 
 */
export const executeDBRequest = (dbCollection, useTestDb = false) => dbRequest => async (...requestParams) => {
	const client = await connectToDB();
	const db = await useDB(client)(!useTestDb ? process.env.DB_NAME : process.env.TEST_DB_NAME);
	const collection = await useCollection(db)(dbCollection);
	const result = await dbRequest(collection)(...requestParams);
	client.close();
	return result;
};

/**
 * Using an injected MongoDB collection, runs request and returns results
 * 
 * @param { Object } collection - The target database name and collection.
 * @param { function } request - The function request to run ex. `insertItemIntoCollection`.
 * @param requestParams - The parameters to pass to the request function.
 */
export const storageActionOn = (collection) => dbRequest => async (...requestParams) => {
	return await dbRequest(collection)(...requestParams);
};

/**
 * Finds all items in the specified collection
 * @param collection - the collection to use
 */
export const findAllItemsInCollection = collection => async () =>
	await collection.find({}).toArray();


/**
 * Finds a single item in the specified collection by its ID
 * @param collection - the collection to use
 * @param id - the ID of the item
 */
export const findItemByIdInCollection = collection => async id => await collection.findOne({_id: new ObjectId(id)}); 


/**
 * Finds a single item in the specified collection using a custom value object
 * @oaram collection - the collection to use
 * @param valueObject- the key-value object to use ex. {key: value}
 */
export const findItemByValueInCollection = collection => async (valueObject) => await collection.findOne(valueObject);


/**
 * Inserts an item into any collection defined by the user.
 * Usage: `insertItemIntoCollection(collection)(item)`
 * @param {string} collection - the collection to use
 * @param { Function } validation - function to validate the data
 * @param {Object} item - the item to insert
 */
export const insertItemIntoCollection = collection => async (item) => 
	await collection.insertOne(item);

/**
 * Inserts an array of items into the collection defined by the user.
 * @param { string } collection - the collection to use.
 * @param { Function } validation - the function to validate the data.
 * @param { Array } items - the items to insert
 */
export const insertItemsIntoCollection = collection => validation => async (items) => 
	validation(items)
		? await collection.insertMany(items)
		: 'BAD DATA';


/**
 * ========= WIP ===========
 * Updates an item in a collection defined by the user.
 * @param { string } collection - the collection to use.
 * @param { Object } item - the item to update
 */
export const updateItemInCollection = collection => async (item) =>
	await collection.updateOne({_id: item._id}, { $set: item});



/**
 * ========= WIP ===========
 * Updates items in a collection defined by the user.
 * @param { string } collection - the collection to use.
 * @param { Function } validation - the function to validate the data
 * @param { Array } items - the item to update
 */
export const updateItemsInCollection = collection => validation => async (items) => 
	validation(items)
		? await collection.updateMany({}, items)
		: 'BAD DATA';


/**
 * Deletes an item from a collection defined by the user.
 * @param { string } collection - the collection to use.
 * @param { string } itemID - the id of the item to delete.
 * @returns { Object } the result object.
 */
export const deleteItemFromCollection = collection => async (itemID) => 
	await collection.deleteOne({_id: new ObjectId(itemID)});

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
 * DANGER - DO NOT USE OUTSIDE OF TEST SUITES
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Deletes entire collection. NO UNDO. DON'T **** THIS UP JIMMY! Make sure `testDB` is set to `true`
 * @oaram {string} collection - the collection to clear
 */
export const clearCollection = collection => async () => await collection.deleteMany({});

