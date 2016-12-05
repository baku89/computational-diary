const fs = require('fs')
const moment = require('moment')



exports.default = function() {

	let data =JSON.parse(fs.readFileSync('../data/data.json'))


	for (let i = 0; i < data.length; i++) {
		data[i].timestamp = moment(data[i].timestamp)
	}

	return data.reverse()

}