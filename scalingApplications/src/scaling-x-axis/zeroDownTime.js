const http = require('http');
const cpus = require("os").cpus();
const cluster = require("cluster");

if(cluster.isMaster) {
    console.log("this is master process: " + process.pid);
    for(let i = 0; i < cpus.length; i++) {
        cluster.fork();
    }
    cluster.on("exit", worker => {
        console.log(`worker ${process.pid} had died.`);
        console.log(`only ${Object.keys(cluster.workers).length} Remaining.`);
        // to create new work every time a worker dies
        // cluster.fork();
    });
}
else {
    console.log(`started a worker at ${process.pid}`);
    http.createServer((req, res) => {
        res.end(`process: ${process.pid}`);

        if(req.url === "/kill") {
            process.exit();
        }
        else if(req.url === "/") {
        console.log(`serving from ${process.pid}`);
        }
    }).listen(3000);
}