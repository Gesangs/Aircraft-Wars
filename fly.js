var express = require('express')
var app = express()
var path = require('path');
 app.use(express.static(path.join(__dirname, 'public')));
 var port = 8081;

module.exports = app.listen(port, function(err) {
    if(err) {
        console.log(err)
        return
    }
    console.log(port+'\n')
})