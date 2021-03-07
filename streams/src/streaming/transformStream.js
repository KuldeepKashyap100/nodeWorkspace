const { Transform } = require("stream");

class ReplaceText extends Transform {
    constructor(char) {
        super();
        this.replaceChar = char;
    }

    _transform(chunk, encoding, callback) {
        const transformedChunk = chunk.toString().replace(/[a-z]|[A-Z]|[0-9]/g, this.replaceChar);
        this.push(transformedChunk);
        callback();
    }

    // to do something after read stream completed
    _flush(callback) {
        this.push("tranformation complete...");
        callback();
    }
}

const xStream = new ReplaceText("X");
process.stdin.pipe(xStream).pipe(process.stdout);