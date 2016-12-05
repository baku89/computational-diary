const fs = require('fs')
const moment = require('moment')

let data =JSON.parse(fs.readFileSync('./raw_data.json'))

let output = []

let year = 2016

const MONTH_NUM = {
	"October": 10,
	"November": 11,
	"December": 12
}


data.forEach((d) => {

	let m = d.date.split(' ')


	let month = MONTH_NUM[m[0]]
	let day = ('0' + m[1]).substr(-2)

	d.content.forEach((item) => {

		let timestamp = moment(`2016-${month}-${day} ${item.time}`, 'YYYY-MM-DD h:mm A')

		console.log(timestamp.format())

		output.push({
			"timestamp": timestamp.format(),
			"keyword": item.keyword.split(' ')
		})
	})
})


fs.writeFileSync('./data.json', JSON.stringify(output))
