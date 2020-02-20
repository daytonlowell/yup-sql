const yupSql = require('../index.js')

yupSql({
	schema: 'pwner',
	table: 'project',
}).then(result => {
	console.log(result)
}).catch(err => {
	process.nextTick(() => {
		throw err
	})
})
