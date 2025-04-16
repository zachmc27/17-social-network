import { Thought, User } from '../models/index.js';
export const getThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find()
            .select('-__v');
        res.json(thoughts);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const getSingleThought = async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v');
        if (!thought) {
            res.status(404).json({ message: 'No post with that ID' });
        }
        res.status(200).json(thought);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const createThought = async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: thought._id } }, { new: true });
        if (!user) {
            res
                .status(404)
                .json({ message: 'Post created, but found no user with that ID' });
        }
        else {
            res.json('Created the post 🎉');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
export const updateThought = async (req, res) => {
    try {
        const updatedThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true, runValidators: true });
        if (!updatedThought) {
            console.log(`Issue finding thought with ID ${req.params.thoughtId}`);
        }
        res.status(200).json(updatedThought);
    }
    catch (err) {
        console.log('Error updating user.');
        res.status(500).json({ message: 'something went wrong' });
    }
};
export const deleteThought = async (req, res) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!deletedThought) {
            console.log(`Issue finding thought with ID ${req.params.thoughtId}`);
            return res.status(404).json({ message: 'Issue deleting user with ID' });
        }
        return res.status(200).json(deletedThought);
    }
    catch (err) {
        console.log('Error deleting user');
        return res.status(500).json({ message: 'Something went wrong.' });
    }
};
export const createReaction = async (req, res) => {
    try {
        const { thoughtId } = req.params;
        const newReaction = await Thought.findByIdAndUpdate(thoughtId, { $addToSet: { reactions: req.body } }, { new: true, runValidators: true });
        if (!newReaction) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(newReaction);
    }
    catch (err) {
        console.error('Error adding reaction to thought', err);
        return res.status(500).json({ message: 'Something went wrong.' });
    }
};
export const deleteReaction = async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params;
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, { $pull: { reactions: { reactionId: reactionId } } }, { new: true });
        if (!updatedThought) {
            console.log('Error finding reaction by Id');
            return res.status(404).json({ message: 'Error finding reaction by Id' });
        }
        return res.status(200).json(updatedThought);
    }
    catch (err) {
        console.error('Error deleting reaction', err);
        return res.status(500).json({ message: 'Error deleting reaction.' });
    }
};
