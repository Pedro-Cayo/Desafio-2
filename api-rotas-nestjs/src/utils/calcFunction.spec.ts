import {coordDistances, arrayTransform, optimalTrack} from "../../src/utils/calcFunctions"
import { Locations } from "../../src/types/types";

describe('coordDistances', () => {
    it('should calculate the Euclidean distance between two points', () => {
    const a: Locations = { id: 1, x: 0, y: 0 };
    const b: Locations = { id: 2, x: 3, y: 4 };

    const result = coordDistances(a, b);
    expect(result).toBe(5);
    })
})

describe('arrayTransform', () => {
  it('should return index and lowest value', () => {
    const distances = [10, 5, 8];

    const [index, value] = arrayTransform(distances);

    expect(index).toBe(1);
    expect(value).toBe(5);
  });
});

describe('optimalTrack', () => {
  it('should calculate optimal visiting order and total distance', () => {
    const coords: Locations[] = [
      { id: 1, x: 0, y: 0 },
      { id: 2, x: 3, y: 4 },
      { id: 3, x: 6, y: 0 },
    ];

    const result = optimalTrack(coords);

    expect(result.order[0]).toBe(1);
    expect(result.order).toContain(2);
    expect(result.order).toContain(3);
    expect(result.totalDistance).toBeGreaterThan(0);
  });
});