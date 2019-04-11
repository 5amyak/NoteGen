// chrome.runtime.getBackgroundPage(function(bg){
// 	if(bg.sessionDataHTML){
// 		document.body.innerHTML = bg.sessionDataHTML;
// 	}
// 	setInterval(function(){
// 		bg.sessionDataHTML = document.body.innerHTML;
// 	},1000);

//   //do the rest of your work here.
// })


function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
	navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}

var mediaConstraints = {
	audio: true
};

document.querySelector('#start-recording').onclick = function() {
	$("#start-recording").css("display", "none");
	$("#resume-recording").css("display", "none");
	$("#pause-recording").css("display", "inline-block");
	captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
};

document.querySelector('#pause-recording').onclick = function() {
	mediaRecorder.pause();

	$("#start-recording").css("display", "none");
	$("#pause-recording").css("display", "none");
	$("#resume-recording").css("display", "inline-block");
};

document.querySelector('#resume-recording').onclick = function() {
	mediaRecorder.resume();

	$("#start-recording").css("display", "none");
	$("#resume-recording").css("display", "none");
	$("#pause-recording").css("display", "inline-block");
};

document.querySelector('#end-recording').onclick = function() {
	mediaRecorder.save();
	mediaRecorder.stop();
	mediaRecorder.stream.stop();

	$("#pause-recording").css("display", "none");
	$("#resume-recording").css("display", "none");
	$("#start-recording").css("display", "inline-block");
	// window.open("options.html", "_blank");
    // alert('Drop WebM file on Chrome or Firefox. Both can play entire file. VLC player or other players may not work.');
};

var mediaRecorder;

function onMediaSuccess(stream) {
	var audio = document.createElement('audio');

	audio = mergeProps(audio, {
		controls: true,
		muted: true
	});
	audio.srcObject = stream;
	audio.play();

	audiosContainer.appendChild(audio);
	audiosContainer.appendChild(document.createElement('hr'));

	mediaRecorder = new MediaStreamRecorder(stream);
	mediaRecorder.stream = stream;

    // var recorderType = document.getElementById('audio-recorderType').value;

    // if (recorderType === 'MediaRecorder API') {
        // mediaRecorder.recorderType = MediaRecorderWrapper;
    // }

    // if (recorderType === 'WebAudio API (WAV)') {
    	mediaRecorder.recorderType = StereoAudioRecorder;
    	mediaRecorder.mimeType = 'audio/wav';
    // }

    // if (recorderType === 'WebAudio API (PCM)') {
        // mediaRecorder.recorderType = StereoAudioRecorder;
        // mediaRecorder.mimeType = 'audio/pcm';
    // }

    // don't force any mimeType; use above "recorderType" instead.
    // mediaRecorder.mimeType = 'audio/webm'; // audio/ogg or audio/wav or audio/webm

    // mediaRecorder.audioChannels = !!document.getElementById('left-channel').checked ? 1 : 2;
    mediaRecorder.ondataavailable = function(blob) {
    	var a = document.createElement('a');
    	a.innerHTML = 'Open Recorded Audio No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval * (index-1));

    	a.href = URL.createObjectURL(blob);

    	audiosContainer.appendChild(a);
    	audiosContainer.appendChild(document.createElement('hr'));
    };

    let timeInterval = 10 * 1000;
    // var timeInterval = document.querySelector('#time-interval').value;
    // if (timeInterval) timeInterval = parseInt(timeInterval);
    // else timeInterval = 5 * 1000;

    // get blob after specific time interval
    mediaRecorder.start(timeInterval);

}

function onMediaError(e) {
	console.error('media error', e.message, e.code);
}

var audiosContainer = document.getElementById('audios-container');
var index = 1;

// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
	var k = 1000;
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Bytes';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
	var data = new Date(milliseconds);
	return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " + data.getUTCSeconds() + " second(s)";
}
