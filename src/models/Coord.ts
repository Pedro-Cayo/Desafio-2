import mongoose from '../db/conn'
import { Schema } from 'mongoose'

const CoordSchema = new Schema (
    {
    Coordinates: [
        {
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
        }
    ]      
    },{ timestamps: true},
)

const Coord = mongoose.model('Coordinates', CoordSchema)
export default Coord