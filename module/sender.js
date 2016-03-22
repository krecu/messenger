var mailer = require('nodemailer');
var transport = require('nodemailer-smtp-transport');
var P = require('bluebird');
var config = require('../config');

module.exports = P.promisifyAll(mailer.createTransport(transport(config.email.transport)));