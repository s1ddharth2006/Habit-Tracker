// Utility functions for dates, streaks, and GitHub-style heatmap calculations

export const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayKey = () => {
  return formatDateKey(new Date());
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Calculates current streak and longest streak across all habit logs.
 * A day counts as active if at least one habit was completed.
 * @param {Object} logs - { [dateStr]: { [habitId]: { completed: boolean, value?: number } } }
 */
export const calculateOverallStreaks = (logs) => {
  const today = getTodayKey();
  const activeDates = new Set();

  Object.entries(logs || {}).forEach(([dateStr, habitMap]) => {
    const hasCompleted = Object.values(habitMap || {}).some((h) => h.completed);
    if (hasCompleted) {
      activeDates.add(dateStr);
    }
  });

  const sortedDates = Array.from(activeDates).sort();
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (let i = 0; i < sortedDates.length; i++) {
    const currDate = new Date(sortedDates[i]);
    if (prevDate) {
      const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currDate;
  }

  // Calculate current streak
  let currentStreak = 0;
  const d = new Date();
  const todayStr = formatDateKey(d);

  // Check if today is completed
  let checkDate = new Date();
  if (!activeDates.has(todayStr)) {
    // If today is not completed yet, check if yesterday was completed
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDateKey(checkDate);
    if (activeDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalActiveDays: activeDates.size
  };
};

/**
 * Calculates streak for an individual habit
 */
export const calculateHabitStreak = (logs, habitId) => {
  const activeDates = new Set();

  Object.entries(logs || {}).forEach(([dateStr, habitMap]) => {
    if (habitMap && habitMap[habitId] && habitMap[habitId].completed) {
      activeDates.add(dateStr);
    }
  });

  const sortedDates = Array.from(activeDates).sort();
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCompleted: 0 };
  }

  // Longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (let i = 0; i < sortedDates.length; i++) {
    const currDate = new Date(sortedDates[i]);
    if (prevDate) {
      const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currDate;
  }

  // Current streak
  let currentStreak = 0;
  let checkDate = new Date();
  const todayStr = formatDateKey(checkDate);

  if (!activeDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDateKey(checkDate);
    if (activeDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalCompleted: activeDates.size
  };
};

/**
 * Generates an array of weeks for the GitHub Contribution Heatmap Grid
 * Returns 52 weeks or custom number of weeks ending on the current week's Saturday.
 */
export const generateHeatmapData = (logs, habits, filterHabitId = 'all', totalWeeks = 32) => {
  const weeks = [];
  const now = new Date();

  // Find ending Saturday (end of current week)
  const endDate = new Date(now);
  const dayOfWeek = endDate.getDay(); // 0 is Sunday, 6 is Saturday
  endDate.setDate(endDate.getDate() + (6 - dayOfWeek));

  // Find start date (totalWeeks ago on Sunday)
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - totalWeeks * 7 + 1);

  const curr = new Date(startDate);
  let currentWeek = [];

  while (curr <= endDate) {
    const dateStr = formatDateKey(curr);
    const dayLogs = (logs && logs[dateStr]) || {};

    let completedCount = 0;
    let habitTitlesCompleted = [];

    if (filterHabitId === 'all') {
      habits.forEach((habit) => {
        if (dayLogs[habit.id] && dayLogs[habit.id].completed) {
          completedCount++;
          habitTitlesCompleted.push(habit.title);
        }
      });
    } else {
      if (dayLogs[filterHabitId] && dayLogs[filterHabitId].completed) {
        completedCount = 1;
        const habit = habits.find((h) => h.id === filterHabitId);
        if (habit) habitTitlesCompleted.push(habit.title);
      }
    }

    // Determine GitHub intensity level (0 to 4)
    let level = 0;
    if (filterHabitId === 'all') {
      if (completedCount === 0) level = 0;
      else if (completedCount === 1) level = 1;
      else if (completedCount === 2) level = 2;
      else if (completedCount <= 3) level = 3;
      else level = 4;
    } else {
      level = completedCount > 0 ? 3 : 0;
    }

    // Do not show future days as active
    const isFuture = curr > now;

    currentWeek.push({
      dateStr,
      date: new Date(curr),
      dayIndex: curr.getDay(), // 0 = Sun, 1 = Mon ...
      count: isFuture ? 0 : completedCount,
      level: isFuture ? 0 : level,
      isFuture,
      isToday: dateStr === getTodayKey(),
      habitTitles: habitTitlesCompleted
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    curr.setDate(curr.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};
