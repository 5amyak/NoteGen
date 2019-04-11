$(document).ready(function() {
	$(".tap-target").tapTarget("open");
	$('.collapsible').collapsible();

	$("#copy-notes").click(function(){
		var text = $("#notes").text().trim();
		navigator.clipboard.writeText(text).then(function() {
			Materialize.toast('Copied to clipboard!', 3000);
		}, function(err) {
			console.error('Async: Could not copy text: ', err);
		});
	})

	$("#export-notes").click(function(){
		var text = $("#notes").text().trim();
		var doc = new jsPDF('notes');
		doc.setLineWidth(20);
		doc.text(10, 10, text);

		doc.save('notes.pdf');
	})

	$("#speak-notes").click(function(){
		var text = $("#notes").text().trim();
		var utterance = new SpeechSynthesisUtterance();
		utterance.text = text;

		// optional parameters
		utterance.lang = 'en-US'; // language, default is 'en-US'

		// speak it!
		window.speechSynthesis.speak(utterance);
		Materialize.toast('Listen Carefully!', 3000);
	})

	$("#tweet-notes").click(function(){
		let url = 'https://twitter.com/intent/tweet?hashtags=NoteGen&text=' + encodeURI($("#notes").text().trim());
		window.open(url);
	})

	$("#mail-notes").click(function(){
		let mailURL = "mailto:?subject=Created from NoteGenn&body=" + encodeURI($("#notes").text().trim());
		window.open(mailURL);
	})

	$("#summary-btn").click(function(){
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:3000/summary",
			"method": "POST",
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			"data": {
				"notes": $("#notes").text().trim()
			}
		}

		$.ajax(settings).done(function (summary) {
			if (summary.length == 0) summary = $("#notes").text().trim();
			$("#summary-text").text(summary);
			$("#summary-card").css("display", "block");
		});
	})

	$("#translate-btn").click(function(){
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "http://localhost:3000/translate",
			"method": "POST",
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"data": {
				"notes": $("#notes").text().trim()
			}
		}

		$.ajax(settings).done(function (translate) {
			$("#translate-text").text(translate);
			$("#translate-card").css("display", "block");
		});
	})

	$("#generate-notes").click(function(){
		$("#file-form").submit();
	})

	$('#file-form').submit(function() {
		var formData = new FormData($(this)[0]);
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/upload',
			data: formData,
			processData: false,
			contentType: false,
		}).done(function( data ) {
			$("#notes").text(data);
		});
		return false;
	});
});
