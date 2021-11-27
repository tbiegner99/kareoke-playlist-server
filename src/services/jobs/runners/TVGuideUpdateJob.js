const Runner = require('../Runner');
const TVGuideService = require('../../tv/guide');

class TVGuideUpdateJob extends Runner {
    constructor(name = 'TV Guide Update Job') {
        super();
        this.guideService = new TVGuideService();
        this.jobName = name;
    }

    async run() {
        try {
            console.log('Starting TV guide update');
            await this.guideService.updateGuide();
            console.log('Finished TV guide update');
        } catch (err) {
            console.log(err);
        }
    }

    get name() {
        return this.jobName;
    }

    get schedule() {
        return '10-59/15 * * * *';
    }
}

module.exports = TVGuideUpdateJob;
