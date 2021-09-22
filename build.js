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
	year: 4,
}

const getSignedValue = num => (num - 1) / 2
const decimalLessThan = precision => Math.pow(10, precision)
const unrollEnum = col => col.columnType.match(/enum\((.+)\)/)[1]
const dateTimeTypes = [ `datetime`, `date`, `timestamp` ]
const stringTypes = [ `text`, `varchar`, `char` ]

const checks = [

	intCheck = column => {
		let checks = ``
		if (maxIntValues[column.dataType]) {
			checks += `.number().integer()`

			let max = maxIntValues[column.dataType]
			const isSigned = column.columnType.indexOf(`unsigned`) === -1
			max = isSigned ? getSignedValue(max) : max

			if (!isSigned) {
				checks += `.positive()`
			}

			checks += `.max(${max})`

			if (isSigned) {
				checks += `.min(${-1 * (max + 1)})`
			}
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

	floatOrDoubleCheck = column => ifValThen({
		column,
		property: `dataType`,
		value: [ 'float', 'double' ],
		then: `.number()`,
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
			let columnDefault = column.columnDefault

			//number
			if (maxIntValues[column.dataType]) {
				columnDefault = parseInt(column.columnDefault, 10)
			}

			//string
			if ([ ...stringTypes, 'enum' ].includes(column.dataType)) {
				//quote as a string
				columnDefault = `'${columnDefault}'`
			}

			///boolean
			if (columnDefault && column.dataType === `bit` && column.numericPrecision == `1`) {
				if (`${columnDefault}`.indexOf('1') > -1) {
					return `.default(1)`
				} else if (columnDefault.indexOf('0') > -1) {
					return `.default(0)`
				}
			}

			return `.default(${columnDefault})`
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
