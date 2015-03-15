/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo BERNASCHINA (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var slb = require('socket-load-balancer');

var router = slb.routers.RoundRobin({
    routes: []
});

var balancer = slb.Server({
    router: router
});
balancer.listen(3000);

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.route('/route')
    .get(function (req, res) {
        res.json({
            routes : router.getRoutes()
        });
    })
    .post(function (req, res) {
        try {
            router.addRoute({host: req.body.host, port: req.body.port});
            res.json({done: true});
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    })
    .delete(function (req, res) {
        try {
            router.removeRoute({host: req.body.host, port: req.body.port});
            res.json({done: true});
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    });

app.listen(8080);
