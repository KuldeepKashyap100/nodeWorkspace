const { fork } = require("child_process");

const processes = [
    fork("./adviceServer", [3001]),
    fork("./adviceServer", [3002]),
    fork("./adviceServer", [3003])
];

console.log(`forked ${processes.length} processes`);
