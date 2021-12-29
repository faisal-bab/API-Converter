var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports = function(User, app, Tokens, Package, Offers, Campaign){
    var userRouter = express.Router();
    userRouter.post('/create', function(req, res) {
        var user = new User();
        user.userName = req.body.userName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.branch = req.body.branch;
        user.password = req.body.password;
        user.role = req.body.role;
        user.department = req.body.department;
        user.save(function(err) {
            if(!err){
                res.status(200).send({
                    status: 201,
                    success: true,
                    message: {
                        eng: 'user registered successfully.',
                    },
                    data: user
                });
            } else if(err.errors.userName){
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'User Name should be unique.'
                    }
                });
            }
            else if(err.errors.role){
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'Role is required.'
                    }
                });
            }
            else if(err.errors.password){
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'password is required.'
                    }
                });
            }
            else if(err){
                res.status(200).send({
                    status: 203,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            }
        });
    });
    userRouter.post('/login', function(req, res){
        User.findOne({userName: req.body.userName, isDeleted: {$ne: true}}, function(err, user){
            if(!user){
                res.status(200).send({
                    status: 404,
                    success: false,
                    message: {
                        eng: 'Authentication failed. User not found.',
                    }
                });
            }
            else if(user){
                var hash = user.password;
                bcrypt.compare(req.body.password, hash, function(err, isMatch){
                    if(err || !isMatch) {
                        res.send({
                            status: 203,
                            success: false,
                            message: {
                                eng: 'Authentication failed. Wrong password.',
                            }
                        });
                    }
                    else if(isMatch) {
                        var token = jwt.sign(user, app.get('superSecret'), {expiresIn: 999999});
                        res.status(200).send({
                            status: 200,
                            success: true,
                            message: {
                                eng: 'Login Successful, Welcome to the App!',
                            },
                            data: {
                                auth_token: token,
                                user: user
                            }
                        });
                        var tokens = new Tokens();
                        tokens.user_id = user._id;
                        tokens.token = token;
                        tokens.save({validateBeforeSave: false});
                    }                                
                });
            }
        });
    });
    userRouter.get('/users', function(req, res){
        User.find({ isDeleted: {$ne: true}  }, function(err, user){
            if(err){
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
                    status: 200,
                    success: true,
                    message: {
                        eng: 'Users retreived successfully.'
                    },
                    data: user
                });
            }
        });
    });
    userRouter.post('/delete', function(req, res){
        let userId = req.body.id;
        User.update({ _id: userId }, {
            $set: {
                isDeleted: true
            }
        }, function(err, user){
            if(err){
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
                    status: 200,
                    success: true,
                    message: {
                        eng: 'User deleted successfully.'
                    }
                });
            }
        });
    });
    userRouter.post('/updateBranch', function(req, res){
        let userId = req.body.id;
        User.update({ _id: userId }, {
            $set: {
                branch: req.body.branch
            }
        }, function(err, user){
            if(err){
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
                    status: 200,
                    success: true,
                    message: {
                        eng: 'User updated successfully.'
                    }
                });
            }
        });
    });
    userRouter.post('/updatePassword', function(req, res){
        let userId = req.body.id;
        User.findOne({ _id: userId }, function(err, user) {
            if(err){
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            } else if(!user) {
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Could not found user',
                    },
                });
            } else {
                user.password = req.body.password;
                user.save(function(err) {
                    if(!err){
                        res.status(200).send({
                            status: 200,
                            success: true,
                            message: {
                                eng: 'Password changed successfully.',
                            },
                            data: user
                        });
                    } else if(err.errors.password){
                        res.status(200).send({
                            status: 411,
                            success: false,
                            message: {
                                eng: 'password is required.'
                            }
                        });
                    }
                    else if(err){
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
            }
        });
    });

    userRouter.get('/admin-report', async function(req, res){
        let campaigns = [];
        let packages = [];
        let offers = [];
       await Package.find({ isDeleted: {$ne: true} })
        .populate({path: "createdBy", model: User, select: "firstName lastName"})
        .exec(function(err, package){
            if(err){
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            } else {
              packages = package
            }
        });
        await Offers.find({isDeleted: false}).populate({path: "createdBy", model: User, select: "firstName lastName"}).exec( function(err, offer) {
            if(err){
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            } else {
               offers = offer;
            }
        });
        await Campaign.find({isDeleted: false})
        .populate({path: "userId", model: User, select: "firstName lastName"})
        .exec(function (err, campaign) {
            if (err) {
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Server error.',
                    },
                    error: err
                });
            } else {
                campaigns = campaign
                res.status(200).send({
                    status: 200,
                    success: true,
                    message: {
                        eng: 'Campaigns retreived successfully.'
                    },
                    data:[ {
                    campaign : campaigns,
                    package : packages,
                    offer : offers,
                    }]
                });
            }
        });
    })
    return userRouter;
};
