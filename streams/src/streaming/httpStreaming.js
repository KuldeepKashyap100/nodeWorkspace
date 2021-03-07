const { createServer } = require('http');
const { stat, createReadStream, createWriteStream } = require("fs");
const { promisify } = require("util");

const multiparty = require("multiparty");

const fileName = "../../media/powder-day.mp4";
const fileInfo = promisify(stat);

const handleVideoGetRequest = async (req, res) => {
    const { size } = await fileInfo(fileName);
    const range = req.headers.range;
    if(range) {
        let [start, end] = range.replace(/bytes=/, "").split("-");
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1;
        // 206 for partial content
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": (end - start) + 1,
            "Content-Type": "video/mp4"
        });
        createReadStream(fileName, {start, end}).pipe(res);
    }
    else {
        res.writeHead(200, {
            "Content-Type": "video/mp4", 
            "Content-Length": size
        });
        createReadStream(fileName).pipe(res);
    }
}

const handleVideoPostRequest = (req, res) => {
    // req.pipe(res);
    // req.pipe(process.stdout);
    // req.pipe(createWriteStream("../../media/uploadedFile"));

    const form = new multiparty.Form();
    form.on("part", (part) => {
        part.pipe(createWriteStream(`../../media/uploaded-${part.filename}`))
        .on("close",() => {
            res.end(`
                <h1>Uploaded file: ${part.filename}</h1>
            `);
        });
    });
    // it will check all the form data(uploaded files as well) in the 
    // request and fire 'part' event on reading a form feild. 
    form.parse(req);
}

createServer((req, res) => {
    if(req.method === "POST") {
        handleVideoPostRequest(req, res);
    }
    else if(req.url === "/video") {
        handleVideoGetRequest(req, res);
    }
    else {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(`
        <form enctype="multipart/form-data" method="POST" action="/">
            <input type="file" name="upload-file">
            <button>Upload File</button>
        </form>
        `);
    }
}).listen(3000, () => console.log("Started listening on 3000"));