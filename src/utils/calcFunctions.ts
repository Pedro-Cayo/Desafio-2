import { BestTrack, Locations } from '../types/types'

export const coordDistances = (a: Locations, b: Locations): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt((dx**2) + (dy**2));
};