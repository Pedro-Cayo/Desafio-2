import {Router} from 'express'
import CoordController from '../controllers/CoordController'

const router = Router()

router.post('/', CoordController.coord)

export default router
