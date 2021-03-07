const http = require('http');
const fs = require('fs');
const file = "../../media/powder-day.mp4";

// node --trace_gc buffer.js
http.createServer((req, res) => {
    fs.readFile(file, (error, data) => {
        res.writeHeader(200, {'Content-Type': "video/mp4"});
        res.end(data);
    });
}).listen(3000, () => console.log("buffer -> localhost:3000"));


http.createServer((req, res) => {
    res.writeHeader(200, {'Content-Type': "video/mp4"});
    fs.createReadStream(file).pipe(res);
}).listen(3001, () => console.log("buffer -> localhost:3001"));