'use strict';

const mongoose = require('mongoose');

const { Schema }  = mongoose;

const UserSchema= new Schema({
    username : String,
    email : String,
    password: String,
    post : Array,
    followers: Array,
    following: Array
},{collection : 'user'});

module.exports=mongoose.model('users', UserSchema);
