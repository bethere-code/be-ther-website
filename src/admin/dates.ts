/** Today's date (YYYY-MM-DD) in India time, matching the IST day bounds in api.ts. */
export function todayIso(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}
