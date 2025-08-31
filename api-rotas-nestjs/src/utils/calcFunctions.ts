import { Locations, BestTrack } from '../types/types';

export function coordDistances(a: Locations, b: Locations): number {
  if (!a || !b) {
    throw new Error('Invalid input: location objects cannot be null or undefined.');
  }
  if (typeof a.x !== 'number' || typeof a.y !== 'number' || typeof b.x !== 'number' || typeof b.y !== 'number') {
    throw new Error('Invalid coordinates: must be numbers.');
  }
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function arrayTransform(distances: number[]): [number, number] {
  if (distances.length === 0) {
    throw new Error('Input array cannot be empty.');
  }

  let lowestValue = Infinity;
  let index = -1;

  for (let i = 0; i < distances.length; i++) {
    const value = distances[i];
    if (typeof value !== 'number') {
      throw new Error('All elements in the array must be numbers.');
    }
    if (value < lowestValue) {
      lowestValue = value;
      index = i;
    }
  }
  return [index, lowestValue];
}

export function optimalTrack(coords: Locations[]): BestTrack {
  if (coords.length === 0) {
    return { order: [], totalDistance: 0 };
  }
  
  for (const coord of coords) {
    if (typeof coord.id !== 'number') { throw new Error('Location ID must be a number.'); }
    if (typeof coord.x !== 'number' || typeof coord.y !== 'number') { throw new Error('Invalid coordinates: must be numbers.'); }
  }

  const startPoint = coords[0];
  const unvisited = [...coords];
  const order: number[] = [];
  let totalDistance = 0;

  let currentPoint = unvisited.shift()!;
  order.push(currentPoint.id);
  
  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const distance = coordDistances(currentPoint, unvisited[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    totalDistance += minDistance;
    currentPoint = unvisited[nearestIndex];
    order.push(currentPoint.id);
    unvisited.splice(nearestIndex, 1);
  }

  if (coords.length > 1) {
    const returnDistance = coordDistances(currentPoint, startPoint);
    totalDistance += returnDistance;
    order.push(startPoint.id);
  } else {
    order.push(startPoint.id);
  }

  return { order, totalDistance };
}