let fs = require("fs")
let data = require('./sqlInput')
let a = data.default
a.map((val, index) => {
    let str = 'insert into alarm (city, location, devid, create_time) values (\'' + val['name'] + '\', \'' + val['location'] + '\', \'' + val['devid'] + '\', \'' + val['time'] + '\');\n'
    fs.appendFileSync('alarm.sql', str,  function(err) {
        if (err) {
            return console.error(err);
        }
    });
})
