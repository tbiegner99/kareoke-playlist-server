const scheduler = require('node-schedule');

class JobScheduler {
    constructor() {
        this.jobs = {};
        this.jobIds = [];
    }

    scheduleJob(job) {
        const id = scheduler.scheduleJob(job.schedule, this.runJob(job));
        this.jobIds[id] = job;
        this.jobs[job.name] = id;
    }

    runJob(job) {
        return async () => {
            await job.run();
        };
    }

    cancelByName(jobName) {
        const id = this.jobs[jobName];
        scheduler.cancel(id);
        delete this.jobsIds[id];
        delete this.jobs[jobName];
    }

    cancelJob(id) {
        const job = this.jobIds[id];
        const jobName = job.name;
        scheduler.cancel(id);
        delete this.jobsIds[id];
        delete this.jobs[jobName];
    }
}

module.exports = new JobScheduler();
