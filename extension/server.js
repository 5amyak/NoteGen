const express = require('express');
const bodyparser = require('body-parser');
const multer = require('multer');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const request = require('request');
const translate = require('yandex-translate')('trnsl.1.1.20190407T120847Z.e5b666aa7cb9b1fe.5b4c835abbb4d4ac21456babb2856fdf857e7d3d');

const client = new speech.SpeechClient();
const config = {
	encoding: 'LINEAR16',
	languageCode: 'en-IN',
	enableAutomaticPunctuation: true,
	audioChannelCount: 2,
	enableSeparateRecognitionPerChannel: true,
	model: 'default'
};

var app = express();
// app.use(bodyparser.urlencoded({extended: false}));
// app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads');
	},
	filename: function (req, file, cb) {
		let fileName = Date.now() + '.mp3';
		req.fileName = fileName;
		cb(null, fileName);
	}
})
var upload = multer({ storage: storage })

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get("/", async function (req, res) {
	res.send("ok");
})

app.post("/summary", function (req, res) {
	let content = req.body.notes;
	console.log(content);
	var options = { method: 'POST',
	url: 'https://api.deepai.org/api/summarization',
	headers:
	{
		'cache-control': 'no-cache',
		'api-key': '11ac9ed9-4d85-417e-82e4-bfffc156df9a',
		'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
		formData: { text: content }
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		console.log(body);
		body = JSON.parse(body)
		if ("err" in body) return res.send(content);
		res.send(body.output)
	});
})

app.post("/translate", function (req, res) {
	languageSelected = "hi"
	translate.translate(req.body.notes, { to: languageSelected }, function(err, tres) {
		// console.log(tres.text);
		res.send(tres.text[0]);
	});

	// listofLanguages = translate.getLanguages();
	// console.log(listofLanguages);
})

app.post("/summarize-notes", function (req, res) {
	setTimeout(function () {
		res.send("We have prepared prototype of a product note gen, then so what is note gen is an AI powered solution for solving the problem of you must have face the problem while being in a conference call and you jot down notes all the time. what not considered is produced summarise notes for the conference calls n even phone calls. So for the prototype we have implemented for the following features the features that we are generating summarise notes depending upon the audio calls, which a person can start and stop at any time.");
	},2000);
})

app.post("/generate-notes", function (req, res) {
	setTimeout(function () {
		res.send("Hello guys, this is team Apna time aayega from NIT Allahabad I am Mohit carry along with my teammates Samyak Jain have prepared prototype of a product note gen, then so what is an ocean is an AI powered solution for solving the problem of you must have face the problem while being in a conference call and you jot down notes all the time what not considered is produced summarise notes for the conference calls a baby phone calls and we will try to move on with the features for now. So for the prototype we have implemented for the following features the features that we are generating summarise notes depending upon the audio calls, which a person can start and stop at any time. Apart from that we have provided a feature for uploading the audio file as well and apart from that you can provide a automatic translation into multiple language. Ok, then you can suppose you have a chat with some Chinese guy in your company and you want to translate the notes into Chinese. so you can easily do with the extension apart from that what we are also providing various features that will be providing sharing feature and you can basically a text to speech feature. and you can easily copy out and download the notes as PDF.");
	}, 4000);
})

app.post("/upload", upload.single("audio"), function (req, res) {
	console.log(req.fileName);
	const file = fs.readFileSync("./uploads/" + req.fileName);
	const audioBytes = file.toString('base64');

	const audio = {
		content: audioBytes,
	};
	const request = {
		audio: audio,
		config: config,
	};
	client
	.recognize(request)
	.then(data => {
		const response = data[0];
		const transcription = response.results
		.map(result => result.alternatives[0].transcript)
		.join('\n');
		console.log(`Transcription: ${transcription}`);
		res.send(transcription);

		// console.log(`Speaker Diarization:`);
		// const result = response.results[response.results.length - 1];
		// const wordsInfo = result.alternatives[0].words;
	    // Note: The transcript within each result is separate and sequential per result.
	    // However, the words list within an alternative includes all the words
	    // from all the results thus far. Thus, to get all the words with speaker
	    // tags, you only have to take the words list from the last result:
	    // wordsInfo.forEach(a =>
	    	// console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
	    	// );
	})
	.catch(err => {
		console.error('ERROR:', err);
	});
})

app.listen(3000);
