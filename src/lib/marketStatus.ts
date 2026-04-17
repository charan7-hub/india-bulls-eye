// Indian market (NSE/BSE) trading hours: 9:15 AM – 3:30 PM IST, Mon–Fri
// Excludes known NSE/BSE holidays.

// NSE/BSE trading holiday list (extend annually). Format: 'YYYY-MM-DD' (IST).
const INDIAN_MARKET_HOLIDAYS_2024_2026: string[] = [
  // 2024
  '2024-01-26', '2024-03-08', '2024-03-25', '2024-03-29', '2024-04-11',
  '2024-04-17', '2024-05-01', '2024-05-20', '2024-06-17', '2024-07-17',
  '2024-08-15', '2024-10-02', '2024-11-01', '2024-11-15', '2024-12-25',
  // 2025
  '2025-02-26', '2025-03-14', '2025-03-31', '2025-04-10', '2025-04-14',
  '2025-04-18', '2025-05-01', '2025-08-15', '2025-08-27', '2025-10-02',
  '2025-10-21', '2025-10-22', '2025-11-05', '2025-12-25',
  // 2026
  '2026-01-26', '2026-03-03', '2026-03-19', '2026-04-03', '2026-04-14',
  '2026-05-01', '2026-08-15', '2026-10-02', '2026-11-09', '2026-12-25',
];

const HOLIDAY_SET = new Set(INDIAN_MARKET_HOLIDAYS_2024_2026);

interface ISTParts {
  year: number;
  month: number; // 1-12
  day: number;
  weekday: number; // 0 Sun .. 6 Sat
  hour: number;
  minute: number;
}

function getISTParts(date: Date = new Date()): ISTParts {
  // Use Intl to safely convert any local time to IST
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    weekday: weekdayMap[get('weekday')] ?? 0,
    hour: parseInt(get('hour'), 10),
    minute: parseInt(get('minute'), 10),
  };
}

export interface MarketStatus {
  isOpen: boolean;
  label: 'Market Open' | 'Market Closed';
  reason: string; // e.g. 'Weekend', 'Holiday', 'After Hours', 'Pre-Market', 'Trading'
  istTime: string; // HH:MM
}

export function getIndianMarketStatus(date: Date = new Date()): MarketStatus {
  const p = getISTParts(date);
  const dateStr = `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
  const istTime = `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`;

  // Weekend
  if (p.weekday === 0 || p.weekday === 6) {
    return { isOpen: false, label: 'Market Closed', reason: 'Weekend', istTime };
  }
  // Holiday
  if (HOLIDAY_SET.has(dateStr)) {
    return { isOpen: false, label: 'Market Closed', reason: 'Holiday', istTime };
  }

  const minutes = p.hour * 60 + p.minute;
  const open = 9 * 60 + 15;   // 09:15
  const close = 15 * 60 + 30; // 15:30

  if (minutes < open) {
    return { isOpen: false, label: 'Market Closed', reason: 'Pre-Market', istTime };
  }
  if (minutes >= close) {
    return { isOpen: false, label: 'Market Closed', reason: 'After Hours', istTime };
  }
  return { isOpen: true, label: 'Market Open', reason: 'Trading', istTime };
}
