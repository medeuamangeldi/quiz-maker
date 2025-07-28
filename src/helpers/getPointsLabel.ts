export function getPointsLabel(points: number): string {
  if (points === 0 || points >= 5) return "баллов";
  if (points === 1) return "балл";
  return "балла";
}
