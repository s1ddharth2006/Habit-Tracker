import { formatDateKey } from '../utils/streakUtils';

export const INITIAL_HABITS = [
  {
    id: 'habit-1',
    title: 'Daily Reading',
    description: 'Read at least 20 pages of non-fiction, academic, or self-growth books',
    category: 'reading',
    target: 20,
    unit: 'pages',
    type: 'counter', // 'boolean' or 'counter'
    color: '#3b82f6', // blue
    icon: 'BookOpen',
    frequency: 'daily',
    timeOfDay: 'evening',
    createdAt: '2026-06-01'
  },
  {
    id: 'habit-2',
    title: 'Physical Exercise',
    description: 'Workout, cardio, or stretching routine to keep body fit',
    category: 'exercise',
    target: 30,
    unit: 'mins',
    type: 'counter',
    color: '#ef4444', // red/coral
    icon: 'Dumbbell',
    frequency: 'daily',
    timeOfDay: 'morning',
    createdAt: '2026-06-01'
  },
  {
    id: 'habit-3',
    title: 'Hydration & Water Intake',
    description: 'Drink 8 glasses (approx. 2000ml) of clean water throughout the day',
    category: 'water',
    target: 8,
    unit: 'glasses',
    type: 'counter',
    color: '#06b6d4', // cyan
    icon: 'Droplets',
    frequency: 'daily',
    timeOfDay: 'anytime',
    createdAt: '2026-06-01'
  },
  {
    id: 'habit-4',
    title: 'Mindful Meditation',
    description: 'Breathing exercises, calm awareness, and stress relief',
    category: 'meditation',
    target: 15,
    unit: 'mins',
    type: 'counter',
    color: '#8b5cf6', // purple
    icon: 'Sparkles',
    frequency: 'daily',
    timeOfDay: 'morning',
    createdAt: '2026-06-01'
  },
  {
    id: 'habit-5',
    title: 'Full Stack Coding Practice',
    description: 'Practice JavaScript, React components, and problem solving',
    category: 'productivity',
    target: 45,
    unit: 'mins',
    type: 'counter',
    color: '#10b981', // emerald
    icon: 'Code2',
    frequency: 'daily',
    timeOfDay: 'afternoon',
    createdAt: '2026-06-01'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Habits', icon: 'Layers' },
  { id: 'reading', label: 'Reading', icon: 'BookOpen', color: '#3b82f6' },
  { id: 'exercise', label: 'Exercise', icon: 'Dumbbell', color: '#ef4444' },
  { id: 'water', label: 'Water Intake', icon: 'Droplets', color: '#06b6d4' },
  { id: 'meditation', label: 'Meditation', icon: 'Sparkles', color: '#8b5cf6' },
  { id: 'productivity', label: 'Productivity', icon: 'Code2', color: '#10b981' }
];

/**
 * Pre-populates 90 days of realistic habit logs ending today
 * so the GitHub green box contribution grid looks alive right away!
 */
export const generateInitialLogs = () => {
  const logs = {};
  const today = new Date();

  // Generate 90 days of past logs
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);

    logs[dateStr] = {};

    // Simulate high adherence for a strong streak in the last 18 days
    const isRecentStreak = i <= 18;

    INITIAL_HABITS.forEach((habit) => {
      let completed = false;
      let value = 0;

      if (isRecentStreak) {
        // High likelihood of completion
        completed = Math.random() > 0.15;
      } else {
        // Normal past completion variation
        const dayOfWeek = d.getDay();
        // slightly higher on weekdays
        const prob = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 0.78;
        completed = Math.random() < prob;
      }

      // If today, let user have 2 already done so they can see progress and check off the rest!
      if (i === 0) {
        if (habit.id === 'habit-3') {
          // Water partially completed
          completed = false;
          value = 5; // 5 of 8 glasses
        } else if (habit.id === 'habit-2') {
          // Morning exercise completed
          completed = true;
          value = 30;
        } else if (habit.id === 'habit-4') {
          // Meditation completed
          completed = true;
          value = 15;
        } else {
          completed = false;
          value = 0;
        }
      } else {
        value = completed ? habit.target : Math.floor(habit.target * (Math.random() * 0.5));
      }

      logs[dateStr][habit.id] = {
        completed,
        value,
        timestamp: d.toISOString()
      };
    });
  }

  return logs;
};
