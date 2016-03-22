"use strict";

var
    express = require('express'),
    app = express(),
    rmq = require('./module/rabbitmq');

module.exports = app;