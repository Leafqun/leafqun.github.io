let fs = require("fs")
let data = require('./testData')
let geo1 = require('./get-geography-value1')
let a = data.default
let geo = geo1.default
fs.appendFileSync('input.js', 'export default [\n',  function(err) {
    if (err) {
        return console.error(err);
    }
});
console.log(geo['北京'][0])
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
a.map((val, index) => {
    let str = '    {name: \'' + val.name + '\', location: ' + '[' + (geo[val.name] ? geo[val.name] : '') + ']' + ', devid: ' + 3334894465 + index + ', time: \'' + new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).Format("yyyy-MM-dd HH:mm:ss") + '\'},\n'
        fs.appendFileSync('input.js', str,  function(err) {
        if (err) {
            return console.error(err);
        }
    });
})
fs.appendFileSync('input.js', ']',  function(err) {
    if (err) {
        return console.error(err);
    }
});
