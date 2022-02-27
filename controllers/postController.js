var Post = require('../models/Post');

exports.create_post_get = (req, res) => {
    res.render('create-post');
};
exports.create_post_post = (req, res) =>{
    res.render('create-post');
};
exports.edit_post = (req, res) => {
    res.render('edit-post');
};
exports.single_post_screen = (req, res) => {
    res.render('single-post-screen');
};
