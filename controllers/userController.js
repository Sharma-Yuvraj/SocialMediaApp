var bcrypt = require('bcryptjs');
var validator = require('validator');
var user_doc = require('../models/User');


module.exports.home_dashboard = (req, res) => {
    res.render('home-dashboard', { user: req.session.user });
};

module.exports.home_guest = (req, res) => {
    res.render('home-guest');
};

module.exports.profile = (req, res) => {
    user_doc.findOne({ username: req.params.username })
        .then(result => {
            res.render('profile', { other: result, myself: req.session.user });
        })
        .catch(err => {
            res.redirect('back');
        });
};

module.exports.user_register = async (req, res) => {
    const { username, email, password } = req.body;
    const errors = [];
    if (!validator.isEmail(email)) {
        errors.push({
            param: 'email',
            msg: 'Invalid e-mail address.'
        });
    }
    try {
        const usernameExists = await user_doc.countDocuments({ username: username });
        const emailExists = await user_doc.countDocuments({ email: email });
        if (usernameExists === 1) {
            errors.push({
                param: 'username',
                msg: 'Invalid username.'
            });
        }
        else if (emailExists === 1) {
            errors.push({
                param: 'email',
                msg: 'Invalid e-mail address.'
            });
        }
    } catch (err) {
        console.log(err);
    }
    if (errors.length == 0) {
        const hash = bcrypt.hashSync(password, 8);
        const newUser = new user_doc({
            username,
            email,
            password: hash
        });

        try {
            newUser.save();
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        // flash message to be implemented
        // res.json({ errors });
    }
    res.redirect('/');

};


module.exports.user_login = (req, res) => {
    const { username, password } = req.body;
    user_doc.findOne({ username: username })
        .then(result => {
            if (result == null) {
                res.redirect('/');
            }
            if (bcrypt.compareSync(password, result.password)) {
                req.session.isAuth = true;
                req.session.user = result;
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
