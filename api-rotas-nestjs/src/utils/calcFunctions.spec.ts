import {coordDistances, arrayTransform, optimalTrack} from "./calcFunctions"
import { Locations } from "../types/types";

describe('coordDistances', () => {
    it('should calculate the Euclidean distance between two points', () => {
    const a: Locations = { id: 1, x: 0, y: 0 };
    const b: Locations = { id: 2, x: 3, y: 4 };

    const result = coordDistances(a, b);
    expect(result).toBe(5);
    })

    it('should return 0 when points are the same', () => {
    const a: Locations = { id: 1, x: 10, y: 20 };
    const b: Locations = { id: 2, x: 10, y: 20 };
    expect(coordDistances(a, b)).toBe(0);
    });

    it('should correctly calculate distance with negative coordinates', () => {
    const a: Locations = { id: 1, x: -3, y: -4 };
    const b: Locations = { id: 2, x: 0, y: 0 };
    expect(coordDistances(a, b)).toBe(5);
    });

    it('should throw an error if coordinates are not numbers', () => {
    const a: Locations = { id: 1, x: 0, y: 0 };
    const b: any = { id: 2, x: 'três', y: 'quatro' };
    expect(() => coordDistances(a, b)).toThrow('Invalid coordinates: must be numbers.');
    });

    it('should throw an error for null or undefined inputs', () => {
    const a: Locations = { id: 1, x: 0, y: 0 };
    // @ts-ignore
    expect(() => coordDistances(a, null)).toThrow();
    // @ts-ignore
    expect(() => coordDistances(undefined, a)).toThrow();
  });
});

describe('arrayTransform', () => {
  it('should return index and lowest value', () => {
    const distances = [10, 5, 8];
    const [index, value] = arrayTransform(distances);
    expect(index).toBe(1);
    expect(value).toBe(5);
  });

  it('should return the first occurrence of the lowest value', () => {
  const distances = [10, 5, 8, 5];
  const [index, value] = arrayTransform(distances);
  expect(index).toBe(1);
  expect(value).toBe(5);
  });

  it('should throw an error if the input array is empty', () => {
  const distances: number[] = [];
  expect(() => arrayTransform(distances)).toThrow('Input array cannot be empty.');
  });

  it('should throw an error if array contains non-numeric values', () => {
  const distances: any[] = [10, 'cinco', 8];
  // @ts-ignore
  expect(() => arrayTransform(distances)).toThrow('All elements in the array must be numbers.');
  });
  });

describe('optimalTrack', () => {
  it('should calculate optimal visiting order and total distance for a round trip', () => {
    const coords: Locations[] = [
      { id: 1, x: 0, y: 0 }, 
      { id: 2, x: 3, y: 4 }, 
      { id: 3, x: 6, y: 0 }, 
    ];

    const result = optimalTrack(coords);

    expect(result.order).toEqual([1, 2, 3, 1]);
    
    expect(result.totalDistance).toBe(16);
  });

  it('should return an empty order and 0 distance for an empty array', () => {
    const coords: Locations[] = [];
    const result = optimalTrack(coords);
    expect(result.order).toEqual([]);
    expect(result.totalDistance).toBe(0);
  });

  it('should return a round trip for a single-element array', () => {
    const coords: Locations[] = [{ id: 10, x: 5, y: 5 }];
    const result = optimalTrack(coords);
    expect(result.order).toEqual([10, 10]);
    expect(result.totalDistance).toBe(0);
  });

  it('should throw an error if any location has a non-numeric ID', () => {
    const coords: any[] = [
      { id: 1, x: 0, y: 0 },
      { id: 'dois', x: 3, y: 4 },
    ];
    expect(() => optimalTrack(coords)).toThrow('Location ID must be a number.');
  });

  it('should throw an error if any location has non-numeric coordinates', () => {
    const coords: any[] = [
      { id: 1, x: 0, y: 0 },
      { id: 2, x: 3, y: 'quatro' },
    ];
    expect(() => optimalTrack(coords)).toThrow('Invalid coordinates: must be numbers.');
  });
});