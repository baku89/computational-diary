const moment = require('moment')
const readData = require('../read-data.js').default
const colors = require('colors')

data = readData()

let MONTH_NAME = {
	"9": "October",
	"10": "November",
	"11": "December"
}

let numMonth = {}

let numDay = {}

let numDayOfWeek = {}

let numHour = {}

let wordList = {}

moment.weekdays().forEach((v) => numDayOfWeek[v] = 0)


for (let i = 6; i <= 31; i++) { numDay[`October ${i}`] = 0 }
for (let i = 1; i <= 30; i++) { numDay[`November ${i}`] = 0 }
for (let i = 1; i <= 5; i++) { numDay[`December ${i}`] = 0 }


for (let i = 0; i <= 23; i++) { numHour[`${i}`] = 0 }


data.forEach((item) => {

	let dayOfWeek = moment.weekdays()[item.timestamp.day()]
	if (numDayOfWeek[dayOfWeek] == undefined) {
		numDayOfWeek[dayOfWeek] = 0
	}
	numDayOfWeek[dayOfWeek]++

	let month = moment.months()[item.timestamp.month()]
	if (numMonth[month] == undefined) {
		numMonth[month] = 0
	}
	numMonth[month]++

	let day = item.timestamp.format('MMMM D')
	if (numDay[day] == undefined) {
		numDay[day] = 0
	}
	numDay[day]++

	let hour = item.timestamp.format('H')
	if (numHour[hour] == undefined) {
		numHour[hour] = 0
	}
	numHour[hour]++

	item.keyword.forEach((k) => {
		if (wordList[k] == undefined) {
			wordList[k] = 0
		}
		wordList[k]++
	})
})

display('M O N T H', numMonth)
display('DAY OF WEEK', numDayOfWeek)
display('D A Y', numDay)
display('H O U R', numHour)

// word
showTitle('W O R D S')
{
	wordSorted = Object.keys(wordList).sort((a, b) => wordList[b]-wordList[a])

	for (let i = 0; i < 200; i++) {
		let rank = i
		let word = wordSorted[i]

		process.stdout.write(`${rank}\t| `.blue)
		drawGraph(word, wordList[word], 600)
		// process.stdout.write(`${wordList[word]}\t| `.green)
		// process.stdout.write(`${word}\n`.yellow)

	}
}


function CheckLength(str,flg) {
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
        // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            if(!flg) return true;
        } else {
            if(flg) return true;
        }
    }
    return false;
}


function drawGraph(label, value, max) {

	let numJpn = 0

	for (let i = 0; i < label.length; i++) {
		let char = label.substr(i, 1)
		if (CheckLength(char, 1)) {
			numJpn++
		}
	}

	let left = `${label}                   `.substr(0, 16 - numJpn)

	let num = Math.round(value / max * 100)

	let bar = ''

	for (let i = 0; i < num; i++) {
		bar += "#"
	}

	process.stdout.write(`${left} | `.green)
	process.stdout.write(`${('      ' + value).substr(-6)} | `.magenta)
	process.stdout.write(`${bar}\n`.yellow)

}

function showTitle(title) {
	let sl = Math.floor((40 - title.length - 2) / 2)
	let sr = 40 - title.length - 2 - sl

	let ws = '                                        '

	console.log('\n')
	console.log('########################################'.red)
	console.log(`#${ws.substr(0, sl)}${title}${ws.substr(0, sr)}#`.red)
	console.log('########################################'.red)
	console.log('\n')
}


function display(title, table) {

	showTitle(title)

	let max = 0
	let min = 10000000000

	for (key in table) {
		max = Math.max(table[key], max)
		min = Math.min(table[key], min)
	}

	console.log(`Min Number: ${min}`.blue)
	console.log(`Max Number: ${max}\n`.blue)

	for (key in table) {
		drawGraph(key, table[key], max)
	}




}