const {Transform} = require('stream');


/**
 * Decodes a Base64 data stream, coming in as a string or Buffer of UTF-8 text, into binary Buffers.
 * @returns {Base64Decode}
 * @constructor
 */

module.exports = class Base64Decode extends Transform {
	
	constructor() {
		super({decodeStrings: false});
		// Any extra chars from the last chunk
		this.extra = '';
	}

	/**
	 * Decodes a Base64 data stream, coming in as a string or Buffer of UTF-8 text, into binary Buffers.
	 * @param {Buffer|string} chunk
	 * @param encoding
	 * @param cb
	 * @private
	 */
	_transform(chunk, encoding, cb) {
		// Convert chunk to a string
		chunk = '' + chunk;

		// Add previous extra and remove any newline characters
		chunk = this.extra + chunk.replace(/(\r\n|\n|\r)/gm, '');

		// 4 characters represent 3 bytes, so we can only decode in groups of 4 chars
		var remaining = chunk.length % 4;

		// Store the extra chars for later
		this.extra = chunk.slice(chunk.length - remaining);
		chunk = chunk.slice(0, chunk.length - remaining);

		// Create the new buffer and push
		var buf = Buffer.from(chunk).toString('base64');
		this.push(buf);
		cb();
	}

	/**
	 * Emits 1, 2, or 3 extra characters of base64 data.
	 * @param cb
	 * @private
	 */
	_flush(cb) {
		if ( this.extra.length )
			this.push(Buffer.from(this.extra).toString('base64'));

		cb();
	}

};