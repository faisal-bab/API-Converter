var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var config = require('../../config');
var Tokens = require('../models/token');
app.set('superSecret', config.secret);
module.exports = {
    newAuthentication: function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    res.status(401).send({
                        status: 401,
                        success: false,
                        message: {
                            eng: "not authorized",
                            ar: "غير مخول"
                        }
                    });
                }
                else {
                    if (decoded._doc && decoded._doc != null && decoded._doc != undefined) {
                        req.decoded = decoded;
                    } else {
                        req.decoded = {};
                        req.decoded["_doc"] = decoded;
                    }
                    Tokens.findOne({
                        user_id: req.decoded._doc._id,
                        token: token
                    }, function (err, token_obj) {
                        if (!err && token_obj && token_obj.token === token) {
                            next();
                        }
                        else {
                            res.status(401).send({
                                status: 401,
                                success: false,
                                message: {
                                    eng: "not authorized",
                                    ar: "غير مخول"
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            res.status(401).send({
                status: 401,
                success: false,
                message: {
                    eng: "not authorized",
                    ar: "غير مخول"
                }
            });
        }
    }
};
