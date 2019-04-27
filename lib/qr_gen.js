"use strict";

var Readable = require('stream').Readable;

var QR = require('./qr-base').QR;

var BITMAP_OPTIONS = {
    parse_url: false,
    ec_level: 'M',
    size: 5,
    margin: 4,
    customize: null
};

var VECTOR_OPTIONS = {
    parse_url: false,
    ec_level: 'M',
    margin: 1,
    size: 0
};

function get_options(options, force_type) {
    if (typeof options === 'string') {
        options = { 'ec_level': options }
    } else {
        options = options || {};
    }
    var _options = {
        type: String(force_type || options.type || 'png').toLowerCase()
    };

    var defaults = _options.type == 'png' ? BITMAP_OPTIONS : VECTOR_OPTIONS;

    for (var k in defaults) {
        _options[k] = k in options ? options[k] : defaults[k];
    }

    return _options;
}

function qr_image(text, options) {
    options = get_options(options);

    var matrix = QR(text, options.ec_level, options.parse_url);
    let return_stream = '';
    return_stream += `<svg viewBox="0 0 ${matrix[0].length*6} ${matrix[0].length*6}" fill="url(#Gradient2)" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="Gradient1">
        <stop class="stop1" offset="0%"/>
        <stop class="stop2" offset="50%"/>
        <stop class="stop3" offset="100%"/>
      </linearGradient>
      <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="red"/>
        <stop offset="50%" stop-color="black" stop-opacity="0"/>
        <stop offset="100%" stop-color="blue"/>
      </linearGradient>
      <style type="text/css"><![CDATA[
        #rect1 { fill: url(#Gradient1); }
        .stop1 { stop-color: red; }
        .stop2 { stop-color: black; stop-opacity: 0; }
        .stop3 { stop-color: blue; }
      ]]></style>
  </defs>`;
    if (options.shape == 'circle') {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if ((matrix[i][j]) == 1) {
                    return_stream += `<rect x="${i*6}" y="${j*6}" width="6" height="6" />`;
                }
            }
        }
    } else {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if ((matrix[i][j]) == 1) {
                    return_stream += `<circle cx="${(i*6) + 3}" cy="${(j*6)+3}" r="3" />`;
                }
            }
        }
    }
    return_stream += '</svg>';
    return return_stream;
}

module.exports = {
    generate: qr_image
};