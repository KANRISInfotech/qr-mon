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
    let customization = options;
    var matrix = QR(text, options.ec_level, options.parse_url);
    let return_stream = '';
    return_stream += `<svg viewBox="0 0 ${(matrix[0].length)*6} ${(matrix[0].length)*6}" fill="${customization.color}" xmlns="http://www.w3.org/2000/svg">-`;
    if (customization.shape == 'default') {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if ((matrix[i][j]) == 1) {
                    return_stream += `<rect x="${j*6}" y="${i*6}" width="6" height="6" />`;
                }
            }
        }
    } else {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if ((matrix[i][j]) == 1) {
                    return_stream += `<circle cx="${(i*6) + 3}" cy="${(j*6)+3}" r="2.5" />`;
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