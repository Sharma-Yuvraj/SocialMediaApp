const mongoUtil=require('../db');
var db=mongoUtil.getDb();
var bcrypt = require('bcryptjs');
var validator = require('validator');



module.exports.home_dashboard = (req, res) => {
    res.render('home-dashboard');
};

module.exports.home_guest = (req, res) => {
    res.render('home-guest');
};

module.exports.profile = (req, res) => {
    res.render('profile');
};

module.exports.user_register = (req, res) => {
    const data = req.body;
    if (validator.isEmail(data.email)) {
        var hash = bcrypt.hashSync(data.password, 8);
        db.collection('credentials').find({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        })
            .toArray()
            .then(result => {
                if (result.length == 0) {
                    db.collection('credentials').insertOne({ username: data.username, email: data.email, password: hash })
                        .then(result => {
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                }
                else {
                    res.redirect('/');
                }
            })
            .catch(err => console.log(err));
    }
    else {
        res.redirect('/');
    }
};


module.exports.user_login = (req, res) => {
    var data = req.body;
    db.collection('credentials').findOne({ username: data.username })
        .then(result => {
            if (result == null) {
                res.redirect('/');
            }
            if (bcrypt.compareSync(data.password, result.password)) {
                // req.session.username = data.username;
                req.session.isAuth = true;
                res.redirect('/home-dashboard');
            }
            else {
                res.redirect('/');
            }
        })
        .catch(err => console.log(err));
};



module.exports.user_logout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
    });
    res.redirect('/');
};
