import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Search
} from 'lucide-react';
import { formatDisplayDate, getToday } from '../utils/habitStorage';

export default function TodayView({
  habits,
  logs,
  currentDate,
  onDateChange,
  onToggleHabit,
  onUpdateValue,
  streaks
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const todayKey = getToday();
  const isToday = currentDate === todayKey;
  const currentLogs = logs[currentDate] || {};

  const categories = ['All', ...new Set(habits.map((h) => h.category))];

  const filteredHabits = habits.filter((h) => {
    const matchSearch = h.title.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === 'All' || h.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const completedCount = habits.filter(
    (h) => currentLogs[h.id] && currentLogs[h.id].completed
  ).length;

  const totalCount = habits.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handlePrevDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const yr = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const dy = String(date.getDate()).padStart(2, '0');
    onDateChange(`${yr}-${mo}-${dy}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const yr = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const dy = String(date.getDate()).padStart(2, '0');
    onDateChange(`${yr}-${mo}-${dy}`);
  };

  const handleSetToday = () => {
    onDateChange(todayKey);
  };

  return (
    <div className="view-container">
      {/* Date Bar */}
      <div className="date-nav">
        <div className="date-nav-left">
          <button
            type="button"
            className="btn-icon"
            onClick={handlePrevDay}
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="date-label">
            {isToday ? 'Today, ' : ''}
            {formatDisplayDate(currentDate)}
          </span>
          <button
            type="button"
            className="btn-icon"
            onClick={handleNextDay}
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {!isToday && (
          <button
            type="button"
            className="btn-today-link"
            onClick={handleSetToday}
          >
            Jump to today
          </button>
        )}
      </div>

      {/* Progress Line */}
      <div className="progress-card">
        <div className="progress-meta">
          <span className="progress-text">
            {completedCount} of {totalCount} habits completed
          </span>
          <span className="progress-percent">{progressPercent}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-row">
        <div className="search-wrap">
          <Search size={15} className="search-ico" />
          <input
            type="text"
            className="search-input"
            placeholder="Search habits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Items List */}
      <div className="habit-list">
        {filteredHabits.length === 0 ? (
          <div className="empty-box">No habits found.</div>
        ) : (
          filteredHabits.map((habit) => {
            const entry = currentLogs[habit.id] || {
              completed: false,
              value: 0
            };
            const streak = streaks[habit.id] || 0;

            const handleIncrement = (e) => {
              e.stopPropagation();
              const next = entry.value + 1;
              onUpdateValue(habit.id, next);
            };

            const handleDecrement = (e) => {
              e.stopPropagation();
              const next = Math.max(0, entry.value - 1);
              onUpdateValue(habit.id, next);
            };

            return (
              <div
                key={habit.id}
                className={`habit-row ${entry.completed ? 'is-done' : ''}`}
                onClick={() => onToggleHabit(habit.id)}
              >
                <button
                  type="button"
                  className={`check-circle ${entry.completed ? 'checked' : ''}`}
                  aria-label={`Toggle ${habit.title}`}
                >
                  {entry.completed && <Check size={14} strokeWidth={2.5} />}
                </button>

                <div className="habit-info">
                  <div className="habit-title-row">
                    <span className="habit-title-text">{habit.title}</span>
                    <span className="habit-cat-label">{habit.category}</span>
                  </div>
                  <div className="habit-sub">
                    Goal: {habit.target} {habit.unit}
                  </div>
                </div>

                {/* Quick numeric counter if habit target > 1 */}
                {habit.target > 1 && (
                  <div
                    className="habit-counter"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={handleDecrement}
                      disabled={entry.value <= 0}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="counter-display">
                      {entry.value}/{habit.target}
                    </span>
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={handleIncrement}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                )}

                {streak > 0 && (
                  <div className="streak-tag">
                    <span>{streak}d</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
