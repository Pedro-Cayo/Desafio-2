import {NextFunction, Router, Request, Response} from 'express'
import CoordController from '../controllers/CoordController'
const {body, validationResult} = require('express-validator')

const router = Router()

router.post(
    '/',[
        body('*.id').notEmpty().isInt(),
        body('*.x').notEmpty().isNumeric(),
        body('*.y').notEmpty().isNumeric(),
        (req: Request, res: Response, next: NextFunction) => {
            const errors: any = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    CoordController.coord
);

router.get('/:id', CoordController.getCoordsById);
router.patch('/:id', [
        body('*.id').notEmpty().isInt(),
        body('*.x').notEmpty().isNumeric(),
        body('*.y').notEmpty().isNumeric(),
        (req: Request, res: Response, next: NextFunction) => {
            const errors: any = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ],
    CoordController.patchCoords
);

export default router
