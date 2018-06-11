const moment = require('moment');
const data = require('./data');
const Average = require('./Average');

datePattern = 'YYYY-MM-DD';
const today = moment(moment().format(datePattern));
const createStringDate = date => moment(date).format(datePattern);

class Timeline {
    constructor(data, days) {
        this.data = data;
        this.days = days;
    }

    createHash() {
      return this.data.reduce((object, items) => {
          const { date, value } = items;
          const stringDate = createStringDate(date);

          object[stringDate] = object[stringDate] || [];
          object[stringDate].push(value);

          return object;
      }, {})
    }

    formatHash(hashValue) {
        const count = hashValue && hashValue.length;
        const sum = hashValue && hashValue.reduce((current, next) => current + next, 0);
        const average = Math.round(sum / count);

        const averageObject = new Average(sum, count, average);
        return averageObject;
    }

    create() {
        const startDateMoment = moment(today).subtract(this.days, 'days');
        const hash = this.createHash(this.data);

        const timeline = {};
        while(startDateMoment <= today) {
            const stringDate = createStringDate(startDateMoment);
            const hashValue = this.formatHash(hash[stringDate]);

            hash[stringDate] ?
              timeline[stringDate] = {...hashValue} :
              timeline[stringDate] = {};

            startDateMoment.add(1, 'day');
        }
        return timeline;
    };
}

const timeline = new Timeline(data, 5);

console.log(timeline.create())
