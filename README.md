# Introduction

This library contains a streaming Base64 encoder and a streaming Base64 decoder. These streams are written using the new Node.js v0.10.0 `Stream` interfaces and are well covered with unit tests.

# Usage

To install base64-stream

    npm install base64-stream

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
