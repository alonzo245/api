var schedule = require('node-schedule');
 
var j = schedule.scheduleJob('20 12 1-31 1-12 * ', (fireDate) => {
  console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
});