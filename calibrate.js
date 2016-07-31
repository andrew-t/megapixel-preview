var math = require('mathjs'),
	inv = require('./inv');

var data = require('./edding.json');

function hex2rgb(hex) {
	if (hex[0] == '#')
		hex = hex.substr(1);
	let row = [];
	for (let i = 0; i < 3; ++i) {
		let c = parseInt(hex.substr(i * 2, 2), 16) / 0xff;
		// apply gamma
		c = Math.pow(c, 1 / data.gamma);
		row.push(c);
	}
	return row;
}

var matrix = data.pens.map(hex2rgb);

function round2d(m) {
	return m.map(p =>
		p.map(n =>
			Math.round(n * 100) / 100));
}

console.log(JSON.stringify(round2d(matrix)));
console.log(tex(round2d(matrix)))

function mmult(m1, m2) {
	var out = [];
	// go through m1 by row...
	for (var y1 = 0; y1 < m1.length; ++y1) {
		// go through m2 by column...
		out[y1] = [];
		for (var x2 = 0; x2 < m2[0].length; ++x2) {
			// go through the cells of each
			out[y1][x2] = 0;
			for (var i = 0; i < m1[0].length; ++i) {
				out[y1][x2] += m1[y1][i] * m2[i][x2];
			}
		}
	}
	return out;
}

function random(w, h) {
	var out = [];
	for (var y = 0; y < h; ++y) {
		out[y] = [];
		for (var x = 0; x < w; ++x)
			out[y][x] = Math.random();
	}
	return out;
}

// var m1 = round2d(random(4, 3)),
// 	m2 = round2d(random(3, 4));

// console.log(JSON.stringify(m1))
// console.log(JSON.stringify(m2))
// console.log(mmult(m1, m2))

var penInputs = [],
	values = [0, 1];
for (var r of values)
for (var g of values)
for (var b of values)
	penInputs.push([r, g, b]);
console.log(JSON.stringify(penInputs))
console.log(tex(penInputs))

var lightOutputs = mmult(penInputs, matrix);
console.log(JSON.stringify(round2d(lightOutputs)))
console.log(tex(round2d(lightOutputs)))

function tex(m) {
	return `\\[
\\left [
\\begin{matrix}
` +
m.map(l => l.join(' && ')).join(' \\\\\n')
+ `
\\end{matrix}
\\right ]
\\]`;
}

var invm = inv(matrix);
console.log(JSON.stringify(round2d(invm)));
console.log(tex(round2d(invm)));

var test = mmult(lightOutputs, invm);
console.log(JSON.stringify(round2d(test)));
console.log(tex(round2d(test)));