var fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var config = require('../config');
var url = config.sms.url;

module.exports = {
    sendSmsAsync: function sendSmsAsync(sms) {
        var text = sms.text.replace(' ', '+');
        return fetch(url + '&to=' + sms.to + '&text=' + text).then(function (response) {

            return response.text();
        }).then(function(body) {
            body = body.substring(0,3);

            return body;
        });

    }
};
