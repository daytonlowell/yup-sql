#!/usr/bin/env node

const yupSql = require(`./index.js`)

const argv = require(`minimist`)(process.argv.slice(2))
yupSql(argv).then(result => {
	console.log(result)
}).catch(err => {
	process.nextTick(() => {
		throw err
	})
})
