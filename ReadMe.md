# qr-mon
Microservice to create qr data stream in NodeJS with customized design options.

##

### Getting Started

```
var express = require('express');
var app = express();

var qrw = require('qr-mon');

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
```
HTML


### Options

* data - Text to be encoded in the qr code
* margin - border around code in (integer)
* background - default transparent
* shape - shape of points inside the code : default - 0
* eye - type of eye ball : default - 0
* eyeframe - type of the qr eye border : default - 0