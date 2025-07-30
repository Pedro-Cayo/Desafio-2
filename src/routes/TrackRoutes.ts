import {Router} from 'express'
import TrackController from '../controllers/TrackController'

const router = Router()

router.get('/history', TrackController.history);
router.get('/:id', TrackController.bestTrackById);
router.delete('/:id', TrackController.deleteTracks);

export default router