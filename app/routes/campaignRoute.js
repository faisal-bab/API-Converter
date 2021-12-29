var express = require('express');
var voucher_codes = require('voucher-code-generator');
var moment = require('moment');
var multer = require('multer');
var mime = require('mime-types');
var smsFunction = require('../controllers/sendSMS');
var mongoose = require('mongoose');
var ejs = require('ejs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('/////')
        cb(null, 'uploads/campaigns/marketing')
    },
    filename: function (req, file, cb) {
        console.log('//nnnnnnnn///')
        const uniqueSuffix = file.filename + moment().format("YYYY-MM-DDTHH:mm:ss:SSSZ") + '.' + mime.extension(file.mimetype);
        cb(null, uniqueSuffix)
        console.log(file.fieldname + '-' + uniqueSuffix)
    }
});
var upload = multer({ storage: storage });
module.exports = function (Campaign, Offer, Package, User, CampaignPatient, Patient) {
    var campaignRouter = express.Router();
    // campaignRouter.post('/create', function (req, res) {
    //     // upload(req, res, function (err) {
    //     //     if (err instanceof multer.MulterError) {
    //     //       // A Multer error occurred when uploading.
    //     //       console.log(err)
    //     //     } else if (err) {
    //     //       // An unknown error occurred when uploading.
    //     //       console.log(err)
    //     //     } else {
    //     //         console.log(req.body, req.files, req.file)
    //     //     }

    //     //     // Everything went fine.
    //     //   })
    //     try {
    //         var patientDetails = req.body && req.body.file || [];
    //         var userId = req.decoded._doc._id || req.decoded._id;
    //         if (patientDetails.length > 0) {
    //             let uniquePatientDetails = [];
    //             uniquePatientDetails = patientDetails.map(el => {
    //                 const index = uniquePatientDetails.find(ele => { return ele && ele.mobile == el.mobile });
    //                 if (index != -1) {
    //                     var campaign = new Campaign();
    //                     campaign.name = req.body.name;
    //                     campaign.patientName = el.patientName;
    //                     campaign.mobile = el.mobile;
    //                     campaign.nationalId = el.nationalId;
    //                     campaign.date = req.body.date && moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
    //                     campaign.package = req.body.package;
    //                     campaign.offer = req.body.offer;
    //                     campaign.status = 1;
    //                     campaign.userId = userId;
    //                     const code = voucher_codes.generate({
    //                         length: 8,
    //                         count: 1
    //                     });
    //                     campaign.couponCode = code;
    //                     return campaign;
    //                 }
    //                 // var campaign = new Campaign();
    //                 // campaign.name = req.body.name;
    //                 // campaign.date = req.body.date && moment(req.body.date).format("YYYY-MM-DD HH:mm:ss");
    //                 // campaign.package = req.body.package;
    //                 // campaign.offer = req.body.offer;
    //                 // campaign.status = 1;
    //                 // uniquePatientDetails = patientDetails.map(el => {
    //                 //     const index = uniquePatientDetails.find(ele => { return ele && ele.mobile == el.mobile });
    //                 //     if (index != -1) {
    //                 //         const code = voucher_codes.generate({
    //                 //             length: 8,
    //                 //             count: 1
    //                 //         });
    //                 //         el.couponCode = code;
    //                 //         // campaign.patientName = el.patientName;
    //                 //         // campaign.mobile = el.mobile;
    //                 //         // campaign.nationalId = el.nationalId;
    //                 //         return el;
    //                 //     }
    //                 // });
    //             });
    //             Campaign.create(uniquePatientDetails, function (err, result) {
    //                 if (err) {
    //                     res.status(200).send({
    //                         status: 411,
    //                         success: false,
    //                         message: {
    //                             eng: 'Server error.',
    //                         },
    //                         error: err
    //                     });
    //                 } else {
    //                     res.status(200).send({
    //                         status: 201,
    //                         success: true,
    //                         message: {
    //                             eng: 'campaign registered successfully.',
    //                         },
    //                         data: result
    //                     });
    //                 }
    //             })
    //             //                 const code = voucher_codes.generate({
    //             //                     length: 8,
    //             //                     count: 1
    //             //                 });
    //             //                 campaign.couponCode = code[0].toUpperCase();
    //             //                 // campaign.save(function(err) {
    //             //                 //     if(!err){
    //             //                 if (req.body.offer) {
    //             //                     Offer.find({ _id: campaign.offer }).exec(function (err, offer) {
    //             //                         var expiryDate = moment().add(offer[0].validity, 'days').format('DD MMM YYYY');
    //             //                         var message = `Dear ${campaign.firstName}
    //             // Congratulations, you have earned a discount of ${offer[0].amount}SR on ${offer[0].offerName.eng}.
    //             // This coupon is Valid until ${expiryDate}.
    //             // Coupon Code - ${campaign.couponCode}`;
    //             //                         var country_code = req.body.countryCode ? req.body.countryCode : '+966';
    //             //                         smsFunction.sendSMS(req.body.mobile, message, 'otp', country_code);
    //             //                     });
    //             //                 }

    //             //     } else if(err) {
    //             //         res.status(200).send({
    //             //             status: 411,
    //             //             success: false,
    //             //             message: {
    //             //                 eng: 'Server error.',
    //             //             },
    //             //             error: err
    //             //         });
    //             //     }
    //             // });
    //         } else {
    //             res.status(200).send({
    //                 status: 411,
    //                 success: false,
    //                 message: {
    //                     eng: 'Patient Details are Required',
    //                 },
    //                 error: err
    //             });
    //         }
    //     } catch (err) {
    //         res.status(200).send({
    //             status: 411,
    //             success: false,
    //             message: {
    //                 eng: 'ERROR In Excution Of API',
    //             },
    //             error: err
    //         });
    //     }
    // });
    campaignRouter.post('/create', async function (req, res) {
        try {
            var patientDetails = req.body && req.body.file || [];
            var userId = req.decoded._doc._id || req.decoded._id;
            const date = moment(req.body.date.split('T')[0]).add({d: 1, h:23, m:59, s:59}).format("YYYY-MM-DD HH:mm:ss");
            if (patientDetails.length > 0) {
                let uniquePatientDetails = [];
                var campaign = new Campaign();
                campaign.name = req.body.name;
                campaign.date = date;
                campaign.package = req.body.package;
                campaign.offer = req.body.offer;
                campaign.status = 1;
                campaign.userId = userId;

                patientDetails.map(el => {
                    const index = uniquePatientDetails.findIndex(ele => {
                        return ele != null && ele.mobile ? ele.mobile == el.mobile : -1
                    });
                    if (index == -1) {
                        var patient = new Patient();
                        patient.name = el.patientName;
                        patient.mobile = el.mobile;
                        patient.nationalId = el.id;
                        patient.registeredBy = userId;
                        patient.package = req.body.package;
                        patient.offer = req.body.offer;
                        patient.campaign = campaign._doc._id;
                        patient.registrationVisitNo = `MC${Date.now()}`;
                        patient.registeredBranch = req.body.branch;
                        patient.expiresOn = moment(date).format('DD MMM YYYY');
                        patient.waitingForLaunch = true;
                        const code = voucher_codes.generate({
                            length: 8,
                            count: 1
                        });
                        patient.couponCode = code;
                        uniquePatientDetails.push(patient);
                    }
                });
                Patient.create(uniquePatientDetails, function (err, result) {
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
                        campaign.save(function (err, result) {
                            if(err && err.errors && err.errors.name) {
                                res.status(200).send({
                                    status: 203,
                                    success: false,
                                    message: {
                                        eng: 'Campaign Name should be unique',
                                    },
                                    error: err
                                });
                            } else if (err) {
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
                                    message: {
                                        eng: 'campaign Added successfully.',
                                    },
                                    data: result
                                });
                            }
                        })
                    }
                })
            } else {
                res.status(200).send({
                    status: 411,
                    success: false,
                    message: {
                        eng: 'Patient Details are Required',
                    },
                    error: err
                });
            }
        } catch (err) {
            res.status(200).send({
                status: 411,
                success: false,
                message: {
                    eng: 'ERROR In Excution Of API',
                },
                error: err
            });
        }
    });
    campaignRouter.get('/view', function (req, res) {
        Campaign.find({ isDeleted: false }).sort('-updated_at').populate({ path: 'package', model: Package }).populate({ path: 'userId', model: User }).populate({ path: 'offer', model: Offer }).exec(function (err, campaigns) {
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
                // CampaignPatient.aggregate([
                //     {
                //         $match: {},
                //         $group: {
                //             '_id': "$campaignId",
                //             'count': { $sum: 1 }
                //         },
                //         $project: {
                //             '_id': 0,
                //             'count': 1
                //         }
                //     }
                // ], function (err, result) {
                //     console.log(result, err)
                // })
                res.status(200).send({
                    status: 200,
                    success: true,
                    message: {
                        eng: 'Campaigns retreived successfully.'
                    },
                    data: campaigns
                });
            }
        });
    });
    campaignRouter.post('/update-status', function (req, res) {
        var campaignId = (req.body.id);
        try {
            if (campaignId && campaignId != '') {
                Campaign.findOne({ _id: mongoose.Types.ObjectId(campaignId) })
                    .populate('package')
                    .populate('offer')
                    .exec(async function (err, campaign) {
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
                            console.log(campaign)
                            if (!campaign) {
                                res.status(200).send({
                                    status: 203,
                                    success: false,
                                    message: {
                                        eng: 'No Data Found',
                                    },
                                    data: {}
                                });
                            } else {
                                await Patient.updateMany({ campaign: mongoose.Types.ObjectId(campaignId) }, {
                                    $set: { waitingForLaunch: false }
                                }).exec();
                                Patient.find({ campaign: mongoose.Types.ObjectId(campaignId) }, { _id: 0, mobile: 1, name: 1, couponCode: 1, expiresOn: 1 })
                                    .exec(function (err, patients) {
                                        if (err) {
                                            res.status(200).send({
                                                status: 411,
                                                success: false,
                                                message: {
                                                    eng: 'Server error.',
                                                },
                                                error: err
                                            });
                                        } else if (!patients || (patients && patients.length == 0)) {
                                            res.status(200).send({
                                                status: 203,
                                                success: false,
                                                message: {
                                                    eng: 'No Data Found',
                                                },
                                                data: {}
                                            });
                                        } else {
                                            // var expiryDate = moment().add(campaign.offer.validity, 'days').format('DD MMM YYYY');

                                            // if(req.body.message) {
                                                const replaceConfig = {
                                                    '@name': '<%- name %>',
                                                    '@coupon': '<%- couponCode %>',
                                                    '@expiry': '<%- expiry %>',
                                                    '@campaign': '<%- campaign.name %>',
                                                    '@package': '<%- campaign.package.packageName.eng %>'
                                                }
                                                // var templatedMessage = req.body.message;
                                                // Object.keys(replaceConfig).forEach(function(key, index) {
                                                //     templatedMessage = templatedMessage.replace(new RegExp(key, 'g'), replaceConfig[key])
                                                // });
                                                patients.forEach(element => {
                                                    // console.log(JSON.stringify({...element._doc, expiryDate, campaign}))
                                                    var message = `Dear ${element.name}
Congratulations, you have earned a discount of ${campaign.offer[0].amount}SR on ${campaign.package.packageName.eng}.
This coupon is Valid until ${element.expiresOn}.
Coupon Code - ${element.couponCode}`;
                                                    // const message = ejs.render(message, {...element._doc, expiryDate, campaign});
                                                    console.log(message);
                                                    var country_code = req.body.countryCode ? req.body.countryCode : '+966';
                                                    smsFunction.sendSMS(element.mobile, message, 'otp', country_code);
                                                });
                                            // }

                                            campaign.package = campaign.package._id;
                                            campaign.offer = campaign.offer._id;
                                            campaign.status = 2;
                                            campaign.save(function (err, result) {
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
                                                    res.status(200).send({
                                                        status: 200,
                                                        success: true,
                                                        message: {
                                                            eng: 'Campaign Launched successfully.'
                                                        },
                                                        data: campaign
                                                    });
                                                }
                                            })
                                        }
                                    })
                            }
                        }
                    });
            } else {
                res.status(200).send({
                    status: 404,
                    success: false,
                    message: {
                        eng: 'Campaign ID is required',
                    }
                });
            }
        } catch (err) {
            res.status(200).send({
                status: 411,
                success: false,
                message: {
                    eng: 'ERROR In Excution Of API',
                },
                error: err
            });
        }
    });
    campaignRouter.post('/delete', function (req, res) {
        var campaignId = (req.body.id);
        Campaign.update({ _id: mongoose.Types.ObjectId(campaignId) }, { isDeleted: true, updated_at: Date.now() }, function (err, campaigns) {
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
                res.status(200).send({
                    status: 200,
                    success: true,
                    message: {
                        eng: 'Deleted successfully.'
                    },
                    data: campaigns
                });
            }
        });
    });
    return campaignRouter;
};
