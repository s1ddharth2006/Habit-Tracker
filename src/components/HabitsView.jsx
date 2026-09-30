import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  Layers,
  BookOpen,
  Dumbbell,
  Droplets,
  Sparkles,
  Code2
} from 'lucide-react';
import { CATEGORIES } from '../data/initialHabits';

const ICON_MAP = {
  BookOpen: BookOpen,
  Dumbbell: Dumbbell,
  Droplets: Droplets,
  Sparkles: Sparkles,
  Code2: Code2
};

export default function HabitsView({
  habits,
  habitStreaks,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="habits-view-container">
      {/* View Header */}
      <div className="view-header-row">
        <div>
          <div className="view-badge">Habit Management & Library</div>
          <h2 className="view-title">Manage Your Daily Routines</h2>
          <p className="view-subtitle">
            Configure habits, daily target goals, reminder periods, and review your historical completion records.
          </p>
        </div>

        <button
          type="button"
          className="btn-submit-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={18} />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="habits-toolbar">
        <div className="toolbar-filters-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-field"
              placeholder="Search by habit title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

      {/* Habits Card Deck */}
      {filteredHabits.length === 0 ? (
        <div className="empty-state-card">
          <Layers size={40} className="empty-icon-muted" />
          <h4 className="empty-title">No habits found</h4>
          <p className="empty-text">No habits match your active criteria.</p>
        </div>
      ) : (
        <div className="manage-habits-grid">
          {filteredHabits.map((habit) => {
            const streakData = habitStreaks[habit.id] || {
              currentStreak: 0,
              longestStreak: 0,
              totalCompleted: 0
            };
            const IconComponent = ICON_MAP[habit.icon] || Sparkles;

            return (
              <div key={habit.id} className="manage-habit-card">
                <div
                  className="manage-card-accent"
                  style={{ backgroundColor: habit.color || '#3b82f6' }}
                ></div>

                <div className="manage-card-body">
                  <div className="manage-card-top">
                    <div
                      className="manage-icon-wrap"
                      style={{
                        backgroundColor: `${habit.color}18`,
                        color: habit.color,
                        borderColor: `${habit.color}40`
                      }}
                    >
                      <IconComponent size={22} />
                    </div>

                    <div className="manage-card-meta">
                      <span className="manage-cat-tag">
                        <span className="dot" style={{ backgroundColor: habit.color }}></span>
                        {habit.category}
                      </span>
                      <h3 className="manage-habit-name">{habit.title}</h3>
                    </div>
                  </div>

                  <p className="manage-habit-desc">
                    {habit.description || 'No description provided.'}
                  </p>

                  {/* Habit Metrics Row */}
                  <div className="manage-metrics-row">
                    <div className="metric-box">
                      <div className="metric-icon-label">
                        <Flame size={14} className="streak-flame" />
                        <span>Current</span>
                      </div>
                      <span className="metric-val">{streakData.currentStreak} d</span>
                    </div>

                    <div className="metric-box">
                      <div className="metric-icon-label">
                        <Trophy size={14} className="trophy-icon" />
                        <span>Best</span>
                      </div>
                      <span className="metric-val">{streakData.longestStreak} d</span>
                    </div>

                    <div className="metric-box">
                      <div className="metric-icon-label">
                        <CheckCircle2 size={14} className="check-icon" />
                        <span>Total</span>
                      </div>
                      <span className="metric-val">{streakData.totalCompleted}</span>
                    </div>
                  </div>

                  {/* Settings summary */}
                  <div className="manage-details-list">
                    <div className="detail-item">
                      <span className="detail-label">Daily Goal:</span>
                      <span className="detail-value">
                        {habit.target} {habit.unit} / day
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time of Day:</span>
                      <span className="detail-value capitalize">
                        {habit.timeOfDay || 'Anytime'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="manage-card-actions">
                    <button
                      type="button"
                      className="btn-card-action edit"
                      onClick={() => onOpenEditModal(habit)}
                      title="Edit Habit Configuration"
                    >
                      <Edit3 size={15} />
                      <span>Edit Habit</span>
                    </button>

                    <button
                      type="button"
                      className="btn-card-action delete"
                      onClick={() => onOpenDeleteModal(habit)}
                      title="Delete Habit"
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
