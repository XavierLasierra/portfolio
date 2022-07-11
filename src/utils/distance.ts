import { Point } from "../models/distance";

export const getDistanceBetweenTwoPoints = (pointA: Point, pointB: Point) => {
  const x = pointA.x - pointB.x;
  const y = pointA.y - pointB.y;
  return Math.sqrt(x * x + y * y);
};

export const getAngleBetweenTwoPoints = (pointA: Point, pointB: Point) => {
  const x = pointB.x - pointA.x;
  const y = pointB.y - pointA.y;
  return Math.atan2(y, x);
};
