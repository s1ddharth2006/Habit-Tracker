// Date formatting and streak calculation utilities

export const getToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatShortDay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'narrow' });
};

export const getPastDates = (count = 7) => {
  const dates = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};

export const calculateStreak = (habitId, logs) => {
  let streak = 0;
  const d = new Date();

  // If today is not done, check if yesterday was done to not break active streak prematurely
  const todayKey = getToday();
  const todayLog = logs[todayKey] && logs[todayKey][habitId];
  let checkDate = new Date();

  if (!todayLog || !todayLog.completed) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const year = checkDate.getFullYear();
    const month = String(checkDate.getMonth() + 1).padStart(2, '0');
    const day = String(checkDate.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;

    const entry = logs[key] && logs[key][habitId];
    if (entry && entry.completed) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// Initial default habits required by Group 2, Statement 13
export const DEFAULT_HABITS = [
  {
    id: 'h-1',
    title: 'Reading',
    target: 20,
    unit: 'pages',
    category: 'Learning'
  },
  {
    id: 'h-2',
    title: 'Exercise',
    target: 30,
    unit: 'mins',
    category: 'Fitness'
  },
  {
    id: 'h-3',
    title: 'Water Intake',
    target: 8,
    unit: 'glasses',
    category: 'Health'
  },
  {
    id: 'h-4',
    title: 'Meditation',
    target: 15,
    unit: 'mins',
    category: 'Mind'
  }
];

// Seed realistic logs for past 10 days
export const generateDefaultLogs = () => {
  const logs = {};
  const today = new Date();

  for (let i = 10; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;

    logs[key] = {};
    DEFAULT_HABITS.forEach((h) => {
      // Past days completed with high consistency
      if (i > 0) {
        const completed = Math.random() > 0.25;
        logs[key][h.id] = {
          completed,
          value: completed ? h.target : 0
        };
      } else {
        // Today: water partially done (5 of 8), exercise done
        if (h.id === 'h-2') {
          logs[key][h.id] = { completed: true, value: 30 };
        } else if (h.id === 'h-3') {
          logs[key][h.id] = { completed: false, value: 5 };
        } else {
          logs[key][h.id] = { completed: false, value: 0 };
        }
      }
    });
  }
  return logs;
};
