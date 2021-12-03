var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var voucher_codes = require('voucher-code-generator');

module.exports = function(User, Coupon){
    var userRouter = express.Router();
    userRouter.post('/create', function(req, res) {
        var coupon = new Coupon();
        const code = voucher_codes.generate({
            length: 8,
            count: 1
        });
        coupon.couponCode = code[0].toUpperCase();
        coupon.givenTo = req.body.mobile;
        coupon.amount = parseFloat(req.body.amount);
        coupon.createdBy = req.decoded._doc._id;
        coupon.save(function(err) {
            if(!err){
                res.status(200).send({
                    status: 201,
                    success: true,
                    message: {
                        eng: 'created coupon successfully.',
                    },
                    data: coupon
                });
            } else if(err){
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            }
        });
    });
    userRouter.get('/search', function (req, res) {
        let findQuery = {};
        if (req.query.mobile) {
            findQuery.givenTo = req.query.mobile
        }
        if (req.query.couponCode) {
            findQuery.couponCode = req.query.couponCode
        }
        Coupon.find(findQuery).exec( function(err, coupons){
            if(err) {
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            } else {
                res.status(200).send({
                    status: 201,
                    success: true,
                    data: coupons
                });
            }
        })
    });
    return userRouter;
};
