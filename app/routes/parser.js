var express = require('express');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
// var xml2js = require('xml2js');
// var parseString = new xml2js.Parser(xml2js.defaults["0.2"]);

module.exports = function(){
    var parseRouter = express.Router();
    parseRouter.post('/xml2json', function(req, res) {
        const xml = req.body.xml;
        parseString(xml, { explicitArray: false, trim: true } ,(err, result) => {
            if(!err){
                res.status(200).send({
                    status: 201,
                    success: true,
                    message: {
                        eng: 'Parsing json success',
                    },
                    data: result
                });
            } else {
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
    parseRouter.post('/json2xml', function(req, res) {
        const jsonObj = req.body.json;
        var builder = new xml2js.Builder({ renderOpts: { 'pretty': true, 'indent': ' ', 'newline': '' } });
        var xml = builder.buildObject(jsonObj);
        res.status(200).send({
            status: 201,
            success: true,
            message: {
                eng: 'Parsed xml success',
            },
            data: xml
        });
        // parseString(xml, { explicitArray: false, trim: true } ,(err, result) => {
        //     if(!err){
        //         res.status(200).send({
        //             status: 201,
        //             success: true,
        //             message: {
        //                 eng: 'Parsed json success',
        //             },
        //             data: result
        //         });
        //     } else {
        //         res.status(200).send({
        //             status: 203,
        //             success: false,
        //             message: {
        //                 eng: 'Server error.',
        //             },
        //             error: err
        //         });
        //     }
        // });
    });
    return parseRouter;
};
