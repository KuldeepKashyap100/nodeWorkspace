const fs = require("fs");

const readStream = fs.createReadStream("../../media/powder-day.mp4");
const writeStream = fs.createWriteStream("../../media/copy.mp4", {
    // increase size of hose
    // highWaterMark: 150000
});

readStream.on("data", (chunk) => {
    // console.log(chunk.length);
    const isHoseEmpty = writeStream.write(chunk);
    if(!isHoseEmpty) {
        console.log("backPressure");
        readStream.pause();
    }
});

readStream.on("end", () => {
    console.log("readstream finished!");
    writeStream.end();
});

writeStream.on("close", () => console.log("file copied!"));
writeStream.on("drain", () => {
    console.log("drained");
    readStream.resume();
});

// all the above code can be replaced by below line
// readStream.pipe(writeStream).on("error", console.error);

// readStream.pause();

// process.stdin.on("data", (chunk) => {
//     if(chunk.toString().trim() === "finished") {
//         readStream.resume();
//     }
//     readStream.read();
// });