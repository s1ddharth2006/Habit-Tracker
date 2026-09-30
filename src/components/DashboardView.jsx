import React, { useState } from 'react';
import StatsCards from './StatsCards';
import GithubHeatmap from './GithubHeatmap';
import HabitCard from './HabitCard';
import WaterIntakeWidget from './WaterIntakeWidget';
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Clock,
  Plus,
  Flame,
  CalendarDays
} from 'lucide-react';
import { CATEGORIES } from '../data/initialHabits';
import { formatDisplayDate, formatDateKey } from '../utils/streakUtils';

export default function DashboardView({
  habits,
  logs,
  stats,
  selectedDate,
  onChangeDate,
  onToggleComplete,
  onUpdateValue,
  onOpenAddModal,
  onSelectHeatmapDate,
  habitStreaks
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'

  const isToday = selectedDate === formatDateKey(new Date());
  const dayLogs = (logs && logs[selectedDate]) || {};

  // Find water habit for special widget
  const waterHabit = habits.find((h) => h.category === 'water');
  const waterLog = waterHabit ? dayLogs[waterHabit.id] : null;

  // Filter habits
  const filteredHabits = habits.filter((habit) => {
    // Search filter
    const matchesSearch =
      habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      habit.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategory === 'all' || habit.category === selectedCategory;

    // Status filter
    const isCompleted = dayLogs[habit.id] && dayLogs[habit.id].completed;
    let matchesStatus = true;
    if (statusFilter === 'completed') matchesStatus = !!isCompleted;
    if (statusFilter === 'pending') matchesStatus = !isCompleted;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Today's completion counts
  const totalHabits = habits.length;
  const completedCount = habits.filter(
    (h) => dayLogs[h.id] && dayLogs[h.id].completed
  ).length;
  const allDone = totalHabits > 0 && completedCount === totalHabits;

  // Date Navigation handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onChangeDate(formatDateKey(d));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onChangeDate(formatDateKey(d));
  };

  const handleSetToday = () => {
    onChangeDate(formatDateKey(new Date()));
  };

  return (
    <div className="dashboard-container">
      {/* Date Header & Quick Navigator */}
      <div className="date-banner-card">
        <div className="date-info-left">
          <div className="calendar-icon-chip">
            <CalendarDays size={22} />
          </div>
          <div>
            <div className="date-badge-row">
              {isToday ? (
                <span className="badge-today">Active Tracking Day</span>
              ) : (
                <span className="badge-past">Reviewing Past Date</span>
              )}
              <span className="date-sub-badge">
                {completedCount} / {totalHabits} Completed
              </span>
            </div>
            <h2 className="current-date-title">{formatDisplayDate(selectedDate)}</h2>
          </div>
        </div>

        {/* Date Shift Buttons */}
        <div className="date-controls-group">
          <button
            type="button"
            className="date-nav-btn"
            onClick={handlePrevDay}
            title="Previous Day"
          >
            <ChevronLeft size={18} />
            <span>Prev</span>
          </button>

          {!isToday && (
            <button
              type="button"
              className="date-today-btn"
              onClick={handleSetToday}
            >
              Back to Today
            </button>
          )}

          <button
            type="button"
            className="date-nav-btn"
            onClick={handleNextDay}
            title="Next Day"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Top 4 Stats Metric Cards */}
      <StatsCards
        stats={stats}
        todayCompletedCount={completedCount}
        totalHabitsCount={totalHabits}
        adherenceRate={stats.adherenceRate}
      />

      {/* Star Component: GitHub Activity Heatmap with Streak Visualizer */}
      <GithubHeatmap
        logs={logs}
        habits={habits}
        onSelectDate={onSelectHeatmapDate}
      />

      {/* Dedicated Water Intake Widget (Problem 13 Requirement) */}
      {waterHabit && (
        <WaterIntakeWidget
          habit={waterHabit}
          currentValue={waterLog ? waterLog.value : 0}
          isCompleted={waterLog ? waterLog.completed : false}
          onUpdateValue={onUpdateValue}
        />
      )}

      {/* All Complete Banner Celebration */}
      {allDone && (
        <div className="all-done-banner animate-fade-in">
          <div className="all-done-sparkle">
            <Sparkles size={28} />
          </div>
          <div>
            <h3 className="all-done-title">Outstanding! All Habits Completed Today! 🎉</h3>
            <p className="all-done-desc">
              You maintained 100% adherence today and kept your {stats.currentStreak}-day streak alive!
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="habits-toolbar">
        <div className="toolbar-header">
          <h3 className="section-title">
            <span>Today's Habits Checklist</span>
            <span className="items-count-badge">{filteredHabits.length}</span>
          </h3>

          <div className="status-tabs-group">
            <button
              type="button"
              className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({totalHabits})
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({totalHabits - completedCount})
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Search Input and Category Pills */}
        <div className="toolbar-filters-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-field"
              placeholder="Search habits by name or motivation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="category-scroll-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-wrap">
            <SlidersHorizontal size={36} />
          </div>
          <h4 className="empty-title">No matching habits found</h4>
          <p className="empty-text">
            Try adjusting your search query, clearing filters, or create a brand new habit to track!
          </p>
          <button
            type="button"
            className="btn-submit-primary"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>Create New Habit</span>
          </button>
        </div>
      ) : (
        <div className="habits-cards-grid">
          {filteredHabits.map((habit) => {
            const hLog = dayLogs[habit.id];
            const isCompleted = hLog ? hLog.completed : false;
            const currentValue = hLog ? hLog.value : 0;
            const streakData = habitStreaks[habit.id] || { currentStreak: 0 };

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isCompleted}
                currentValue={currentValue}
                streak={streakData.currentStreak}
                onToggleComplete={onToggleComplete}
                onUpdateValue={onUpdateValue}
                logs={logs}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
