# Introduction

While Node.js has built-in support for Base64 data, it does not come with the ability to encode / decode data in a stream.

This library contains a streaming Base64 encoder and a streaming Base64 decoder for use with Node.js. These classes are written using the new Node.js v0.10 [stream interfaces](http://nodejs.org/api/stream.html) and are well covered with unit tests.

# Installation

To install base64-stream

    npm install base64-stream

# Requirements

This module currently requires Node v0.8 or higher. Support for versions prior to v0.10 is made possible by using the [readable-stream](https://github.com/isaacs/readable-stream) module.

# Usage

To use base64-stream

```javascript
var fs = require('fs');
var Base64Encode = require('base64-stream').Encode;
var Base64Decode = require('base64-stream').Decode;

var streamMailAttachment = function(req, res, next) {
    var getAttachment(...);
    attachmentStream.pipe(new Base64Encode()).pipe(res);

    // would also work
    // attachmentStream.pipe(Base64Encode()).pipe(res);
}

var uploadAttachment = function(req, res, next) {
    var email = createEmail(...);

    var stream = req.pipe(new Base64Encode());
    email.streamAttachment(stream);
}
```

# Testing

To run the unit tests

    npm test
