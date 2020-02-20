# yup-sql

Point it at your local database, and it spits out a [Yup](https://github.com/jquense/yup) object validator.

[![Build Status](https://travis-ci.org/daytonlowell/yup-sql.svg?branch=master)](https://travis-ci.org/daytonlowell/yup-sql)

## Install

```sh
npm install yup-sql
```

(`npm install -g yup-sql` if you want to use it from the command-line)

This is a straight fork of [joi-sql](https://github.com/TehShrike/joi-sql)

## Usage

### CLI

```sh
yup-sql --host=localhost --user=root --password=abc123 --schema=awesomedb --table=customer --camel
```

`host`, `user`, `password`, and `camel` are all optional.  `schema` and `table` are not.

If `camel` is set, then column names are converted to camel case identifiers.

Spits out something like:

```js
yup.object({
	projectId: yup.required().invalid(null).number().integer().max(4294967295).min(0),
	contactId: yup.required().invalid(null).number().integer().max(4294967295).min(0),
	dateCreated: yup.required().invalid(null).date(),
	engineerId: yup.number().integer().max(4294967295).min(0),
	name: yup.required().invalid(null).string().allow('').max(200),
	engineeringProject: yup.required().invalid(null).boolean(),
	printingProject: yup.required().invalid(null).boolean(),
	activeProjectStateId: yup.required().invalid(null).number().integer().max(4294967295).min(0),
	startDate: yup.date(),
	done: yup.required().invalid(null).boolean(),
	doneDate: yup.date(),
	deadReason: yup.string().allow('').max(65535),
	quotedEngineeringHours: yup.number().precision(1).less(10000),
	actualEngineeringHours: yup.number().precision(1).less(10000),
	engineeringDueDate: yup.date(),
	printParts: yup.string().allow('').max(65535),
	printQuantity: yup.number().integer().max(8388607).min(-8388608),
	printTimeHours: yup.number().precision(1).less(10000),
	printDueDate: yup.date(),
	paymentReceived: yup.required().invalid(null).boolean(),
	contactDate: yup.date(),
	replyDate: yup.date(),
	quoteDate: yup.date(),
	followUpDate: yup.date(),
	notes: yup.string().allow('').max(65535),
	version: yup.required().invalid(null).number().integer().max(4294967295).min(0)
})
```

### Programmatic

Returns a promise that resolves to a string containing the code snippet above.

```js
const yupSql = require('yup-sql')

yupSql({
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    schema: 'awesomedb',
    table: 'customer',
    camel: true
}).then(result => {
	typeof result // => 'string'
})
```

You may also pass in an optional `connection` property which must be a [`mysql`](https://github.com/mysqljs/mysql) connection instance.

Pull requests welcome.

## License

[WTFPL](http://wtfpl2.com/)
