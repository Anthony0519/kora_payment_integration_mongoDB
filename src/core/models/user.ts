import mongoose, { Schema } from 'mongoose';
import { UserAttributes } from '../interfaces/user';

const userSchema = new Schema<UserAttributes>({
    fullName: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true        
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0.00
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
