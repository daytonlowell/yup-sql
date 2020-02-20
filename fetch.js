const q = require(`sql-concat`)
const camelcaseKeys = require(`camelcase-keys`)

const informationSchemaColumns = [
	`COLUMN_NAME`,
	`DATA_TYPE`,
	`COLUMN_TYPE`,
	`NUMERIC_PRECISION`,
	`NUMERIC_SCALE`,
	`CHARACTER_MAXIMUM_LENGTH`,
	`IS_NULLABLE`,
	`COLUMN_DEFAULT`,
]

module.exports = (db, { schema, table }) => {
	return new Promise((resolve, reject) => {
		let query = q.select(...informationSchemaColumns)
			.from(`information_schema.COLUMNS`)
			.where(`TABLE_SCHEMA`, schema)

		if (table) {
			query = query.where(`TABLE_NAME`, table)
		}
		console.log(query.build())
		db.query(query.build(), (err, columns) => {
			if (err) {
				reject(err)
			} else {
				resolve(camelcaseKeys(columns))
			}
		})
	})
}
