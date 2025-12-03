import {
  format,
  formatDistance,
  formatRelative,
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  eachDayOfInterval,
  eachWeekOfInterval,
  getDay,
  setHours,
  setMinutes,
} from 'date-fns';

// ============================================
// Date Formatting
// ============================================

export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
}

export function formatTimeFromString(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = setMinutes(setHours(new Date(), hours), minutes);
  return format(date, 'h:mm a');
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  if (isThisWeek(d)) return format(d, 'EEEE');
  if (isThisYear(d)) return format(d, 'MMM d');
  return format(d, 'MMM d, yyyy');
}

export function formatRelativeDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatRelative(d, new Date());
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
}

// ============================================
// Date Comparisons
// ============================================

export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(d, new Date());
}

export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(d, new Date());
}

export function isOverdue(dueDate: Date | string | undefined): boolean {
  if (!dueDate) return false;
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isBefore(endOfDay(d), new Date());
}

export function isDueSoon(dueDate: Date | string | undefined, daysThreshold: number = 3): boolean {
  if (!dueDate) return false;
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const now = new Date();
  return isBefore(d, addDays(now, daysThreshold)) && isAfter(d, now);
}

export { isToday, isTomorrow, isYesterday, isThisWeek, isThisMonth, isSameDay };

// ============================================
// Date Ranges
// ============================================

export function getDateRange(
  range: 'today' | 'week' | 'month' | 'custom',
  customStart?: Date,
  customEnd?: Date
): { start: Date; end: Date } {
  const now = new Date();

  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'custom':
      return {
        start: customStart ? startOfDay(customStart) : startOfDay(now),
        end: customEnd ? endOfDay(customEnd) : endOfDay(now),
      };
    default:
      return { start: startOfDay(now), end: endOfDay(now) };
  }
}

export function getDaysInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

export function getWeeksInRange(start: Date, end: Date): Date[] {
  return eachWeekOfInterval({ start, end });
}

// ============================================
// Date Manipulation
// ============================================

export { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, startOfDay, endOfDay };

export function combineDateTime(date: Date | string, time: string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const [hours, minutes] = time.split(':').map(Number);
  return setMinutes(setHours(d, hours), minutes);
}

// ============================================
// Duration & Differences
// ============================================

export function getDaysDifference(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInDays(e, s);
}

export function getHoursDifference(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInHours(e, s);
}

export function getMinutesDifference(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  return differenceInMinutes(e, s);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// ============================================
// Calendar Helpers
// ============================================

export function getDayOfWeek(date: Date): number {
  return getDay(date);
}

export function getWeekdayName(date: Date, short: boolean = false): string {
  return format(date, short ? 'EEE' : 'EEEE');
}

export function getMonthName(date: Date, short: boolean = false): string {
  return format(date, short ? 'MMM' : 'MMMM');
}

export function getCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const start = startOfWeek(firstDay);
  const end = endOfWeek(lastDay);
  return eachDayOfInterval({ start, end });
}

// ============================================
// Date Parsing
// ============================================

export function parseDate(dateStr: string): Date {
  return parseISO(dateStr);
}

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function toISOTimeString(date: Date): string {
  return format(date, 'HH:mm');
}
