const assert = require('assert')
const testData = require('./test-column-data')
const build = require('../build')

const camel = true
const actual = build(testData, camel)

const expected = `yup.object({
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
	quotedEngineeringHours: yup.number().lessThan(10000).nullable(true).default(0),
	actualEngineeringHours: yup.number().lessThan(10000).nullable(true).default(0),
	engineeringDueDate: yup.date().nullable(true),
	printParts: yup.string().max(65535).nullable(true),
	printQuantity: yup.number().integer().max(16777215).nullable(true).default(1),
	printTimeHours: yup.number().lessThan(10000).nullable(true).default(0),
	printDueDate: yup.date().nullable(true),
	paymentReceived: yup.boolean().nullable(false).default(0),
	contactDate: yup.date().nullable(true),
	replyDate: yup.date().nullable(true),
	quoteDate: yup.date().nullable(true),
	followUpDate: yup.date().nullable(true),
	notes: yup.string().max(65535).ensure().nullable(false),
	version: yup.number().integer().positive().max(4294967295).nullable(false).default(1),
	updatedAt: yup.date().nullable(false),
	isFinished: yup.string().oneOf(['False','True']).nullable(false)
})`

console.log(actual, expected)

assert.equal(actual, expected)
