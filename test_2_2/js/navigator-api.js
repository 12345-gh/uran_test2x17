const _navControls = Symbol('navControls');
const _navStartCamera = Symbol('navStartCamera');
const _navVideo = Symbol('navVideo');
const _navErrorMessage = Symbol('navErrorMessage');

const _hideUI = (thisObj) => {
	thisObj[_navControls].classList.remove("visible");
	thisObj[_navStartCamera].classList.remove("visible");
	thisObj[_navVideo].classList.remove("visible");
	thisObj[_navErrorMessage].classList.remove("visible");
};

const _showVideo = (thisObj) => {
	thisObj[_navVideo].classList.add("visible");
	thisObj[_navControls].classList.add("visible");
};

const _displayErrorMessage = (thisObj, error_msg, error) => {
	error = error || "";
	if (error) {
		console.error(error);
	}

	this[_navErrorMessage].innerText = error_msg;

	_hideUI(thisObj);
	this[_navErrorMessage].classList.add("visible");
};


class Navigator {
	constructor(controls, start_camera, video, error_message) {
		this[_navControls] = controls;
		this[_navStartCamera] = start_camera;
		this[_navVideo] = video;
		this[_navErrorMessage] = error_message;
	}

	getNavigatorMedia() {
		navigator.getMedia = (
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia
		);
	}

	playVideoStream() {
		if (!navigator.getMedia) {
			_displayErrorMessage(this, "Your browser doesn't have support for the navigator.getUserMedia interface.");
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
					this[_navVideo].src = window.URL.createObjectURL(stream);
					// Play the video element to start the stream.
					this[_navVideo].play();
					this[_navVideo].onplay = () => {
						_hideUI(this);
						_showVideo(this);
					};
				},
				// Error Callback
				(err) => {
					_displayErrorMessage(this, "There was an error with accessing the camera stream: " + err.name, err);
				}
			);
		}
	}

	platVideoStramManually(e) {
		e.preventDefault();
		// Start video playback manually.
		this[_navVideo].play();
		_hideUI(this);
		_showVideo(this);
	}
}