const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();
const port = app.get('port');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(multer().array());
//-----------------------------//
// var corsOptions = {
//     origin: 'https://dev-v2-homelab.beyondtech.club:8080',
//     //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
app.use(cors());
app.options('*', cors());

//create router
const parser = require('./app/routes/parser')();

//define path
app.use('/api/parse', parser);

app.get('/', function (req, res) {
    res.json({
        status: 200,
        message: 'Welcome to json parser!'
    });
});
//-----------------------------//
const running_port = process.env.PORT || 8080;

http.createServer({}, app).listen(running_port);

console.log('Listing at http::', running_port, port);
