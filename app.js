const express = require('express');
var mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const route = require('./routes');
const path = require('path');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const url = process.env.URL;
const port = process.env.PORT;
const oneDay = 1000 * 60 * 60 * 24;
const store = new mongodbSession({
    uri: url,
    collection: "mySessions"
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }))  // decode the url and sends the data in body of req
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: "key that will sign cookie",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: oneDay },
        store: store,
    }));
app.use('/', route);


mongoose.connect(url,function (err, client) {
    if (err) console.log(err);

    app.listen(port, function (err) {
        if (err) {
            console.log('error in running the server', err);
            return;
        }
        console.log('server is running succefully');
    })
});
