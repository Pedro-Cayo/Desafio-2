import mongoose from '../db/conn'
import { Schema } from 'mongoose'

const Coord = mongoose.model(
    'Coordinates',
    new Schema ({
        id: {
        type: Number,
        required: true
        },
        x: {
            type: Number,
            required: true,
        },
        y: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true},
)
)

export default Coord