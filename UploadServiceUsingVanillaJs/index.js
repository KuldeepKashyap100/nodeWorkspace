const http = require("http");
const fs = require("fs").promises;
const server = http.createServer();
server.on("listening", () => console.log("listening..."));
server.on("request", async (req, res) => {
  if(req.url === "/") res.end(await fs.readFile("index.html"));
  else if(req.url === "/upload") {
    const fileName = req.headers["file-name"];
    req.on("data", async (chunk) => {
      await fs.appendFile(fileName, chunk);
    });
    req.on("end", () => res.end("File uploaded!!!"));
  }
});

server.listen(8080);