// imports
const app = require('./app.js');

// server config options
const PORT = 3000;
const HOST = 'localhost';

// set the server to listen
app.listen(PORT, function () {
    console.log('listening on http:'+HOST+':'+PORT+'/');
});
