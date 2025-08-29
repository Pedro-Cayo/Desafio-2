export type Locations = { id: number; x: number; y: number };

export type BestTrack = {
  order: (string | number)[];
  totalDistance: number;
};

export type TrackHistory = {
  trackId: string,
  trackOrder: string[],
  originalCoordsId: string,
  trackDate: string,
  totalDistance: number
}