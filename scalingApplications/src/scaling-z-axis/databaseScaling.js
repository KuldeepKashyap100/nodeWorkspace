const http = require('http');
const { LocalStorage } = require('node-localstorage');

const db = new LocalStorage('../data');

http.createServer((req, res) => {
    if(req.url === "/") {
        let requestCounter = db.getItem('requestCounter');
        db.setItem('requestCounter', ++requestCounter);
        console.log(`${process.pid}: ${requestCounter}`);
        res.end(`${process.pid}: ${requestCounter}`);
    }
    
}).listen(3000);