document.addEventListener('DOMContentLoaded', () => {
	let video = document.querySelector('.camera-stream');
	let start_camera = document.querySelector('.start-camera');
	let controls = document.querySelector('.controls');
	let error_message = document.querySelector('.error-message');

	let nav = new Navigator(controls, start_camera, video, error_message);
	nav.getNavigatorMedia();
	nav.playVideoStream();

	let cam = new Camera(video);

	// Mobile browsers cannot play video without user input, so here we're using a button to start it manually.
	document.querySelector('.start-camera').addEventListener("click", (e) => {
		nav.platVideoStramManually(e)
	});

	document.querySelector('.take-photo').addEventListener("click", (e) => {
		cam.makeScreenShot(e);
	});
});
