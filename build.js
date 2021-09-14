const toCamelCase = require(`to-camel-case`)

function ifValThen({ column, property, value, then }) {
	const equal = Array.isArray(value) ? value.some(value => {
		return column[property] === value
	}) : column[property] === value

	return equal ? then : ``
}

const maxIntValues = {
	tinyint: 255,
	smallint: 65535,
	mediumint: 16777215,
	int: 4294967295,
	bigint: 18446744073709551615,
}

//const getSignedValue = num => (num - 1) / 2
const decimalLessThan = precision => Math.pow(10, precision)
const unrollEnum = col => col.columnType.match(/enum\((.+)\)/)[1]
const dateTimeTypes = [ `datetime`, `date`, `timestamp` ]
const stringTypes = [ `text`, `varchar`, `char` ]

const checks = [

	intCheck = column => {
		let checks = ``
		if (maxIntValues[column.dataType]) {
			checks += `.number().integer()`

			if (column.columnType.indexOf(`unsigned`) > -1) {
				checks += `.positive()`
			}

			checks += `.max(${maxIntValues[column.dataType]})`
		}

		return checks
	},

	dateCheck = column => ifValThen({
		column,
		property: `dataType`,
		value: dateTimeTypes,
		then: `.date()`,
	}),

	stringCheck = column => {
		let value = ifValThen({
			column,
			property: `dataType`,
			value: stringTypes,
			then: `.string().max(${column.characterMaximumLength})`,
		})

		if (stringTypes.includes(column.dataType) && column.isNullable === 'NO' && column.columnDefault === null) {
			value += `.ensure()`
		}

		return value
	},

	boolCheck = column => (column.dataType === `bit` && column.numericPrecision == `1`) ? `.boolean()` : ``,

	decimalCheck = column => ifValThen({
		column,
		property: `dataType`,
		value: `decimal`,
		then: `.number().lessThan(${decimalLessThan(column.numericPrecision - column.numericScale)})`,
	}),

	enumCheck = column => {
		if (column.dataType === `enum`) {
			return `.string().oneOf([${unrollEnum(column)}])`
		}
		return ``
	},

	nullableCheck = column => {
		if (column.isNullable === `YES`) {
			return `.nullable(true)`
		} else if (column.isNullable === `NO`) {
			return `.nullable(false)`
		}
		return ``
	},

	defaultCheck = column => {
		if (column.columnDefault !== null && !dateTimeTypes.includes(column.dataType)) {
			if ([ ...stringTypes, 'enum' ].includes(column.dataType)) {
				return `.default('${column.columnDefault}')`
			}

			return `.default(${column.columnDefault})`
		}
		return ``
	},
]

module.exports = function(columns, camelCaseProperties) {
	return `yup.object({\n\t${columns.map(column => {
		const property = camelCaseProperties ? toCamelCase(column.columnName) : column.columnName
		return `${property}: yup${checks.map(check => check(column)).join(``)}`
	}).join(`,\n\t`)}\n})`
}
