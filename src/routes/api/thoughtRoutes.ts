import { Router } from 'express';
const router = Router();
import { getSingleThought, getThoughts, createThought, updateThought, deleteThought, createReaction, deleteReaction } from '../../controllers/thoughtsController.js';

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(createReaction)

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction)

export default router;
