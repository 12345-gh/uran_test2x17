document.addEventListener('DOMContentLoaded', () => {
  debugger;
	let video = document.querySelector('#camera-stream'),
		start_camera = document.querySelector('#start-camera'),
		controls = document.querySelector('.controls'),
		take_photo_btn = document.querySelector('#take-photo'),
		error_message = document.querySelector('#error-message');


	// The getUserMedia interface is used for handling camera input.
	// Some browsers need a prefix so here we're covering all the options
	navigator.getMedia = (
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia
	);


	if (!navigator.getMedia) {
		displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
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
				video.src = window.URL.createObjectURL(stream);

				// Play the video element to start the stream.
				video.play();
				video.onplay = () => {
					showVideo();
				};

			},
			// Error Callback
			 (err) => {
				displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
			}
		);
	}

	// Mobile browsers cannot play video without user input, so here we're using a button to start it manually.
	start_camera.addEventListener("click", (e) => {
		e.preventDefault();
		// Start video playback manually.
		video.play();
		showVideo();
	});


	take_photo_btn.addEventListener("click", (e) => {

		e.preventDefault();

		let snap = takeSnapshot();

		let saveScreenshotLink = document.createElement('a');
		saveScreenshotLink.href = snap;
		saveScreenshotLink.download = 'screenshot.png';
		document.body.appendChild(saveScreenshotLink);
		saveScreenshotLink.click();
		document.body.removeChild(saveScreenshotLink);
	});

	let takeSnapshot = () => {
		// Here we're using a trick that involves a hidden canvas element.

		let hidden_canvas = document.querySelector('canvas'),
			context = hidden_canvas.getContext('2d');

		let width = video.videoWidth,
			height = video.videoHeight;

		if (width && height) {

			// Setup a canvas with the same dimensions as the video.
			hidden_canvas.width = width;
			hidden_canvas.height = height;

			// Make a copy of the current frame in the video on the canvas.
			context.drawImage(video, 0, 0, width, height);

			// Turn the canvas image into a dataURL that can be used as a src for our photo.
			return hidden_canvas.toDataURL('image/png');
		}
	};


	let showVideo = () => {
		hideUI();
		video.classList.add("visible");
		controls.classList.add("visible");
	};


	let displayErrorMessage = (error_msg, error) => {
		error = error || "";
		if (error) {
			console.error(error);
		}

		error_message.innerText = error_msg;

		hideUI();
		error_message.classList.add("visible");
	};


	let hideUI = () => {
		controls.classList.remove("visible");
		start_camera.classList.remove("visible");
		video.classList.remove("visible");
		error_message.classList.remove("visible");
	}

});
