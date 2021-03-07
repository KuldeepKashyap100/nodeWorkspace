const { createWriteStream } = require("fs");
const writeStream = createWriteStream("../../media/textFile.txt");

process.stdin.pipe(writeStream);

// using unix pipe to pipe the data
// echo "hello world" | node pipingData