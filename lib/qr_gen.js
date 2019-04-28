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

    ////////////////////////////////////////////////////////////////////
    ////////////////////////CREATE QR BODY//////////////////////////////
    ////////////////////////////////////////////////////////////////////

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (!(i < 7 && j < 7) && !(i > (matrix.length - 8) && j < 7) && !(i < 7 && j > (matrix.length - 8))) {
                if ((matrix[i][j]) == 1) {
                    if (customization.shape == 'default') {
                        return_stream += `<rect style="fill: rgb(255, 255, 255);" x="${j*6}" y="${i*6}" width="6" height="6" />`;
                    } else {
                        return_stream += `<circle style="fill: rgb(255, 255, 255);" cx="${(j*6) + 3}" cy="${(i*6)+3}" r="2.5" />`;
                    }
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////
    ////////////////////CREATE QR EYE //////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    return_stream += geteye(matrix.length, customization.eye);
    return_stream += geteyeframe(matrix.length, customization.eye_frame);

    return_stream += setcolors(((matrix[0].length) * 6) + (customization.margin * 2), customization);
    return return_stream;
}

function geteye(x, customization) {
    if (customization == '1') {
        return `<g transform="scale(0.4204)">
                    <circle style="fill:rgb(255,255,255)" cx="50" cy="50" r="25"/>
                </g>
                <g transform="translate(0,${(x-7)*6}) scale(0.4204)">
                    <circle style="fill:rgb(255,255,255)" cx="50" cy="50" r="25"/>
                </g>
                <g transform="translate(${(x-7)*6},0) scale(0.4204)">
                    <circle style="fill:rgb(255,255,255)" cx="50" cy="50" r="25"/>
                </g>`
    } else {
        return `<g transform="scale(0.4204)">
                    <rect style="fill:rgb(255,255,255)" x="25" y="25" width="50" height="50"/>
                </g>
                <g transform="translate(0,${(x-7)*6}) scale(0.4204)">
                    <rect style="fill:rgb(255,255,255)" x="25" y="25" width="50" height="50"/>
                </g>
                <g transform="translate(${(x-7)*6},0) scale(0.4204)">
                    <rect style="fill:rgb(255,255,255)" x="25" y="25" width="50" height="50"/>
                </g>`
    }
}

function geteyeframe(x, customization) {
    if (customization == '1') {
        return `<g transform="translate(42,0) scale(-0.4204,0.4204)">
                    <path style="fill:none;" d="M85,66.221V33.75C85,23.411,76.414,15,65.859,15H34.14C23.586,15,15,23.411,15,33.75v51.246
		            l50.855-0.016C76.414,84.98,85,76.564,85,66.221z"/>
                	<path  style="fill:rgb(255,255,255);" d="M100,66.221V33.75C100,15.141,84.68,0,65.859,0H34.14C15.32,0,0,15.141,0,33.75V100l65.859-0.02
	                C84.68,99.98,100,84.84,100,66.221z M85,66.221c0,10.344-8.586,18.76-19.145,18.76L15,84.996V33.75C15,23.411,23.586,15,34.14,15
		            h31.719C76.414,15,85,23.411,85,33.75V66.221z"/>
                </g>
                <g transform="translate(42,${((x-7)*6)+42}) scale(-0.4204,-0.4204)">
                <path style="fill:none;" d="M85,66.221V33.75C85,23.411,76.414,15,65.859,15H34.14C23.586,15,15,23.411,15,33.75v51.246
                l50.855-0.016C76.414,84.98,85,76.564,85,66.221z"/>
                <path  style="fill:rgb(255,255,255);" d="M100,66.221V33.75C100,15.141,84.68,0,65.859,0H34.14C15.32,0,0,15.141,0,33.75V100l65.859-0.02
                C84.68,99.98,100,84.84,100,66.221z M85,66.221c0,10.344-8.586,18.76-19.145,18.76L15,84.996V33.75C15,23.411,23.586,15,34.14,15
                h31.719C76.414,15,85,23.411,85,33.75V66.221z"/>
                </g>
                <g transform="translate(${(x-7)*6},0) scale(0.4204)">
                <path style="fill:none;" d="M85,66.221V33.75C85,23.411,76.414,15,65.859,15H34.14C23.586,15,15,23.411,15,33.75v51.246
                l50.855-0.016C76.414,84.98,85,76.564,85,66.221z"/>
                <path  style="fill:rgb(255,255,255);" d="M100,66.221V33.75C100,15.141,84.68,0,65.859,0H34.14C15.32,0,0,15.141,0,33.75V100l65.859-0.02
                C84.68,99.98,100,84.84,100,66.221z M85,66.221c0,10.344-8.586,18.76-19.145,18.76L15,84.996V33.75C15,23.411,23.586,15,34.14,15
                h31.719C76.414,15,85,23.411,85,33.75V66.221z"/>
                </g>`
    } else {
        return `<g transform="scale(0.4204)"><path style="fill:rgb(255,255,255);" d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/></g>
                <g transform="translate(0,${(x-7)*6}) scale(0.4204)">
                    <path style="fill:rgb(255,255,255);" d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
                </g>
                <g transform="translate(${(x-7)*6},0) scale(0.4204)">
                    <path style="fill:rgb(255,255,255);" d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
                </g>`
    }
}

function getbody(matrix, customization, callback) {
    let body_data = '';
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (!(i < 7 && j < 7) && !(i > (matrix.length - 8) && j < 7)) {
                if ((matrix[i][j]) == 1) {
                    if (customization.shape == 'default') {
                        body_data += `<rect style="fill: rgb(255, 255, 255);" x="${j*6}" y="${i*6}" width="6" height="6" />`;
                    } else {
                        body_data += `<circle style="fill: rgb(255, 255, 255);" cx="${(j*6) + 3}" cy="${(i*6)+3}" r="2.5" />`;
                    }
                    if (j == matrix.length - 1 && i == matrix.length - 1) {
                        return (body_data);
                    }
                }
            }
        }
    }
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