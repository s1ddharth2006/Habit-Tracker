import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TodayView from './components/TodayView';
import WeeklyView from './components/WeeklyView';
import ManageHabitsView from './components/ManageHabitsView';
import HabitFormModal from './components/HabitFormModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

import {
  DEFAULT_HABITS,
  generateDefaultLogs,
  getToday,
  calculateStreak
} from './utils/habitStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [currentDate, setCurrentDate] = useState(getToday());

  // Habits with localStorage
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('minimal_habits');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_HABITS;
  });

  // Logs with localStorage
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('minimal_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateDefaultLogs();
  });

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('minimal_habits', JSON.stringify(habits));
    } catch (e) {
      console.error(e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem('minimal_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  // Compute streaks
  const streaks = useMemo(() => {
    const map = {};
    habits.forEach((h) => {
      map[h.id] = calculateStreak(h.id, logs);
    });
    return map;
  }, [habits, logs]);

  // Today stats
  const todayKey = getToday();
  const todayLogs = logs[todayKey] || {};
  const completedTodayCount = habits.filter(
    (h) => todayLogs[h.id] && todayLogs[h.id].completed
  ).length;

  // Toggle habit for date
  const handleToggleHabit = (habitId, dateStr = currentDate) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    setLogs((prev) => {
      const dayLogs = { ...(prev[dateStr] || {}) };
      const current = dayLogs[habitId] || { completed: false, value: 0 };
      const nextCompleted = !current.completed;

      dayLogs[habitId] = {
        completed: nextCompleted,
        value: nextCompleted ? habit.target : 0
      };

      return {
        ...prev,
        [dateStr]: dayLogs
      };
    });
  };

  // Update numeric value
  const handleUpdateValue = (habitId, newValue, dateStr = currentDate) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    setLogs((prev) => {
      const dayLogs = { ...(prev[dateStr] || {}) };
      const completed = newValue >= habit.target;

      dayLogs[habitId] = {
        completed,
        value: newValue
      };

      return {
        ...prev,
        [dateStr]: dayLogs
      };
    });
  };

  // Add or Edit habit
  const handleSaveHabit = (formData) => {
    if (editingHabit) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? { ...h, ...formData } : h))
      );
      setEditingHabit(null);
    } else {
      const newHabit = {
        id: `h-${Date.now()}`,
        ...formData
      };
      setHabits((prev) => [...prev, newHabit]);
      setIsFormOpen(false);
    }
  };

  // Delete habit
  const handleConfirmDelete = () => {
    if (!deletingHabit) return;
    const id = deletingHabit.id;
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setDeletingHabit(null);
  };

  return (
    <div className="app-layout">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewHabit={() => {
          setEditingHabit(null);
          setIsFormOpen(true);
        }}
        completedCount={completedTodayCount}
        totalCount={habits.length}
      />

      <main className="app-main">
        {activeTab === 'today' && (
          <TodayView
            habits={habits}
            logs={logs}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onToggleHabit={(id) => handleToggleHabit(id, currentDate)}
            onUpdateValue={(id, val) => handleUpdateValue(id, val, currentDate)}
            streaks={streaks}
          />
        )}

        {activeTab === 'week' && (
          <WeeklyView
            habits={habits}
            logs={logs}
            onToggleHabitForDate={handleToggleHabit}
          />
        )}

        {activeTab === 'manage' && (
          <ManageHabitsView
            habits={habits}
            streaks={streaks}
            onOpenNewHabit={() => {
              setEditingHabit(null);
              setIsFormOpen(true);
            }}
            onEditHabit={(habit) => setEditingHabit(habit)}
            onDeleteHabit={(habit) => setDeletingHabit(habit)}
          />
        )}
      </main>

      <HabitFormModal
        isOpen={isFormOpen || !!editingHabit}
        onClose={() => {
          setIsFormOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        initialHabit={editingHabit}
        existingHabits={habits}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingHabit}
        habitTitle={deletingHabit ? deletingHabit.title : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingHabit(null)}
      />
    </div>
  );
}
