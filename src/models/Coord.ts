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
            type: [Number, String],
            required: true,
        },
        y: {
            type: [Number, String],
            required: true,
        },
    },
    { timestamps: true},
)
)

export default Coord