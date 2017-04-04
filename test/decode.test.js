/*global describe, it*/
const should = require('should');
const { Base64Decode } = require('../');

describe('Base64Decode', function () {
    /**
     * This function emits an array of string chunks to the stream, and then compares the output to a given value.
     * @param stream
     * @param inputs
     * @param output
     */
    function testStream(stream, inputs, output) {
        for (let i = 0; i < inputs.length; i++) {
            stream.write(inputs[i]);
        }

        stream.end();

        const result = stream.read();
        result.should.be.an.instanceOf(Buffer);
        result.toString('utf8').should.equal(output);
    }

    describe('input in a single chunk', function () {
        it('should properly decode a Buffer', function () {
            testStream(new Base64Decode(), [Buffer.from('YW55IGNhcm5hbCBwbGVhc3VyZS4=')], 'any carnal pleasure.');
        });

        it('should properly decode a string', function () {
            testStream(new Base64Decode(), ['YW55IGNhcm5hbCBwbGVhc3VyZS4='], 'any carnal pleasure.');
        });

        it('should properly decode string containing newlines', function () {
            testStream(new Base64Decode(), ['YW55I\nGNhcm\n5hbCB\nwbGVh\nc3VyZ\nS4='], 'any carnal pleasure.');
        });

        it('should properly decode a string without padding', function () {
            testStream(new Base64Decode(), ['YW55IGNhcm5hbCBwbGVhc3VyZS4'], 'any carnal pleasure.');
        });
    });

    describe('input in multiple chunks, lengths divisible by 4', function () {
        it('should properly decode a string', function () {
            testStream(new Base64Decode(), ['YW55IGNhcm5h', 'bCBwbGVhc3Vy', 'ZS4='], 'any carnal pleasure.');
        });

        it('should properly decode string containing newlines', function () {
            testStream(new Base64Decode(), ['YW55IGNhcm5h\n', 'bCBwbGVhc3Vy\n', 'ZS4=\n'], 'any carnal pleasure.');
        });

        it('should properly decode a string without padding', function () {
            testStream(new Base64Decode(), ['YW55IGNhcm5h', 'bCBwbGVhc3Vy', 'ZS4'], 'any carnal pleasure.');
        });
    });

    describe('input in multiple chunks, lengths not divisible by 4', function () {
        it('should properly decode a string', function () {
            testStream(new Base64Decode(), ['YW55I', 'GNhcm5h', 'bCBwbGVhc3VyZ', 'S4='], 'any carnal pleasure.');
            testStream(new Base64Decode(), ['YW55I', 'GNhcm5h', 'bCBwbGVhc3VyZS4', '='], 'any carnal pleasure.');
        });

        it('should properly decode string containing newlines', function () {
            testStream(new Base64Decode(), ['YW55I\n', 'GNhcm5h\n', 'bCBwbGVhc3VyZ\n', 'S4=\n'], 'any carnal pleasure.');
        });

        it('should properly decode a string without padding', function () {
            testStream(new Base64Decode(), ['YW55I', 'GNhcm5h', 'bCBwbGVhc3VyZ', 'S4'], 'any carnal pleasure.');
        });
    });
});
