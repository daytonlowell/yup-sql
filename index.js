const mysql = require(`mysql`)

const build = require(`./build`)
const fetch = require(`./fetch`)

module.exports = argv => {
	const { schema, table, host, port, user, password, camel, connection } = {
		host: `127.0.0.1`,
		port: 3306,
		user: `root`,
		password: ``,
		...argv,
	}

	if (typeof schema !== `string` || typeof table !== `string`) {
		new Error(`you must pass in schema and table arguments`)
	} else {
		const db = connection || mysql.createConnection({
			host,
			port,
			user,
			password,
		})

		return fetch(db, { schema, table })
			.then(columns => build(columns, camel))
			.finally(() => db.end())
	}
}
