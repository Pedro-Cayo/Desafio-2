import {NextFunction, Router, Request, Response} from 'express'
import CoordController from '../controllers/CoordController'
import {body, validationResult} from 'express-validator'

const router = Router()

router.get('/:id', CoordController.getCoordsById);
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
