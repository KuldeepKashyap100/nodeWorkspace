const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../model/user');


const { validationResult} = require('express-validator');

exports.signup = (req, res, next) => {
    const err = validationResult(req);
    if(!err.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = err.array();
        throw error;
    }
    bcrypt.hash(req.body.password, 12).then((hashedPassword)=>{
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });
        return user.save(); 
    }).then(result=>{
        res.status(201).json({message: 'User created!', userId: result._id});
    }).catch(err=>next(err));
};

exports.postLogin = (req, res, next) => {
    let loadedUser;
    User.findOne({email: req.body.email})
    .then(user=>{
        if(!user) {
            const err = new Error('user not found');
            error.status = 401;
            throw err;
        }
        loadedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(isEqual=>{
        if(!isEqual) {
            const err = new Error("Wrong password.");
            err.statusCode = 401;
            throw err;
        }
        const token = jwt.sign({ email: req.body.email, userId: loadedUser._id.toString()}, "someSecretString", {expiresIn: '1h'});
        res.status(200).json({token: token, userId: loadedUser._id.toString()});
    })
    .catch(err => {
        next(err);
    })
};