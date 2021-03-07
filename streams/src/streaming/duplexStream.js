const { createReadStream, createWriteStream } = require("fs");
const { PassThrough, Duplex } = require("stream");

const readStream = createReadStream("../../media/powder-day.mp4");
const writeStream = createWriteStream("../../media/copy.mp4");
const report = new PassThrough();

let totalSize = 0;
report.on("data", (chunk) => {
    totalSize += chunk.length;
    console.log("bytes: "+ totalSize);
});

class Throttle extends Duplex {
    constructor(ms) {
        super();
        this.delay = ms;
    }
    _write(chunk, encoding, callback) {
        this.push(chunk);
        setTimeout(callback, this.delay);
    }

    _read() {}

    _final() {
        this.push(null);
    }
}

const throttle = new Throttle(100);


readStream.pipe(report).pipe(throttle).pipe(writeStream);