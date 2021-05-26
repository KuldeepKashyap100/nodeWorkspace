class Logger {

    constructor() {
        this.logs = [];
    }

    get count() {
        return this.logs.length;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        console.log(`${timestamp} - ${message}`);
    }

}

// class Singleton {

//   constructor() {
//       if (!Singleton.instance) {
//           Singleton.instance = new Logger();
//       }
//   }

//   getInstance() {
//       return Singleton.instance;
//   }

// }

// module.exports = Singleton;

/**
 * other way to simply Implement singleton in node js,
 * and that's simply to export the instance of Logger
 * from Node JS module.
 * 
 * The idea here is that when we run this file, it will run once
 * create new instance of the logger and save it in cache
 * 
 * that means node js will automatically handle the exporting
 * the same instance of the logger to every other module that wants to consume it.
 */

module.exports = new Logger();
