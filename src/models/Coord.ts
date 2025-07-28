import mongoose, { Schema } from 'mongoose'

const Coord = mongoose.model(
    'Coordinates',
    new Schema ({
        coordX: {
            type: [Number, String],
            required: true,
        },
        coordY: {
            type: [Number, String],
            required: true,
        },
    },
    { timestamps: true},
)
)

export default Coord