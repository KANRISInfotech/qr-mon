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

function qr_image(options) {
    let text = options.data;
    options.type = 'svg';
    let customization = options;
    var matrix = QR(text, options.ec_level, options.parse_url);
    let return_stream = '';
    let qr_dimensions = (matrix[0].length) * 6;
    return_stream += `<svg viewBox="0 0 ${((matrix[0].length) * 6) + (customization.margin * 2)} ${((matrix[0].length) * 6) + (customization.margin * 2)}" xmlns="http://www.w3.org/2000/svg">
<rect x="0" y="0" width="${((matrix[0].length) * 6) + (customization.margin * 2)}" height="${((matrix[0].length) * 6) + (customization.margin * 2)}" fill="${customization.background}" />
<g transform="translate(${customization.margin},${customization.margin})"><g><defs><mask id="gmask"><g>`;
    if (customization.shape == 'default') {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if ((matrix[i][j]) == 1) {
                    return_stream += `<rect style="fill: rgb(255, 255, 255);" x="${j*6}" y="${i*6}" width="6" height="6" />`;
                }
            }
        }
    } else {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if ((matrix[i][j]) == 1) {
                    return_stream += `<circle style="fill: rgb(255, 255, 255);" cx="${(j*6) + 3}" cy="${(i*6)+3}" r="2.5" />`;
                }
            }
        }
    }
    return_stream += setcolors(((matrix[0].length) * 6) + (customization.margin * 2), customization);
    return return_stream;
}
var setcolors = function(x, options) {
    let a = '';
    if (options.fill == 'solid') {
        a = `</g></mask></defs></g><rect x="0" y="0" width="${x}" height="${x}" fill="${options.color}" mask="url(#gmask)" /></g></svg>`;
    } else if (options.fill == "linear-horizontal") {
        a = `</g></mask> <linearGradient gradientTransform="rotate(0)" id="grad">
                <stop offset="0%" stop-color="${(options.color.indexOf('.')!==-1)? options.color.split('.')[0] : 'rgba(0,0,0,1)'}" />
                <stop offset="100%" stop-color="${(options.color.indexOf('.')!==-1)? options.color.split('.')[1] : 'rgba(2,119,189,1)'}" />
            </linearGradient></defs></g><rect x="0" y="0" width="${x}" height="${x}" fill="url(#grad)" mask="url(#gmask)" /></g></svg>`;
    } else if (options.fill == "linear-vertical") {
        a = `</g></mask> <linearGradient gradientTransform="rotate(90)" id="grad">
                <stop offset="0%" stop-color="${(options.color.indexOf('.')!==-1)? options.color.split('.')[0] : 'rgba(0,0,0,1)'}" />
                <stop offset="100%" stop-color="${(options.color.indexOf('.')!==-1)? options.color.split('.')[1] : 'rgba(2,119,189,1)'}" />
            </linearGradient></defs></g><rect x="0" y="0" width="${x}" height="${x}" fill="url(#grad)" mask="url(#gmask)" /></g></svg>`;
    } else if (options.fill == "radial") {
        a = `</g></mask>
            <radialGradient id="grad">
                <stop offset="0%" style="stop-color:${(options.color.indexOf('.')!==-1)? options.color.split('.')[0] : 'rgba(0,0,0,1)'};" />
                <stop offset="100%" style="stop-color:${(options.color.indexOf('.')!==-1)? options.color.split('.')[1] : 'rgba(2,119,189,1)'};" />
            </radialGradient>
            </defs></g><rect x="0" y="0" width="${x}" height="${x}" fill="url(#grad)" mask="url(#gmask)" /></g></svg>`;
    }
    return a;
}
module.exports = {
    generate: qr_image
};