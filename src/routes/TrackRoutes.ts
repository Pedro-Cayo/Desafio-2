import {Router} from 'express'
import TrackController from '../controllers/TrackController'

const router = Router()

router.get('/history', TrackController.history);
router.delete('/:id', TrackController.bestTrackById);
router.get('/:id', TrackController.bestTrackById);


export default router