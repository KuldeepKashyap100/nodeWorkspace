const http = require('http');
const cpus = require("os").cpus();
const cluster = require("cluster");

if(cluster.isMaster) {
    console.log("this is master process: " + process.pid);
    for(let i = 0; i < cpus.length; i++) {
        cluster.fork();
    }
}
else {
    http.createServer((req, res) => {
        const message = `worker ${process.pid}...`;
        console.log(message);
        res.end(message);
    }).listen(3000);
}