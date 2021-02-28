# mongo-curry

A simple, testable, curried approach to MongoDB for Node

## Features

- Functional to using Mongo
- Easy API
- Support for .env files
- ES6 syntax


## Install

`npm install mongo-curry`

or

`yarn add mongo-curry`


## Usage

```javascript
import { config } from 'mongo-curry';

config({
	DB_URL: 'localhost',
	DB_PORT: 27017,
	DB_NAME: 'test',
	TEST_DB_NAME: 'test-test'
});
```

For all functions, see the full docs [here](./docs/contents.md)

## Support

If you like this library, consider supporting me by buying me a coffee.

It allows me to stay awake and focused building projects like this for you.

[Buy me a coffee](https://buymeacoffee.com/creplav)


## Contribution

Contributions are welcomed! 

If you have a recommendation, please feel free to open an issue on this project. I would love to discuss your idea with you.

## License
This project is licensed under AGPLv3
