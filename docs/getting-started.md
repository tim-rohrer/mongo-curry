
# mongo-curry

[Contents](./contents.md)


## Getting started

### 1. Install mongo-curry

Use either npm or yarn to install mongo-curry

`npm install mongo-curry`

or

`yarn add mongo-curry`

### 2. Configure the project

As early as possibly in your project, run the config function.

`config()` requires an argument of an object with 4 key/value pairs.

*The keys must be named exactly* or the project will throw an error stating the values were not defined.

The keys are as follows

`DB_URL` - the database URL to use. **NOTE** do not include `mongo://` 

`DB_PORT` - the port to use 

`DB_NAME` - the name of the database to use

`TEST_DB_NAME` - the name of the test database to use

#### Example

```javascript
import { config } from 'mongo-curry';

config({
	DB_URL: 'localhost',
	DB_PORT: 27017,
	DB_NAME: 'test',
	TEST_DB_NAME: 'test-test'
});
```
### 3. Test your connection

Once you have set the config function set you can use the built in pingDB function to test your connection.

You can use your test database and or your production database.

#### Example

```javascript
import { pingDB } from 'mongo-curry';

pingDB(); // use production database - default
pingDB(true); // use test databse
```

---
Next: [executeDBRequest](./execute-db-request.md)

[Contents](./contents.md)
