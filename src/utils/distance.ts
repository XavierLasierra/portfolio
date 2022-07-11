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

export const getRandomPoint = (fieldDimensions: {
  top: number;
  left: number;
  bottom: number;
  right: number;
}): Point => {
  const x =
    Math.random() * (fieldDimensions.right - fieldDimensions.left) +
    fieldDimensions.left;
  const y =
    Math.random() * (fieldDimensions.bottom - fieldDimensions.top) +
    fieldDimensions.top;
  return { x, y };
};
