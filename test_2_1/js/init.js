document.addEventListener('DOMContentLoaded', () => {
	let cam = new Camera();

	cam.getNavigatorMedia();
	cam.playVideoStream();

	// Mobile browsers cannot play video without user input, so here we're using a button to start it manually.
	document.querySelector('.start-camera').addEventListener("click", (e) => {
		cam.platVideoStramManually(e)
	});

	document.querySelector('.take-photo').addEventListener("click", (e) => {
		cam.makeScreenShot(e);
	});
});
