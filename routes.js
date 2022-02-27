var express = require('express');
var router = express.Router();

var followController = require('./controllers/followController');
var postController = require('./controllers/postController');
var userController = require('./controllers/userController');

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    else {
        res.redirect('/');
    }
};

router.get('/', userController.home_guest);

router.get('/home-dashboard', isAuth, userController.home_dashboard);
router.get('/profile/:username', isAuth, userController.profile);
router.post('/login', userController.user_login);
router.post('/register', userController.user_register);
router.post('/logout', isAuth, userController.user_logout);



router.get('/create-post', isAuth, postController.create_post_get);
router.post('/create-post', isAuth, postController.create_post_post);
router.post('/edit-post', isAuth, postController.edit_post);
router.post('/post', isAuth, postController.single_post_screen);







router.get('/profile-following', isAuth, followController.profile_following);
router.get('/profile-followers', isAuth, followController.profile_followers);


module.exports = router;