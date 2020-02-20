# yup-sql

Point it at your local database, and it spits out a [Yup](https://github.com/jquense/yup) object validator.

[![Build Status](https://travis-ci.org/daytonlowell/yup-sql.svg?branch=master)](https://travis-ci.org/daytonlowell/yup-sql)

This is a straight fork of [joi-sql](https://github.com/TehShrike/joi-sql)

## Install

```sh
npm install yup-sql
```

(`npm install -g yup-sql` if you want to use it from the command-line)

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
	projectId: yup.number().integer().positive().max(4294967295).nullable(false),
	contactId: yup.number().integer().positive().max(4294967295).nullable(false),
	dateCreated: yup.date().nullable(false),
	engineerId: yup.number().integer().positive().max(4294967295).nullable(true),
	name: yup.string().max(200).nullable(false).default(''),
	engineeringProject: yup.boolean().nullable(false).default(1),
	printingProject: yup.boolean().nullable(false).default(1),
	activeProjectStateId: yup.number().integer().positive().max(4294967295).nullable(false),
	startDate: yup.date().nullable(true),
	done: yup.boolean().nullable(false).default(0),
	doneDate: yup.date().nullable(true),
	deadReason: yup.string().max(65535).nullable(true).default(''),
	quotedEngineeringHours: yup.number().precision(1).lessThan(10000).nullable(true).default(0),
	actualEngineeringHours: yup.number().precision(1).lessThan(10000).nullable(true).default(0),
	engineeringDueDate: yup.date().nullable(true),
	printParts: yup.string().max(65535).nullable(true),
	printQuantity: yup.number().integer().max(16777215).nullable(true).default(1),
	printTimeHours: yup.number().precision(1).lessThan(10000).nullable(true).default(0),
	printDueDate: yup.date().nullable(true),
	paymentReceived: yup.boolean().nullable(false).default(0),
	contactDate: yup.date().nullable(true),
	replyDate: yup.date().nullable(true),
	quoteDate: yup.date().nullable(true),
	followUpDate: yup.date().nullable(true),
	notes: yup.string().max(65535).nullable(true).default(''),
	version: yup.number().integer().positive().max(4294967295).nullable(false).default(1),
	updatedAt: yup.date().nullable(false)
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
