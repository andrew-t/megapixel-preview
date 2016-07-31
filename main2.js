
var v, v2, v3;

document.addEventListener('DOMContentLoaded', e => {

// calc'd in other file
var m = [[1.1,-0.04,-0.11],[0,2.75,-0.28],[0,-0.49,1.27]],
	p = [[0.91,0.03,0.08],[0,0.38,0.08],[0,0.14,0.82]];

var canvas = document.getElementById('canvas'),
	canvas2 = document.getElementById('canvas2'),
	image = document.getElementById('image');
image.addEventListener('load', e => {

v = [];

var ctx = canvas.getContext('2d');
// read the image
ctx.drawImage(image, 0, 0);
var imageData = ctx.getImageData(0, 0, image.width, image.height);
var i = 0;
for (let x = 0; x < image.width; ++x)
	for (let y = 0; y < image.height; ++y) {
		let pixel = [
				imageData.data[i++] / 255,
				imageData.data[i++] / 255,
				imageData.data[i++] / 255
			];
		i++; // skip alpha
		v.push(pixel.map(v =>
			Math.pow(v, 2.2)));
	}

v2 = clamp(mmult(v, m));
v3 = clamp(mmult(v2, p));

// v2 = scale(mmult(v, m));
// v3 = scale(mmult(v2, p));

// v2 = manscale(mmult(v, m), 0, 1.5);
// v3 = manscale(mmult(v2, p), 0, 1 / 1.5);

// v2 = mmult(v, m);
// v3 = mmult(v2, p);

// v2 = mmult(v, m);
// v3 = mmult(clamp(v2), p);

draw(v2, canvas, 1);
draw(v3, canvas2, 1 / 2.2);

canvas.addEventListener('mousemove', explain);
canvas2.addEventListener('mousemove', explain);

});
});

function explain(e) {
	var x = e.offsetX, y = e.offsetY,
		i = y * image.width + x;
	document.getElementById('coords').innerHTML =
		`${r(x)},${r(y)}`;
	document.getElementById('v').innerHTML =
		`${r(v[i])}`;
	document.getElementById('v2').innerHTML =
		`${r(v2[i])}`;
	document.getElementById('v3').innerHTML =
		`${r(v3[i])}`;
	document.getElementById('error').innerHTML =
		`${r(v3[i].map((n, j) => n - v[i][j]))}`;

	document.getElementById('swatch-v').style.backgroundColor =
		`rgb(${r0(v[i].map(x => x * 255))})`;
	document.getElementById('swatch-v2').style.backgroundColor =
		`rgb(${r0(v2[i].map(x => x * 255))})`;
	console.log(document.getElementById('swatch-v2'))
	console.log(`rgb(${r0(v2[i].map(x => x * 255))})`)
	document.getElementById('swatch-v3').style.backgroundColor =
		`rgb(${r0(v3[i].map(x => x * 255))})`;
}

function r0(n) {
	return n.map ? n.map(r0) : Math.round(n);
}
function r(n) {
	return n.map ? n.map(r) : Math.round(n * 100) / 100;
}

function clamp(v) {
	return v.map(p => p.map(c =>
		(c < 1) ? (c > 0) ? c : 0 : 1))
}

function scale(v) {
	var max = Math.max(...v.map(p => Math.max(...p))),
		min = Math.min(...v.map(p => Math.min(...p)));
	return manscale(v, min, max);
}
function manscale(v, min, max) {
	return v.map(p => p.map(c =>
		(c - min) / (max - min)
	));
}

function draw(v, canvas, gamma) {
	var ctx = canvas.getContext('2d');
	var i = 0, j = 0;

	var id = ctx.createImageData(image.width, image.height);
	var d = id.data;

	for (let x = 0; x < image.width; ++x)
		for (let y = 0; y < image.height; ++y) {
			var pixel = v[i++];
			// console.log(pixel)
			d[j++] = Math.pow(pixel[0], gamma) * 255;
			d[j++] = Math.pow(pixel[1], gamma) * 255;
			d[j++] = Math.pow(pixel[2], gamma) * 255;
			d[j++] = 255; // alpha
		}

	ctx.putImageData(id, 0, 0);

}



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