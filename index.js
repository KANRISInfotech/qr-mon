var express = require('express');
var app = express();

var qrw = require('./lib/qr_gen');

app.get('/qr', function(req, res) {
    let error = false;
    let options = req.query;
    let text = req.query.data ? req.query.data : error = true;
    if (!error) {
        var code = qrw.generate(text, options);
        res.type('svg');
        res.send(code);
    } else {
        res.status(500);
        res.json({ error: 'Something broke' });
    }
});

app.listen(3000, () => console.log('server started.....'));