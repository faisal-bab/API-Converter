const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = app.get('port');
const API_SERVICE_URL = 'http://51.211.173.51:7673/API/API';
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname + '/uploads'));

// app.use(multer().array());
//-----------------------------//
// var corsOptions = {
//     origin: 'https://dev-v2-homelab.beyondtech.club:8080',
//     //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
app.use(cors());
app.options('*', cors());
app.use('/hamadi', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/hamadi': ''
    }
}));

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

http.createServer({}, app).listen(running_port, 2, ()=>{
    console.log('started proxy');
});

console.log('Listing at http::', running_port, port);
