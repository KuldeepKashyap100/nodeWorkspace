const { promisify } = require('util');
const https = require('https');
const fs = require('fs');
const cb = () => console.log(data);
let getData = (cb) => https.get("https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues", (res)=> {
    let data = "";
    res.on("data", (d) => data+=d);
    res.on("end", () => cb(null, data));
});

// let promiseGetData = () => {
//     return new Promise((resolve, reject) => {
//         getData(res => {
//             resolve(res);
//         });
//     })
// };

// promiseGetData = promisify(getData);

// promiseGetData().then((data) => {
//     console.log("Got data successfully", data);
// })
// .catch((err) => {
//     console.error(err)
// });

fs.link("text.txt", "text-1.txt" ,(err) => {
    if(err) throw err;
    else console.log("permissions changes");
});
