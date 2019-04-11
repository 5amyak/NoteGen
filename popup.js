var mediaConstraints = {
	audio: true
};

// navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

function onMediaSuccess(stream) {
	let mediaRecorder = new MediaStreamRecorder(stream);
	mediaRecorder.mimeType = 'audio/wav';
    // check this line for audio/wav
    mediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        var blobURL = URL.createObjectURL(blob);
        document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
    };
    mediaRecorder.start(3000);
}

function onMediaError(e) {
	console.log(e.message, e.code, e.name);
}

$(document).ready(function() {
	console.log( "ready!" );
	$("#start-recording").click(function() {
		navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
	});

	$("#save-recording").click(function() {
		mediaRecorder.stop();
		mediaRecorder.save();
	});
});