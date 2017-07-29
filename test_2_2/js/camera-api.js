const _camVideo = Symbol('camVideo');

const _takeSnapshot = (thiaObj) => {
	// Here we're using a trick that involves a hidden canvas element.
	let hidden_canvas = document.querySelector('canvas'),
		context = hidden_canvas.getContext('2d'),
	  width = thiaObj[_camVideo].videoWidth,
		height = thiaObj[_camVideo].videoHeight;

	if (width && height) {
		// Turn the canvas image into a dataURL that can be used as a src for our photo.
		// Setup a canvas with the same dimensions as the video.
		hidden_canvas.width = width;
		hidden_canvas.height = height;
		// Make a copy of the current frame in the video on the canvas.
		context.drawImage(thiaObj[_camVideo], 0, 0, width, height);
		return hidden_canvas.toDataURL('image/png');
	}
};

class Camera {
	constructor(video) {
		this[_camVideo] = video;
	}

	makeScreenShot(e) {
		e.preventDefault();

		let snap = _takeSnapshot(this);

		let saveScreenshotLink = document.createElement('a');
		saveScreenshotLink.href = snap;
		saveScreenshotLink.download = 'screenshot.png';
		document.body.appendChild(saveScreenshotLink);
		saveScreenshotLink.click();
		document.body.removeChild(saveScreenshotLink);
	}

}