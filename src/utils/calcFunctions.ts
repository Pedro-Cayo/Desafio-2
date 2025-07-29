import { BestTrack, Locations } from '../types/types'

export const coordDistances = (a: Locations, b: Locations): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt((dx**2) + (dy**2))
};

export const arrayTransform = (distances: number[]) => {
    const lowestDistance: number = Math.min(...distances)
    const lowestDistancePosition: number = distances.indexOf(lowestDistance)
    return [lowestDistancePosition, lowestDistance]
}

export const optimalTrack = (coords: Locations[]): BestTrack => {
    if (!coords || coords.length < 2) {
    return { order: [], totalDistance: 0 }
  }
    const visitedOrder: number[] = []
    let totalDistance: number = 0
    let remaining: Locations[] = [...coords]

    let current = remaining.shift()

    if (!current) return { order: [], totalDistance: 0 }
        visitedOrder.push(current.id)

     let start = current

  while (remaining.length > 0) {
    const results = remaining.map(point => ({
      nextId: point.id,
      distance: coordDistances(current!, point)
    }))

    const distances = results.map(r => r.distance)

    const [lowestIndex, lowestDistance] = arrayTransform(distances)
    const nextPoint = remaining.splice(lowestIndex, 1)[0]

    visitedOrder.push(nextPoint.id)
    totalDistance += lowestDistance
    current = nextPoint
  }

    visitedOrder.push(start.id)
    totalDistance += coordDistances(current, start)

  return {
    order: visitedOrder,
    totalDistance: Math.round(totalDistance * 100) / 100
  }
}