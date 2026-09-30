import React from 'react';
import {
  BookOpen,
  Dumbbell,
  Droplets,
  Sparkles,
  Code2,
  Check,
  Plus,
  Minus,
  Flame,
  Clock,
  Target
} from 'lucide-react';
import { formatDateKey } from '../utils/streakUtils';

const ICON_MAP = {
  BookOpen: BookOpen,
  Dumbbell: Dumbbell,
  Droplets: Droplets,
  Sparkles: Sparkles,
  Code2: Code2
};

export default function HabitCard({
  habit,
  isCompleted,
  currentValue = 0,
  onToggleComplete,
  onUpdateValue,
  streak = 0,
  logs,
  onEdit,
  onDelete
}) {
  const IconComponent = ICON_MAP[habit.icon] || Sparkles;

  // Mini 7-day past history dots
  const past7Days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const dayLog = logs && logs[dateStr] && logs[dateStr][habit.id];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    past7Days.push({
      dateStr,
      dayName,
      isDone: dayLog ? dayLog.completed : false,
      isToday: i === 0
    });
  }

  const handleIncrement = (e) => {
    e.stopPropagation();
    const step = habit.category === 'water' ? 1 : (habit.target > 30 ? 5 : 1);
    const nextVal = Math.min(habit.target * 2, (currentValue || 0) + step);
    onUpdateValue(habit.id, nextVal);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    const step = habit.category === 'water' ? 1 : (habit.target > 30 ? 5 : 1);
    const nextVal = Math.max(0, (currentValue || 0) - step);
    onUpdateValue(habit.id, nextVal);
  };

  const progressPercent = Math.min(100, Math.round(((currentValue || 0) / habit.target) * 100));

  return (
    <div className={`habit-card ${isCompleted ? 'habit-completed' : ''}`}>
      {/* Category accent bar */}
      <div
        className="habit-card-accent"
        style={{ backgroundColor: habit.color || '#3b82f6' }}
      ></div>

      <div className="habit-card-inner">
        {/* Top Header */}
        <div className="habit-header-row">
          <div className="habit-icon-title-wrap">
            <div
              className="habit-category-icon"
              style={{
                backgroundColor: `${habit.color}18`,
                color: habit.color,
                borderColor: `${habit.color}40`
              }}
            >
              <IconComponent size={20} />
            </div>
            <div>
              <div className="habit-category-tag">
                <span className="category-dot" style={{ backgroundColor: habit.color }}></span>
                {habit.category}
              </div>
              <h4 className="habit-title">{habit.title}</h4>
            </div>
          </div>

          {/* Habit Streak Tag */}
          <div className="habit-streak-badge" title={`${streak} consecutive days completed`}>
            <Flame size={14} className="streak-flame" />
            <span>{streak}d</span>
          </div>
        </div>

        <p className="habit-description">{habit.description}</p>

        {/* Goal & Numeric Counter Controls */}
        <div className="habit-goal-section">
          <div className="habit-target-info">
            <span className="target-label">
              <Target size={13} />
              Goal: {habit.target} {habit.unit}
            </span>
            <span className="current-progress-text">
              {currentValue} / {habit.target} {habit.unit} ({progressPercent}%)
            </span>
          </div>

          {/* Quick Counter Buttons */}
          <div className="counter-controls">
            <button
              type="button"
              className="counter-btn"
              onClick={handleDecrement}
              title={`Decrease ${habit.unit}`}
              disabled={currentValue <= 0}
            >
              <Minus size={14} />
            </button>
            <span className="counter-value">{currentValue}</span>
            <button
              type="button"
              className="counter-btn"
              onClick={handleIncrement}
              title={`Increase ${habit.unit}`}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="habit-progress-bar-bg">
          <div
            className="habit-progress-bar-fill"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: isCompleted ? '#10b981' : habit.color
            }}
          ></div>
        </div>

        {/* Card Footer: 7-Day History & Big Action Toggle */}
        <div className="habit-card-footer">
          {/* Mini 7-day dots */}
          <div className="mini-history-dots">
            {past7Days.map((d, i) => (
              <div key={i} className="mini-dot-wrapper">
                <span className="mini-dot-label">{d.dayName}</span>
                <span
                  className={`mini-dot ${d.isDone ? 'dot-done' : ''} ${d.isToday ? 'dot-today' : ''}`}
                  title={`${d.dateStr}: ${d.isDone ? 'Completed' : 'Missed'}`}
                ></span>
              </div>
            ))}
          </div>

          {/* Complete Toggle Button */}
          <button
            type="button"
            className={`complete-toggle-btn ${isCompleted ? 'is-completed' : ''}`}
            onClick={() => onToggleComplete(habit.id)}
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            <span className="checkbox-visual">
              {isCompleted ? <Check size={16} strokeWidth={3} /> : null}
            </span>
            <span className="toggle-btn-label">
              {isCompleted ? 'Completed' : 'Mark Done'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
