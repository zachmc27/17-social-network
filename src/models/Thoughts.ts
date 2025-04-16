import moment from 'moment';
import mongoose, { Schema, model, Document, ObjectId } from 'mongoose';

interface IThought extends Document {
  thoughtText: string;
  createdAt?: Date;
  username: string;
  reactions?: ObjectId[]
}

interface IReaction extends Document {
  reactionId: ObjectId;
  reactionBody: string;
  username: string;
  createdAt?: Date
}

const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), 
    },
    reactionBody: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp: Date) => moment(timestamp).format('MMMM Do YYYY, h:mm:ss a'),
    }
  }
)

const thoughtSchema = new Schema<IThought>(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp: Date) => moment(timestamp).format('MMMM Do YYYY, h:mm:ss a'),
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function (this: IThought) {
    return this.reactions?.length
  })

// Initialize our Post model
const Thought = model('thoughts', thoughtSchema);

export default Thought;
