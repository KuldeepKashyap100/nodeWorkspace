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