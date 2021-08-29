const logUpdate = require('log-update');
class TaskManager {
    constructor(tasks = [], concurrentCount = 3) {
        this.toDo = tasks;
        this.concurrent = concurrentCount;
        this.complete = [];
        this.running = [];
    }
    get getAnotherTask() {
        return this.concurrent > this.running.length && this.toDo.length;
    }
    graphTasks() {
        logUpdate(`
            toDo: ${this.toDo.map(_=>"X")}
            running: ${this.running.map(_=>"X")}
            complete: ${this.complete.map(_=>"X")}
        `);
    }
    run() {
        while(this.getAnotherTask) {
            const promise = this.toDo.shift();
            this.running.push(promise);
            promise.then(() => {
                this.complete.push(this.running.shift());
                this.graphTasks();
                this.run();
            });
            this.graphTasks();
        }
    }
}

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time * 1000));

const tasks = () => {
    const tasks = [];
    for(let i = 0; i < 10; i++) tasks.push(delay(i));
    return tasks;
}

const taskRunner = new TaskManager(tasks());
taskRunner.run();

// const putFilesAsync = (fileList, sftp, dirPath, dirName, __exports, activeFileWritingList, fileWriteCompletedList) => {
//     return new Promise((resolve, reject) => {
//       while(MAX_CONCURRET_WRITES > activeFileWritingList.length && fileList.length) {
//         const fileName = fileList.shift();
//         const currentTask = putFile(sftp, dirPath, dirName, fileName, __exports);
//         activeFileWritingList.push(currentTask);
//         currentTask.then(async () => {
//           const currentTaskIdx = activeFileWritingList.findIndex(task => task === currentTask);
//           fileWriteCompletedList.push(activeFileWritingList.splice(currentTaskIdx, 1));
//           console.log(fileWriteCompletedList.length, activeFileWritingList.length);
//           if(activeFileWritingList.length === 0) {
//             return resolve(fileWriteCompletedList);
//           }
//           await putFilesAsync(fileList, sftp, dirPath, dirName, __exports, activeFileWritingList, fileWriteCompletedList, fileList);
//           resolve(fileWriteCompletedList);
//         })
//         .catch((error) => {
//           reject(error);
//         });
//       }
//     });
//   }