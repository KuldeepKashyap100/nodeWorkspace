import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
export const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.methods.comparePasswords = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}
