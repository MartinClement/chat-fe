# chat-fe

This project corresponds to the chat front end (chat-fe) of my [chat-fs](https://github.com/MartinClement/chat-ws) projet

## Pull and start
This is a classic react app. Just pull the repo then :

```
yarn install
yarn start
```
The application works with the websocket running on chat-ws.
Default address is `ws://127.0.0.1:1337`
Checkout `.env` file to custom the app.


## Deploy

This simple application works well with [surge.io](surge.sh).

```
## You need to be register on surge before deploying
yarn build
cd build
surge
```


