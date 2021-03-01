# mongo-curry

## Finding Items

Finding items requires a collection as a string.

### Finding all items

#### Example

```javascript

import { executeDBRequest, findAllItemsInCollection } from 'mongo-curry';

const results = executeDBRequest('books')(findAllItemsInCollection)();

console.log(results) // Array of objects from books collection
```

### Finding by ID

Requires the ID as a string.

#### Example

```javascript

import { executeDBRequest, findItemByIdInCollection } from 'mongo-curry';

const result = executeDBRequest('books')(findItemByIdInCollection)('sdfc918238759183');

console.log(result) // Object from books collection
```

### Finding by value

Requires an object with a key and a value for the value you would like.

#### Example

```javascript

import { executeDBRequest, findItemByValueInCollection } from 'mongo-curry';

const result = executeDBRequest('books')(findItemByValueInCollection)({name: 'Some Book'});

console.log(result) // Object from books collection
```
