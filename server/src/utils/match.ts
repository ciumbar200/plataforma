import { User } from "@prisma/client";
export function computeMatchScore(a: Partial<User>, b: Partial<User>): number {
  let score = 0;
  if (a.city && b.city && a.city.toLowerCase() === b.city.toLowerCase()) score += 20;
  const tagsA = (a.tags ?? []) as string[];
  const tagsB = (b.tags ?? []) as string[];
  const overlap = tagsA.filter(t => tagsB.includes(t)).length;
  score += Math.min(60, overlap * 15);
  const noiseA = a.noiseLevel ?? 3, noiseB = b.noiseLevel ?? 3;
  const diff = Math.abs(noiseA - noiseB);
  score += Math.max(0, 20 - diff * 10);
  return Math.max(0, Math.min(100, score));
}
