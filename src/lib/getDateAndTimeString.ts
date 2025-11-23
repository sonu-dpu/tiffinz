export function getDateAndTimeString(date: Date | string): string {
  const d = new Date(date);
  return d.toString().slice(0, 24);
}