var express = require('express');
var app = express();

var qrw = require('./lib/qr_gen');

app.get('/qr', function(req, res) {
    let error = false;
    let data = req.query.data ? req.query.data : error = true;
    let shape = req.query.shape ? req.query.shape : 'default';
    let color = req.query.color ? req.query.color : 'black';
    if (!error) {
        var code = qrw.generate('1', { type: 'svg', shape: shape, color: color });
        res.type('svg');
        res.send(code);
    } else {
        res.status(500);
        res.json({ error: 'Something broke' });
    }
});

app.listen(3000, () => console.log('server started.....'));