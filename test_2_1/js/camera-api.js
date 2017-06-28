class Camera {
	constructor() {
		this.video = document.querySelector('.camera-stream');
		this.start_camera = document.querySelector('.start-camera');
		this.controls = document.querySelector('.controls');
		this.error_message = document.querySelector('.error-message');
	}

	getNavigatorMedia() {
		navigator.getMedia = (
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia
		);
	}

	hideUI() {
		this.controls.classList.remove("visible");
		this.start_camera.classList.remove("visible");
		this.video.classList.remove("visible");
		this.error_message.classList.remove("visible");
	}

	showVideo() {
		this.hideUI();
		this.video.classList.add("visible");
		this.controls.classList.add("visible");
	}

	displayErrorMessage(error_msg, error) {
		error = error || "";
		if (error) {
			console.error(error);
		}

		this.error_message.innerText = error_msg;

		this.hideUI();
		this.error_message.classList.add("visible");
	}

	playVideoStream() {
		if (!navigator.getMedia) {
			this.displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
		}
		else {
			// Request the camera.
			navigator.getMedia(
				{
					video: true
				},
				// Success Callback
				(stream) => {

					// Create an object URL for the video stream and set it as src of our HTML video element.
					this.video.src = window.URL.createObjectURL(stream);

					// Play the video element to start the stream.
					this.video.play();
					this.video.onplay = () => {
						this.showVideo();
					};

				},
				// Error Callback
				(err) => {
					this.displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
				}
			);
		}
	}

	platVideoStramManually(e) {
		e.preventDefault();
		// Start video playback manually.
		this.video.play();
		this.showVideo();
	}

	takeSnapshot() {
		// Here we're using a trick that involves a hidden canvas element.
		let hidden_canvas = document.querySelector('canvas'),
			context = hidden_canvas.getContext('2d');

		let width = this.video.videoWidth,
			height = this.video.videoHeight;

		if (width && height) {

			// Setup a canvas with the same dimensions as the video.
			hidden_canvas.width = width;
			hidden_canvas.height = height;

			// Make a copy of the current frame in the video on the canvas.
			context.drawImage(this.video, 0, 0, width, height);

			// Turn the canvas image into a dataURL that can be used as a src for our photo.
			return hidden_canvas.toDataURL('image/png');
		}
	};

	makeScreenShot(e) {
		e.preventDefault();

		let snap = this.takeSnapshot();

		let saveScreenshotLink = document.createElement('a');
		saveScreenshotLink.href = snap;
		saveScreenshotLink.download = 'screenshot.png';
		document.body.appendChild(saveScreenshotLink);
		saveScreenshotLink.click();
		document.body.removeChild(saveScreenshotLink);
	}

}