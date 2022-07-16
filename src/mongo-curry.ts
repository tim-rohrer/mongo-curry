import * as MongoDB from 'mongodb';

export const config = ({DB_URL, DB_PORT, DB_NAME, TEST_DB_NAME}) => {

	const notDefinedError = (key: string) => `[ERROR] [mongo-curry]: ${key} is required but is not defined`;

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
export const connectToDB = async () => 
	MongoDB.MongoClient
		.connect(`mongodb://${process.env.DB_URL}:${process.env.DB_PORT}`)
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
export const useDB = (client: MongoDB.MongoClient) => async (dbName: string) => client.db(dbName);


/**
 * Uses the collection
 * @param { object } db - the specific database object from the client
 * @param { string } collectionName - the name of the collection
 */
export const useCollection = (db: MongoDB.Db) => (collectionName: string) => db.collection(collectionName);


/**
 * Finds all items in the specified collection
 * @param collection - the collection to use
 */
export const findAllItemsInCollection = (collection: MongoDB.Collection) => async () =>
	await collection.find({}).toArray();


/**
 * Finds a single item in the specified collection by its ID
 * @param collection - the collection to use
 * @param id - the ID of the item
 */
export const findItemByIdInCollection = (collection: MongoDB.Collection) => async (id: MongoDB.ObjectId) => await collection.findOne({_id: new MongoDB.ObjectId(id)}); 


/**
 * Finds a single item in the specified collection using a custom value object
 * @oaram collection - the collection to use
 * @param valueObject- the key-value object to use ex. {key: value}
 */
export const findItemByValueInCollection = (collection: MongoDB.Collection) => async (valueObject: Record<string, any>) => await collection.findOne(valueObject);


/**
 * Inserts an item into any collection defined by the user.
 * Usage: `insertItemIntoCollection(collection)(item)`
 * @param { MongoDB.Collection } collection - the collection to use
 * @param { Function } validation - function to validate the data
 * @param { Record<string, any> } item - the item to insert
 */
export const insertItemIntoCollection = (collection: MongoDB.Collection) => async (item: Record<string, any>) => 
	await collection.insertOne(item);

/**
 * Inserts an array of items into the collection defined by the user.
 * @param { MongoDB.Collection } collection - the collection to use.
 * @param { Function } validation - the function to validate the data.
 * @param { Array } items - the items to insert
 */
export const insertItemsIntoCollection = (collection: MongoDB.Collection) => (validation: Function) => async (items) => 
	validation(items)
		? await collection.insertMany(items)
		: 'BAD DATA';


/**
 * ========= WIP ===========
 * Updates an item in a collection defined by the user.
 * @param { MongoDB.Collection } collection - the collection to use.
 * @param { Object } item - the item to update
 */
export const updateItemInCollection = (collection: MongoDB.Collection) => async (item) =>
	await collection.updateOne({_id: item._id}, { $set: item});



/**
 * ========= WIP ===========
 * Updates items in a collection defined by the user.
 * @param { MongoDB.Collection } collection - the collection to use.
 * @param { Function } validation - the function to validate the data
 * @param { Array } items - the item to update
 */
export const updateItemsInCollection = (collection: MongoDB.Collection) => validation => async (items) => 
	validation(items)
		? await collection.updateMany({}, items)
		: 'BAD DATA';


/**
 * Deletes an item from a collection defined by the user.
 * @param { MongoDB.Collection } collection - the collection to use.
 * @param { string } itemID - the id of the item to delete.
 * @returns { Object } the result object.
 */
export const deleteItemFromCollection = (collection: MongoDB.Collection) => async (itemID: string) => 
	await collection.deleteOne({_id: new MongoDB.ObjectId(itemID)});

/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
 * DANGER - DO NOT USE OUTSIDE OF TEST SUITES
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * Deletes entire collection. NO UNDO. DON'T **** THIS UP JIMMY! Make sure `testDB` is set to `true`
 * @oaram {string} collection - the collection to clear
 */
export const clearCollection = (collection: MongoDB.Collection) => async () => await collection.deleteMany({});

