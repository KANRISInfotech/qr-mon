var express = require('express');
var app = express();

var qr = require('./lib/qr_gen');

app.get('/qr', function(req, res) {
    let data = req.query.data
    var code = qr.generate(data, { type: 'svg', shape: 'circle' });
    res.type('svg');
    res.send(code);
    console.log(data);
});

app.listen(3000);