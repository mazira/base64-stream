# Introduction

While Node.js has built-in support for Base64 data, it does not come with the ability to encode / decode data in a stream.

This library contains a streaming Base64 encoder and a streaming Base64 decoder for use with Node.js. These classes are written using the Node.js [stream interfaces](http://nodejs.org/api/stream.html) and are well covered with unit tests.

# Usage

## Installation

To install base64-stream

    npm install base64-stream
    
## Examples
This example encodes an image and pipes it to stdout.

```javascript
var http = require('http');
var {Base64Encode} = require('base64-stream');

var img = 'http://farm3.staticflickr.com/2433/3973241798_86ddfa642b_o.jpg';
http.get(img, function(res) {
    if (res.statusCode === 200)
        res.pipe(new Base64Encode()).pipe(process.stdout);
});
// or with node-fetch:
fetch(img)
.then(r=>r.body.pipe(new Base64Encode()).pipe(process.stdout))
.catch(console.error);
```

This example takes in Base64 encoded data on stdin, decodes it, an pipes it to stdout.
```javascript
var {Base64Encode} = require('base64-stream');
process.stdin.pipe(new Base64Encode()).pipe(process.stdout);
```


# Requirements

This module currently requires Node 6.0.0 or higher.

# Testing

To run the unit tests

    npm test

# License
MIT
