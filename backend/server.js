const express = require('express');
const bodyparser = require('body-parser');
const multer = require('multer');
const SummaryTool = require('node-summary');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const translate = require('yandex-translate')('trnsl.1.1.20190407T120847Z.e5b666aa7cb9b1fe.5b4c835abbb4d4ac21456babb2856fdf857e7d3d');

const client = new speech.SpeechClient();
const config = {
	encoding: 'LINEAR16',
	sampleRateHertz: 16000,
	languageCode: 'en-IN',
	enableSpeakerDiarization: true,
	enableAutomaticPunctuation: true,
	diarizationSpeakerCount: 2,
	model: `default`
};

var app = express();
app.use(bodyparser.urlencoded({extended: false}));

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

app.get("/", function (req, res) {
	res.send("ok");
})

app.post("/summary", function (req, res) {
	let content = req.body.notes;
	console.log(content);
	SummaryTool.summarize("", content, function(err, summary) {
		if(err) console.log("Something went wrong man!");

		res.send(summary);

		console.log("Original Length " + (content.length));
		console.log("Summary Length " + summary.length);
		console.log("Summary Ratio: " + (100 - (100 * (summary.length / (content.length)))));
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

app.post("/upload", upload.single("audio"),function (req, res) {
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

		console.log(`Speaker Diarization:`);
		const result = response.results[response.results.length - 1];
		const wordsInfo = result.alternatives[0].words;
	    // Note: The transcript within each result is separate and sequential per result.
	    // However, the words list within an alternative includes all the words
	    // from all the results thus far. Thus, to get all the words with speaker
	    // tags, you only have to take the words list from the last result:
	    wordsInfo.forEach(a =>
	    	console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
    	);
	})
	.catch(err => {
		console.error('ERROR:', err);
	});
})

app.listen(3000);
