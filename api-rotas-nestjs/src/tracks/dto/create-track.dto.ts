import {Track} from '../entities/track.entity'

export class CreateTrackDto {
    id: string
    order: Track[];
    totalDistance: number;
    createdAt: Date;
}
