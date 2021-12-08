const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const middleware = require('./app/middlewares/middleware');

const app = express();
const port = app.get('port');
//-----------------------------//
app.set('superSecret', config.secret);
//-----------------------------//
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
//-----------------------------//
// var corsOptions = {
//     origin: 'https://dev-v2-homelab.beyondtech.club:8080',
//     //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
app.use(cors());
app.options('*', cors());

//import models
const User = require('./app/models/user');
const Coupon = require('./app/models/coupon');
const Token = require('./app/models/token');
const Package = require('./app/models/package');
const Patient = require('./app/models/patient');
const Offers = require('./app/models/offers');
const Department = require('./app/models/department');
const Branch = require('./app/models/branch');

//create router
const UserRouter = require('./app/routes/userRoute')(User, app, Token);
const CouponRouter = require('./app/routes/couponRoute')(User, Coupon);
const PackageRouter = require('./app/routes/packageRoute')(Package);
const PatientRouter = require('./app/routes/patientRoute')(Patient);
const OfferRouter = require('./app/routes/offersRoute')(Offers, Package);
const DepartmentRouter = require('./app/routes/departmentRoute')(Department);
const BranchRouter = require('./app/routes/branchRoute')(Branch);

//define path
app.use('/api/user', UserRouter);
app.use('/api/coupon', middleware.newAuthentication, CouponRouter);
app.use('/api/package', middleware.newAuthentication, PackageRouter);
app.use('/api/patient', middleware.newAuthentication, PatientRouter);
app.use('/api/offer', middleware.newAuthentication, OfferRouter);
app.use('/api/department', middleware.newAuthentication, DepartmentRouter);
app.use('/api/branch', middleware.newAuthentication, BranchRouter);

//-----------------------------//
mongoose.connect(config.database, { useMongoClient: true }, function (err, conn) {
    if (err) {
        console.log("Mongo Connection Error", err);
    }
    if (!err && conn) {
        console.log("Mongo Connection Established");
    }
});

app.get('/', function (req, res) {
    res.json({
        status: 200,
        message: 'Welcome to the Delta Homelab!'
    });
});
//-----------------------------//
const running_port = process.env.PORT || 8080;

http.createServer({}, app).listen(running_port);

console.log('Listing at http::', running_port, port);
