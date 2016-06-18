'use strict';

var pixWidth = 10,
	pixHeight = 3,
	pixSize = 12,
	xOffset = 1,
	yOffset = 1,
	channelOffset = 4,
	subPixSize = 1,
	gamma = 1.2,
	pixGap = 0,
	subPixGap = 0,
	cols = [ '#a91b0f', '#012c19', '#0a2471' ],
	multipliers = [ 0xff / 0xa9, 0xff / 0x2c, 0xff / 0x71 ],
	black = '#121011',
	frame = '#000000';

let maxMultiplier = Math.max(...multipliers);
multipliers = multipliers.map(x => x / maxMultiplier);

let sRGB2penRGB = cols.map(col => {
		let row = [];
		for (let i = 0; i < 3; ++i)
			row.push(parseInt(col.substr(i * 2 + 1, 2), 16) / 0xff);
		return row;
	}),
	penRGB2sRGB = matrix_invert(sRGB2penRGB);

document.addEventListener('DOMContentLoaded', e => {
	let canvas = document.getElementById('canvas'),
		image = document.getElementById('image');
	image.addEventListener('load', e => {
		let ctx = canvas.getContext('2d');
		// read the image
		ctx.drawImage(image, 0, 0);
		let imageData = ctx.getImageData(0, 0, image.width, image.height);
		// draw the new one
		canvas.width = pixSize * image.width;
		canvas.height = pixSize * image.height;
		ctx = canvas.getContext('2d');
		// box(0, 0, canvas.width, canvas.height, frame);
		for (let x = 0; x < image.width; ++x)
			for (let y = 0; y < image.height; ++y) {
				let i = (x + y * image.height) * 4,
					pixel = [
						imageData.data[i],
						imageData.data[i + 1],
						imageData.data[i + 2]
					].map((c, i) => {
						let max = pixWidth * pixHeight,
							raw = Math.pow(c / 255, gamma) * max * multipliers[i];
						return raw > max ? max : raw;
					}),
					grid = pixelizer(pixel);
				box(x * pixSize, y * pixSize, pixSize - pixGap, pixSize - pixGap, frame);
				cols.forEach((col, i) => {
					for (let py = 0; py < pixHeight; ++py)
						for (let px = 0; px < pixWidth; ++px)
							box(x * pixSize + xOffset + px * subPixSize,
								y * pixSize + yOffset + py * subPixSize + channelOffset * i,
								subPixSize - subPixGap,
								subPixSize - subPixGap,
								grid[i][py][px] ? col : black);
				});
			}

		function box(x, y, w, h, colour) {
			ctx.beginPath();
			ctx.fillStyle = colour;
			ctx.rect(x, y, w, h);
			ctx.fill();
		}
	});

});

function topLeftPixelizer(pixel) {
	return pixel.slice(0, 3)
		.map(c => {
			let arr = [];
			for (let y = 0; y < pixHeight; ++y) {
				let row = [];
				for (let x = 0; x < pixWidth; ++x)
					row.push(c --> 0);
				arr.push(row);
			}
			return arr;
		});
}

function randomPixelizer(pixel) {
	return pixel.slice(0, 3)
		.map(c => {
			let arr = [];
			for (let y = 0; y < pixHeight; ++y) {
				let row = [];
				for (let x = 0; x < pixWidth; ++x)
					row.push(false);
				arr.push(row);
			}
			while (c --> 0) while (true) {
				var x = ~~(Math.random() * pixWidth),
					y = ~~(Math.random() * pixHeight);
				if (!arr[y][x]) {
					arr[y][x] = true;
					break;
				}
			}
			return arr;
		});
}

function pixelizer(pixel) {
	return (Math.random() > 0.5
		? topLeftPixelizer
		: randomPixelizer)
			(pixel);
}