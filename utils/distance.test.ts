import {
  getAngleBetweenTwoPoints,
  getDistanceBetweenTwoPoints,
} from "./distance";

describe("getDistanceBetweenTwoPoints", () => {
  it("should return the distance between two points", () => {
    [
      {
        pointA: { x: 1, y: 0 },
        pointB: { x: 0, y: 1 },
        expected: Math.sqrt(2),
      },
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 1, y: 1 },
        expected: Math.sqrt(2),
      },
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 1, y: 0 },
        expected: 1,
      },
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 0 },
        expected: 0,
      },
    ].forEach(({ pointA, pointB, expected }) => {
      const distance = getDistanceBetweenTwoPoints(pointA, pointB);
      expect(distance).toBe(expected);
    });
  });
});

describe("getAngleBetweenTwoPoints", () => {
  it("should return the angle between two points", () => {
    [
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 1 },
        expected: ((Math.PI / 2) * 180) / Math.PI,
      },
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 1, y: 1 },
        expected: ((Math.PI / 4) * 180) / Math.PI,
      },
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 1, y: 0 },
        expected: 0,
      },
      {
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 0 },
        expected: 0,
      },
    ].forEach(({ pointA, pointB, expected }) => {
      const angle = getAngleBetweenTwoPoints(pointA, pointB);
      expect(angle).toBe(expected);
    });
  });
});
