import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        Unique: true
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thoughts'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
}, {
    toJSON: {
        virtuals: true
    },
    id: false
});
userSchema
    .virtual('friendCount')
    .get(function () {
    return this.friends?.length;
});
// Initialize our User model
const User = model('user', userSchema);
export default User;
