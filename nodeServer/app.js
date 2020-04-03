const http = require("http");
 9292
const route = require('./routes')

const server = http.createServer(route.handler);

console.log(route.someText);
server.listen("3000");

// npm i nodemon --save-dev ---> save dev dependencies during only development
//not in production
