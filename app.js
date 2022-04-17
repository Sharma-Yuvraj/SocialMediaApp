const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const route = require('./routes');
const path = require('path');

const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);  // it will store the express-session in the mongodb

const app = express();
const dotenv = require('dotenv');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

dotenv.config({ path: './config.env' });
const url = process.env.URL;
const port = process.env.PORT || 8000;
const oneDay = 1000 * 60 * 60 * 24;
const store = new mongodbSession({
    uri: url,                       // where to store the sessions
    collection: "mySessions"        // specifying the name of the collection
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//A new body object containing the parsed data is populated on the request object after the middleware
//(i.e. req.body). This object will contain key-value pairs, where the value can be a string or array
//(when extended is false), or any type (when extended is true).
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
// session ID is encrypted by secret and then stored in cookie.
app.use(
    session({
        secret: "key that will sign cookie",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: oneDay },
        store: store,
    }));
app.use('/', route);


mongoose.connect(url, function (err, client) {
    if (err) console.log(err);

    server.listen(port, function (error) {
        if (error) {
            console.log('error in running the server', error);
            return;
        }
        io.on('connection', (socket) => {
            socket.on('chat_message', (msg) => {
                io.emit('chat_message', msg);
            });
        });
        console.log('server is running succefully');
    })
});
