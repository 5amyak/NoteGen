var translate = require('yandex-translate')('trnsl.1.1.20190407T120847Z.e5b666aa7cb9b1fe.5b4c835abbb4d4ac21456babb2856fdf857e7d3d');
languageSelected = "ru"
translate.translate('You can burn my house, steal my car, drink my liquor from an old fruitjar.', { to: languageSelected }, function(err, res) {
    // Translated text here
    console.log(res.text);
});

translate.getLanguages({ ui: 'en' }, function(err, res) {
    console.log(res);
})
