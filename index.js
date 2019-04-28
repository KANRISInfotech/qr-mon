var express = require('express');
var app = express();

var qrw = require('./lib/qr_gen');

app.get('/qr', function(req, res) {
    let error = false;
    let options = {};
    options.data = req.query.data ? req.query.data : error = true;
    options.shape = req.query.shape ? req.query.shape : 'default';
    options.color = req.query.color ? req.query.color : 'black';
    options.margin = req.query.margin ? req.query.margin : 0;
    options.background = req.query.background ? req.query.background : 'rgba(0,0,0,0)';
    options.fill = req.query.fill ? req.query.fill : 'solid';
    options.eye_frame = req.query.eye_frame ? req.query.eye_frame : 'default';
    options.eye = req.query.eye ? req.query.eye : 'default';
    if (!error) {
        var code = qrw.generate(options);
        res.type('svg');
        res.send(code);
    } else {
        res.status(500);
        res.json({ error: 'Something broke' });
    }
});

app.listen(3000, () => console.log('server started.....'));