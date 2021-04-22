import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserSchema } from "../models/userModel";

const User = mongoose.model("User", UserSchema);

export const loginRequired = (req, res, next) => {
    if(!req.user)
        return res.status(401).json({message: "unauthorized user"});
    next();
}

export const register = (req, res, next) => {
    const newUser = new User(req.body);
    newUser.hashedPassword = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user) => {
        if(err) return res.status(400).send({message: err});
        user.hashedPassword = undefined;
        res.status(201).json(user);
    });
}

export const login  = (req, res, next) => {
    User.find({ email: req.body.email}, (err, user) => {
        if(err) throw err;
        if(!user) return res.status(400).json({message: "User not found"});
        if(!bcrypt.compare(req.body.password, user.hashedPassword)) {
            return res.status(401).json({message: "unauthorized user"});
        }
        return res.status(200).json({toke: jwt.sign({ 
            email: user.email,
            userName: user.name,
            _id: user._id
        }, "RESTFUL_API_S")});
    });
}