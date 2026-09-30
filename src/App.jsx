import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import HabitsView from './components/HabitsView';
import AnalyticsView from './components/AnalyticsView';
import PresentationView from './components/PresentationView';
import HabitModal from './components/HabitModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DayDetailsModal from './components/DayDetailsModal';

import { INITIAL_HABITS, generateInitialLogs } from './data/initialHabits';
import {
  getTodayKey,
  calculateOverallStreaks,
  calculateHabitStreak,
  formatDateKey
} from './utils/streakUtils';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('habitpulse_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Current navigation view: 'dashboard' | 'habits' | 'analytics' | 'presentation'
  const [currentView, setCurrentView] = useState('dashboard');

  // Currently selected date for tracking (defaults to today)
  const [selectedDate, setSelectedDate] = useState(getTodayKey());

  // Habits state with localStorage persistence
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('habitpulse_habits');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading habits from localStorage', e);
    }
    return INITIAL_HABITS;
  });

  // Habit completion logs state with localStorage persistence
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('habitpulse_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading logs from localStorage', e);
    }
    return generateInitialLogs();
  });

  // Modal controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [inspectingDate, setInspectingDate] = useState(null);

  // Sync theme to root class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('habitpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('habitpulse_theme', 'light');
    }
  }, [isDarkMode]);

  // Save habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('habitpulse_habits', JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage', e);
    }
  }, [habits]);

  // Save logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('habitpulse_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }, [logs]);

  // Calculate Overall Streaks
  const overallStats = useMemo(() => {
    return calculateOverallStreaks(logs);
  }, [logs]);

  // Calculate Per-Habit Streaks
  const habitStreaks = useMemo(() => {
    const map = {};
    habits.forEach((h) => {
      map[h.id] = calculateHabitStreak(logs, h.id);
    });
    return map;
  }, [logs, habits]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Toggle habit completion for a specific date
  const handleToggleComplete = (habitId, date = selectedDate) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    setLogs((prevLogs) => {
      const dayLogs = { ...(prevLogs[date] || {}) };
      const currentEntry = dayLogs[habitId] || { completed: false, value: 0 };
      const willBeCompleted = !currentEntry.completed;

      dayLogs[habitId] = {
        completed: willBeCompleted,
        value: willBeCompleted ? habit.target : 0,
        timestamp: new Date().toISOString()
      };

      const updated = {
        ...prevLogs,
        [date]: dayLogs
      };

      // Check if all habits for this date are completed after this toggle
      if (willBeCompleted) {
        const allDone = habits.every(
          (h) => (h.id === habitId ? true : (dayLogs[h.id] && dayLogs[h.id].completed))
        );
        if (allDone) {
          triggerConfetti();
        }
      }

      return updated;
    });
  };

  // Update numeric value for habit (e.g. water glasses, pages, minutes)
  const handleUpdateValue = (habitId, newValue, date = selectedDate) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    setLogs((prevLogs) => {
      const dayLogs = { ...(prevLogs[date] || {}) };
      const isNowCompleted = newValue >= habit.target;

      dayLogs[habitId] = {
        completed: isNowCompleted,
        value: newValue,
        timestamp: new Date().toISOString()
      };

      const updated = {
        ...prevLogs,
        [date]: dayLogs
      };

      if (isNowCompleted) {
        const allDone = habits.every(
          (h) => (h.id === habitId ? true : (dayLogs[h.id] && dayLogs[h.id].completed))
        );
        if (allDone) {
          triggerConfetti();
        }
      }

      return updated;
    });
  };

  // Toggle habit directly from Day Details Modal (clicked from Heatmap)
  const handleToggleHabitForDate = (dateStr, habitId) => {
    handleToggleComplete(habitId, dateStr);
  };

  // Add new habit
  const handleSaveNewHabit = (habitData) => {
    const newHabit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      createdAt: formatDateKey(new Date())
    };

    setHabits((prev) => [...prev, newHabit]);
    setIsAddModalOpen(false);
  };

  // Edit existing habit
  const handleSaveEditHabit = (updatedData) => {
    if (!editingHabit) return;
    setHabits((prev) =>
      prev.map((h) => (h.id === editingHabit.id ? { ...h, ...updatedData } : h))
    );
    setEditingHabit(null);
  };

  // Delete habit
  const handleConfirmDeleteHabit = () => {
    if (!deletingHabit) return;
    const habitId = deletingHabit.id;

    // Remove habit
    setHabits((prev) => prev.filter((h) => h.id !== habitId));

    // Remove logs associated with habit
    setLogs((prevLogs) => {
      const updated = { ...prevLogs };
      Object.keys(updated).forEach((d) => {
        if (updated[d][habitId]) {
          const dayCopy = { ...updated[d] };
          delete dayCopy[habitId];
          updated[d] = dayCopy;
        }
      });
      return updated;
    });

    setDeletingHabit(null);
  };

  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        currentStreak={overallStats.currentStreak}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content View Switcher */}
      <main className="app-main-content">
        {currentView === 'dashboard' && (
          <DashboardView
            habits={habits}
            logs={logs}
            stats={overallStats}
            selectedDate={selectedDate}
            onChangeDate={setSelectedDate}
            onToggleComplete={handleToggleComplete}
            onUpdateValue={handleUpdateValue}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectHeatmapDate={(dateStr) => setInspectingDate(dateStr)}
            habitStreaks={habitStreaks}
          />
        )}

        {currentView === 'habits' && (
          <HabitsView
            habits={habits}
            habitStreaks={habitStreaks}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenEditModal={(habit) => setEditingHabit(habit)}
            onOpenDeleteModal={(habit) => setDeletingHabit(habit)}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            logs={logs}
            habits={habits}
            stats={overallStats}
            habitStreaks={habitStreaks}
            onSelectHeatmapDate={(dateStr) => setInspectingDate(dateStr)}
          />
        )}

        {currentView === 'presentation' && (
          <PresentationView />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <strong>Task 2: Interactive JavaScript & ReactJS Application Development</strong>
            <span className="footer-sub">Group 2: Daily Life & Productivity — Statement 13 (Personal Habit Tracker)</span>
          </div>
          <div className="footer-right">
            <span>Built with React 18 & ES6 • GitHub Activity Matrix & Heatmap</span>
          </div>
        </div>
      </footer>

      {/* Create Habit Modal */}
      {isAddModalOpen && (
        <HabitModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewHabit}
          allHabits={habits}
        />
      )}

      {/* Edit Habit Modal */}
      {editingHabit && (
        <HabitModal
          isOpen={!!editingHabit}
          existingHabit={editingHabit}
          onClose={() => setEditingHabit(null)}
          onSave={handleSaveEditHabit}
          allHabits={habits}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingHabit && (
        <DeleteConfirmModal
          isOpen={!!deletingHabit}
          onClose={() => setDeletingHabit(null)}
          onConfirm={handleConfirmDeleteHabit}
          habitTitle={deletingHabit.title}
        />
      )}

      {/* Heatmap Day Inspector Modal */}
      {inspectingDate && (
        <DayDetailsModal
          isOpen={!!inspectingDate}
          selectedDate={inspectingDate}
          habits={habits}
          logs={logs}
          onClose={() => setInspectingDate(null)}
          onToggleHabitForDate={handleToggleHabitForDate}
        />
      )}
    </div>
  );
}
