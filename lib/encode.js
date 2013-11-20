module.exports = Base64Encode;

var Transform = require('stream').Transform || require('readable-stream').Transform;
require('util').inherits(Base64Encode, Transform);

/**
 * Transforms a Buffer stream of binary data to a stream of Base64 text. Note that this will
 * also work on a stream of pure strings, as the Writeable base class will automatically decode
 * text string chunks into Buffers.
 * @returns {Base64Encode}
 * @constructor
 */
function Base64Encode(lineLength) {
	if ( !(this instanceof Base64Encode) )
		return new Base64Encode(lineLength);

	Transform.call(this);

	// Any extra chars from the last chunk
	this.extra = null;

	this.lineLength = lineLength;

	this.currLineLength = 0;
}

/**
 * Adds \r\n as needed to the data chunk to ensure that the output Base64 string meets
 * the maximum line length requirement.
 * @param {string} chunk
 * @returns {string}
 * @private
 */
Base64Encode.prototype._fixLineLength = function (chunk) {
	// If we care about line length, add line breaks
	if ( !this.lineLength )
		return chunk;

	var size = chunk.length;
	var needed = this.lineLength - this.currLineLength;
	var start, end;

	var _chunk = '';
	for ( start = 0, end = needed; end < size; start = end, end += this.lineLength ) {
		_chunk += chunk.slice(start, end);
		_chunk += '\r\n';
	}

	var left = chunk.slice(start);
	this.currLineLength = left.length;

	_chunk += left;

	return _chunk;
};

/**
 * Transforms a Buffer chunk of data to a Base64 string chunk.
 * @param {Buffer} chunk
 * @param {string} encoding - unused since chunk is always a Buffer
 * @param cb
 * @private
 */
Base64Encode.prototype._transform = function (chunk, encoding, cb) {
	// Add any previous extra bytes to the chunk
	if ( this.extra ) {
		chunk = Buffer.concat([this.extra, chunk]);
		this.extra = null;
	}

	// 3 bytes are represented by 4 characters, so we can only encode in groups of 3 bytes
	var remaining = chunk.length % 3;

	if ( remaining !== 0 ) {
		// Store the extra bytes for later
		this.extra = chunk.slice(chunk.length - remaining);
		chunk = chunk.slice(0, chunk.length - remaining);
	}

	// Convert chunk to a base 64 string
	chunk = chunk.toString('base64');

	// Push the chunk
	this.push(this._fixLineLength(chunk));
	cb();
};

/**
 * Emits 0 or 4 extra characters of Base64 data.
 * @param cb
 * @private
 */
Base64Encode.prototype._flush = function (cb) {
	if ( this.extra )
		this.push(this._fixLineLength(this.extra.toString('base64')));

	cb();
};
