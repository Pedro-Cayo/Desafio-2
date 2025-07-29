import {NextFunction, Router, Request, Response} from 'express'
import TrackController from '../controllers/TrackController'
const {body, validationResult} = require('express-validator')

const router = Router()

router.get('/:id', TrackController.bestTrackById);

export default router