import {Router} from 'express'
import CoordController from '../controllers/CoordController'

const router = Router()

router.post('/', CoordController.coord)
router.get('/:id', CoordController.getCoordsById)

export default router
