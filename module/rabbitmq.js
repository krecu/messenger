var amq = require('amqp');
var config = require('../config');
var socket = require("./socket");
var sender = require("./sender");
var smsSender = require("./smsSender");

// Устанавливаем соединение с раббитом
var connection = amq.createConnection(config.rabbitConn);

connection.on('ready', function () {
    console.log("Connected to Rabbit MQ complete");

    connection.exchange("isz.async",  {
        "type": "topic",
        "durable": true,
        "noDeclare": false,
        "autoDelete": false
    }, function(exchange) {

        // определяем новую очередь для скана асихронных сообщений фронту
        connection.queue('async.messenger', {durable: true, autoDelete: false}, function (q) {
            // цепляем очередь по роуту к ексченджю
            q.bind(exchange.name, 'async.messenger.#');

            // подписываемся на события и принимаем их
            q.subscribe(function (message, headers, deliveryInfo, messageObject) {
                var data = JSON.parse(message.data);
                // пример контекста
                // data = {
                //    message:"",
                //    type:""
                // };
                // отправляем фронту гадкие сообщения
                socket.emit('messenger:display', data);
            });
        });

        // определяем новую очередь для скана задачь на отправку sms
        connection.queue('async.sms', {durable: true, autoDelete: false}, function (q) {
            // цепляем очередь по роуту к ексченджю
            q.bind(exchange.name, 'async.sms.#');

            // подписываемся на события и принимаем их
            q.subscribe(function (message, headers, deliveryInfo, messageObject) {
                var sms = JSON.parse(message.data);
                // пример контекста
                // sms = {
                //    to: "",
                //    text: "",
                // };

                // отправляем почту
                smsSender.sendSmsAsync(sms).then(function(response){
                    console.log("SMS sended:", {'sms': sms, 'status': response});
                });
            });
        });

        // определяем новую очередь для скана задачь на отправку почты
        connection.queue('async.mail', {durable: true, autoDelete: false}, function (q) {
            // цепляем очередь по роуту к ексченджю
            q.bind(exchange.name, 'async.mail.#');

            // подписываемся на события и принимаем их
            q.subscribe(function (message, headers, deliveryInfo, messageObject) {
                var mail = JSON.parse(message.data);
                // пример контекста
                // mail = {
                //    from: "",
                //    to: "",
                //    subject: "",
                //    html: ""
                // };

                // отправляем почту
                sender.sendMailAsync(mail).then(function(){
                    console.log("E-Mail sended:", mail);
                });
            });
        });
    });

});

connection.on('error', function(error) {
    console.trace();
    console.error(error);
});

connection.on('close', function(error) {
    console.log('RMQ closed');
});

module.exports = connection;