const http = require("http");
const port = parseInt(process.argv[2] || '3000');
const options = [
    "Go for it!",
    "Maybe sleep on it",
    "Do some more research",
    "I don't know",
    "I wouldn't"
];
const server = http.createServer((req, res) => {
    const randomIdx = Math.floor(Math.random() * options.length);
    const advice = options[randomIdx];
    const payLoad = JSON.stringify({
        processId: process.pid,
        advice
    });
    console.log(`advice from ${process.pid}: ${advice}`);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(payLoad);
});

server.listen(port, () =>{
    console.log(`advice service running on port ${port}`);
});