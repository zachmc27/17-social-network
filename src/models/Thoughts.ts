import { Schema, model, Document, ObjectId } from 'mongoose';

interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  reactions?: ObjectId[]
}

interface IReaction extends Document {
  reactionId: ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date
}

const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new (require('mongoose').Types.ObjectId)(), 
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
      default: Date.now
      //FORMAT LATER
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
      default: Date.now
      //FORMAT LATER
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function (this: IThought) {
    return this.reactions?.length
  })

// Initialize our Post model
const Thought = model('thought', thoughtSchema);

export default Thought;
