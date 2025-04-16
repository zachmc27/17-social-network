import User from '../models/User.js';
import { Request, Response } from 'express';
import Thought from '../models/Thoughts.js';

  export const getUsers = async (_req: Request, res: Response) => {
    try {
      const users = await User.find()
      .select('-__v')
      .populate({
        path: 'friends',
        select: 'username'
    })
      .populate('thoughts');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  export const getSingleUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      }
        res.status(200).json(user);
     
    } catch (err) {
      res.status(500).json(err);
    }
  }


  export const createUser = async (req: Request, res: Response) => {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  export const updateUser = async (req: Request, res: Response) => {
    try {
      const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId}, req.body , { new: true, runValidators: true });
      if (!dbUserData) {
        console.log(`Issue finding user with ID ${req.params.userId}`);
      }
      res.status(200).json(dbUserData);
    } catch (err) {
      console.log('Error updating user.');
      res.status(500).json({ message: 'something went wrong' })
    }
  }

  export const deleteUser = async (req: Request, res: Response) => {
    try {
       
      const dbUserData = await User.findByIdAndDelete(req.params.userId);
      
      if (!dbUserData) {
        console.log(`Issue finding user with ID ${req.params.userId}`)
        return res.status(404).json({ message: 'Issue deleting user with ID'})
      }
      return res.status(200).json(dbUserData)
    } catch (err) {
      console.log('Error deleting user');
      return res.status(500).json({ message: 'Something went wrong.'})
    }
  }

  export const addFriend = async (req: Request, res: Response) => {
    try {
      const {userId, friendId} = req.params
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.'})
      }

      return res.status(200).json(updatedUser)
    } catch (err) {
      console.error('Error adding friend to friendslist', err);
      return res.status(500).json({ message: 'Something went wrong.'})
    }
  }

  export const deleteFriend = async (req: Request, res: Response) => {
    try {
      const { userId, friendId } = req.params;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      );

      if (!updatedUser) {
        console.log('Error finding user by Id');
        return res.status(404).json({ message: 'Error finding user by Id'});
      }

       return res.status(200).json(updatedUser)
    } catch (err) {
      console.error('Error deleting friend', err);
      return res.status(500).json({ message: 'Error deleting friend.'})
    }
  }

