const fs = require("fs");
const requestHandler = (req, res) => {
  // res.write(`<h1>${req.url}</h1>`);
  // res.write(`<h1>${req.method}</h1>`);
  // res.write(`<h1>${JSON.stringify(req.headers)}</h1>`);
  // res.end();

  if (req.url === "/") {
    res.write("<html>");
    res.write(
      '<form action="/message" method="POST"><input type="text" name="message"></input><button type="submit">Send</button></form>'
    );
    res.write("</html>");
    return res.end();
  }
  if (req.url === "/message" && req.method === "POST") {
    const body = [];
    req.on("data", chunk => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      //   fs.writeFileSync("message.txt", parsedBody);
      // writeFileSync will block the thread until writing is complete even if it is 100's of mbs.
      fs.writeFile("message.txt", parsedBody, err => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.write("<html>");
  res.write(" hello world kkk");
  res.write("</html>");
  res.end();

  //process.exit();
}

// module.exports = requestHandler;

// module.exports = {
//   handler: requestHandler,
//   someText: "some Text"
// };

// module.exports.handler = requestHandler;

exports.handler =  requestHandler;
exports.someText = "Some text";
