import { getDistance } from "ol/sphere";

export const calculateDistances = (coords) => {
  const distances = [];
  for (let i = 1; i < coords.length; i++) {
    const dist = getDistance(coords[i - 1], coords[i]);
    distances.push(dist.toFixed(2)); // Distance in meters
  }
  return distances;
};
