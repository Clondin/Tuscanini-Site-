/** Minutes as a short, readable duration: 105 -> "1h 45m", 60 -> "1h", 40 -> "40 min". */
export function formatRecipeTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} min`;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}
