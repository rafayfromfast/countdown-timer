export type TimeParts = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function splitSeconds(totalSeconds: number): TimeParts {
  const total = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3_600);
  const minutes = Math.floor((total % 3_600) / 60);
  const seconds = total % 60;
  return { total, days, hours, minutes, seconds };
}

export function primaryDisplay(p: TimeParts): { value: number; unit: string } {
  if (p.days > 0) return { value: p.days, unit: p.days === 1 ? 'day' : 'days' };
  if (p.hours > 0)
    return { value: p.hours, unit: p.hours === 1 ? 'hour' : 'hours' };
  if (p.minutes > 0)
    return { value: p.minutes, unit: p.minutes === 1 ? 'minute' : 'minutes' };
  return { value: p.seconds, unit: p.seconds === 1 ? 'second' : 'seconds' };
}

export function formatBreakdown(p: TimeParts): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  if (p.days > 0)
    return `${p.days}d ${pad(p.hours)}:${pad(p.minutes)}:${pad(p.seconds)}`;
  if (p.hours > 0) return `${p.hours}h ${pad(p.minutes)}:${pad(p.seconds)}`;
  if (p.minutes > 0) return `${p.minutes}m ${pad(p.seconds)}s`;
  return `${p.seconds}s`;
}
