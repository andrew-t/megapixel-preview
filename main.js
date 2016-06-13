'use strict';

var pixWidth = 10,
	pixHeight = 3,
	pixSize = 100,
	xOffset = 10,
	yOffset = 10,
	channelOffset = 28,
	subPixSize = 8,
	cols = [ '#f00', '#0f0', '#00f' ];

document.addEventListener('DOMContentLoaded', e => {
	let canvas = document.getElementById('canvas'),
		image = document.getElementById('image'),
		ctx = canvas.getContext('2d');
	image.addEventListener('load', e => {
		// read the image
		ctx.drawImage(image, 0, 0);
		let imageData = ctx.getImageData(0, 0, image.width, image.height);
		for (let x = 0; x < image.width; ++x)
			for (let y = 0; y < image.height; ++y) {
				let i = (x + y * image.height) * 4,
					pixel = [
						imageData.data[i],
						imageData.data[i + 1],
						imageData.data[i + 2]
					].map(c => (c / 255) * pixWidth * pixHeight),
					grid = pixelizer(pixel);
				box(x * pixSize, y * pixSize, pixSize - 1, pixSize - 1, 'black');
				cols.forEach((col, i) => {
					for (let py = 0; py < pixHeight; ++py)
						for (let px = 0; px < pixWidth; ++px)
							box(x * pixSize + xOffset + px * subPixSize,
								y * pixSize + yOffset + py * subPixSize + channelOffset * i,
								subPixSize - 1,
								subPixSize - 1,
								grid[i][py][px] ? col : '#444');
				});
			}
	});

	function box(x, y, w, h, colour) {
		ctx.beginPath();
		ctx.fillStyle = colour;
		ctx.rect(x, y, w, h);
		ctx.fill();
	}
});

function pixelizer(pixel) {
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