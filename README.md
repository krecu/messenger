## Сервис ISZ Messenger

Основное предназначение этого сервиса это оповещение фронта о какихто важных изменениях в бекенде и соотведствуюшая его реакция

**Например**

- Пользователь нажал сформировать документ FreshDoc (Данная операция занимает продолжительное время)
- После того как документ будет сформирован мы оповещаем пользователя где бы он нибыл в системе о том что документ сформирован и даем ссылку на скачивания и т.д.

очень простой и глупый пример...


#### Установка

```bash
npm i && node main.js
```

запуститься консюмер каторый прослушивает (созданную им) очередь и websocket на базе socketio

#### Отправка почты
Необходимо отправить в rabbit topic с routing_key = `async.mail.#` в exchange = `isz.async`
Ожидаеться следующий формат сообщения
```json
{
    from: "",
    to: "",
    subject: "",
    html: ""
}
```

#### Отправка сообщения на front
Необходимо отправить в rabbit topic с routing_key = `async.messenger.#` в exchange = `isz.async`
Ожидаеться следующий формат сообщения
```json
{
    message: "",
    type: "1/0",
}
```