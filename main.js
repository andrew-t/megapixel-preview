'use strict';

var pixWidth = 10,
	pixHeight = 3,
	pixSize = 12,
	xOffset = 1,
	yOffset = 1,
	channelOffset = 4,
	subPixSize = 1,
	pixGap = 0,
	subPixGap = 0,
	cols = [ '#f00', '#0f0', '#00f' ];

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
		box(0, 0, canvas.width, canvas.height, '#444');
		for (let x = 0; x < image.width; ++x)
			for (let y = 0; y < image.height; ++y) {
				let i = (x + y * image.height) * 4,
					pixel = [
						imageData.data[i],
						imageData.data[i + 1],
						imageData.data[i + 2]
					].map(c => (c / 255) * pixWidth * pixHeight),
					grid = pixelizer(pixel);
				box(x * pixSize, y * pixSize, pixSize - pixGap, pixSize - pixGap, 'black');
				cols.forEach((col, i) => {
					for (let py = 0; py < pixHeight; ++py)
						for (let px = 0; px < pixWidth; ++px)
							box(x * pixSize + xOffset + px * subPixSize,
								y * pixSize + yOffset + py * subPixSize + channelOffset * i,
								subPixSize - subPixGap,
								subPixSize - subPixGap,
								grid[i][py][px] ? col : '#444');
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