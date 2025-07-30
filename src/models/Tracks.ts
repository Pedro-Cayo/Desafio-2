import mongoose from '../db/conn'
import { Schema } from 'mongoose'

const TracksAndDistance= new Schema (
    {
    OptimalTrack: [
        {
        id: {
        type: String,
        required: true
        },
        order: {
        type: [String],
        required: true,
        },
        totalDistance: {
        type: Number,
        required: true,
        },
        }
    ]      
    },{ timestamps: true},
)

const Track = mongoose.model('Tracks', TracksAndDistance)
export default Track