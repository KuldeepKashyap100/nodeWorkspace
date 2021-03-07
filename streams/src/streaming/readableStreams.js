const { Readable } = require("stream");

class StreamFromArray extends Readable {
    constructor(array) {
        // super({ encoding: "UTF-8" });
        super({ objectMode: true});
        this.array = array;
        this.index = 0;
    }

    _read() {
        if(this.index < this.array.length) {
            // const chunk = this.array[this.index++];
            const chunk = { "item" : this.array[this.index++], "index" :  this.index};
            this.push(chunk);
        }
        else{
            this.push(null);
        }
    }
}

const readStream = new StreamFromArray(["first", "second", "third"]);

readStream.on("data", (chunk) => console.log(chunk));
readStream.on("end", () => console.log("done!"));