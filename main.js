'use strict';

var pixWidth = 12,
	pixHeight = 4,
	pixSize = 12,
	xOffset = 0,
	yOffset = 0,
	channelOffset = 4,
	subPixSize = 1,
	gamma = 1.2,
	pixGap = 0,
	subPixGap = 0,
	//cols = [ '#ff0000', '#00ff00', '#0000ff' ],
	cols = [ "#f43353", "#0aa453", "#0d6ae9" ],
	multiplier = .5, //.15,
	black = '#000', //'#121011',
	frame = '#000000';

document.addEventListener('DOMContentLoaded', e => {
	let canvas = document.getElementById('canvas'),
		image = document.getElementById('image'),
		reality = document.getElementById('reality');
	image.addEventListener('load', e => {
		let ctx = canvas.getContext('2d');
		// read the image
		ctx.drawImage(image, 0, 0);
		let imageData = ctx.getImageData(0, 0, image.width, image.height);
		// draw the new one
		canvas.width = pixSize * image.width;
		canvas.height = pixSize * image.height;
		reality.width = pixSize * image.width;
		reality.height = pixSize * image.height;
		ctx = canvas.getContext('2d');
		// box(0, 0, canvas.width, canvas.height, frame);
		for (let x = 0; x < image.width; ++x)
			for (let y = 0; y < image.height; ++y) {
				let i = (x + y * image.height) * 4,
					pixel = [
						imageData.data[i],
						imageData.data[i + 1],
						imageData.data[i + 2]
					],
					max = pixHeight * pixWidth;
				// let grid = pixelizer(pixel.map(x => ~~(Math.pow(x / 255, 2.2) * max)));

				// the real way:
				let grid = pixelizer(pixel.map(x => ~~((x / 255) * max)));
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
				// the way that works well for small images
				/*box(x * pixSize, y * pixSize, pixSize - pixGap, pixSize - pixGap, black);
				let done = [];
				for (let i = 0; i < pixSize; ++i) done[i] = [];
				for (let c = 0; c < 3; ++c) {
					for (let val = ~~((pixel[c] / 255) * max);
						val > 0; --val) while (true) {
						var px = ~~(Math.random() * pixSize),
							py = ~~(Math.random() * pixSize);
						if (!done[py][px]) {
							box(x * pixSize + px * subPixSize,
								y * pixSize + py * subPixSize,
								subPixSize - subPixGap,
								subPixSize - subPixGap,
								cols[c]);
							done[py][px] = true;
							break;
						}
					}
				}*/
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