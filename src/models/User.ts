import { Schema, model, Document, ObjectId } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  thoughts?: ObjectId[];
  friends?: ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
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
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

userSchema 
  .virtual('friendCount')
  .get(function (this: IUser) {
    return this.friends?.length
  })

// Initialize our User model
const User = model('user', userSchema);

export default User;
