/*global describe, it*/
const should = require('should');
const { Base64Encode } = require('../');

describe('Base64Encode', function () {
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
        result.should.eql(output);
    }

    describe('input in a single chunk', function () {
        it('should properly encode a string', function () {
            testStream(new Base64Encode(), ['any carnal pleasur'], 'YW55IGNhcm5hbCBwbGVhc3Vy');
        });

        it('should properly encode a Buffer', function () {
            testStream(new Base64Encode(), [Buffer.from('any carnal pleasur')], 'YW55IGNhcm5hbCBwbGVhc3Vy');
        });

        it('should properly encode a Buffer and include padding', function () {
            testStream(new Base64Encode(), ['any carnal pleasure.'], 'YW55IGNhcm5hbCBwbGVhc3VyZS4=');
        });
    });

    describe('input in multiple chunks, lengths divisible by 3', function () {
        it('should properly encode a Buffer', function () {
            testStream(new Base64Encode(), [
                Buffer.from('any ca'), Buffer.from('rnal p'), Buffer.from('leasur')
            ], 'YW55IGNhcm5hbCBwbGVhc3Vy');
        });

        it('should properly encode a Buffer and include padding', function () {
            testStream(new Base64Encode(), [
                Buffer.from('any ca'), Buffer.from('rnal p'), Buffer.from('leasure.')
            ], 'YW55IGNhcm5hbCBwbGVhc3VyZS4=');
        });
    });

    describe('input in multiple chunks, lengths not divisible by 3', function () {
        it('should properly encode a Buffer', function () {
            testStream(new Base64Encode(), [
                Buffer.from('any carn'), Buffer.from('al pl'), Buffer.from('easur')
            ], 'YW55IGNhcm5hbCBwbGVhc3Vy');
        });

        it('should properly encode a Buffer and include padding', function () {
            testStream(new Base64Encode(), [
                Buffer.from('any carn'), Buffer.from('al pl'), Buffer.from('easure.')
            ], 'YW55IGNhcm5hbCBwbGVhc3VyZS4=');
        });
    });

    describe('with inputEncoding specified', function () {
        it('should properly encode strings with unusual input encoding', function () {
            const stream = new Base64Encode({ inputEncoding: 'hex' });

            const input = Buffer.from('any carnal pleasur').toString('hex');
            testStream(stream, [input], 'YW55IGNhcm5hbCBwbGVhc3Vy');
        });

        it('should not affect Buffer inputs', function () {
            const stream = new Base64Encode({ inputEncoding: 'base64' });

            const input = Buffer.from('00010203', 'hex');
            testStream(stream, [input], 'AAECAw==');
        });
    });

    describe('with outputEncoding specified', function () {
        it('should properly output provided string encoding', function () {
            const stream = new Base64Encode({ outputEncoding: 'hex' });

            const input = Buffer.from('any carnal pleasur');
            const output = Buffer.from('YW55IGNhcm5hbCBwbGVhc3Vy').toString('hex');
            testStream(stream, [input], output);
        });

        it('should properly output Buffers when null given', function () {
            const stream = new Base64Encode({ outputEncoding: null });

            const input = Buffer.from('any carnal pleasur');
            const output = Buffer.from('YW55IGNhcm5hbCBwbGVhc3Vy');
            testStream(stream, [input], output);
        });
    })

    describe('with line length specified', function () {
        it('should properly encode a Buffer', function () {
            testStream(new Base64Encode({ lineLength: 5 }), [
                Buffer.from('any carn'), Buffer.from('al pl'), Buffer.from('easur')
            ], 'YW55I\r\nGNhcm\r\n5hbCB\r\nwbGVh\r\nc3Vy');
        });

        it('should properly encode a Buffer and include padding', function () {
            testStream(new Base64Encode({ lineLength: 5 }), [
                Buffer.from('any carn'), Buffer.from('al pl'), Buffer.from('easure.')
            ], 'YW55I\r\nGNhcm\r\n5hbCB\r\nwbGVh\r\nc3VyZ\r\nS4=');
        });
    });

    describe('with prefix specified', function () {
        it('should properly encode a Buffer', function () {
            testStream(new Base64Encode({ prefix: 'base64: ' }), [
                Buffer.from('any carn'), Buffer.from('al pl'), Buffer.from('easur')
            ], 'base64: YW55IGNhcm5hbCBwbGVhc3Vy');
        });

        it('should properly encode a Buffer and include padding', function () {
            testStream(new Base64Encode({ prefix: 'base64: ' }), [
                Buffer.from('any carn'), Buffer.from('al pl'), Buffer.from('easure.')
            ], 'base64: YW55IGNhcm5hbCBwbGVhc3VyZS4=');
        });
    });
});
