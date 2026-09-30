import React from 'react';
import {
  Flame,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  BookOpenCheck,
  Plus,
  Moon,
  Sun
} from 'lucide-react';

export default function Navbar({
  currentView,
  onViewChange,
  onOpenAddModal,
  currentStreak = 0,
  isDarkMode,
  onToggleTheme
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <div className="brand-logo" onClick={() => onViewChange('dashboard')}>
          <div className="logo-icon-bubble">
            <Flame size={24} className="logo-flame" />
          </div>
          <div>
            <div className="logo-title-row">
              <span className="brand-name">HabitPulse</span>
              <span className="brand-tag">v2.0</span>
            </div>
            <span className="brand-subtitle">Personal Habit Tracker & GitHub Heatmap</span>
          </div>
        </div>

        {/* Navigation Tabs (At least 3 functional views per PDF requirement) */}
        <nav className="header-nav">
          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Today's Tracker</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'habits' ? 'active' : ''}`}
            onClick={() => onViewChange('habits')}
          >
            <ListTodo size={18} />
            <span>Manage Habits</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => onViewChange('analytics')}
          >
            <BarChart3 size={18} />
            <span>Streak & Heatmap</span>
          </button>

          <button
            type="button"
            className={`nav-tab-btn presentation-tab ${currentView === 'presentation' ? 'active' : ''}`}
            onClick={() => onViewChange('presentation')}
            title="Assignment Presentation Slides & Docs"
          >
            <BookOpenCheck size={18} />
            <span>Academic Slides</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="header-actions">
          {/* Active Streak Badge */}
          <div className="header-streak-badge" title={`Current Daily Streak: ${currentStreak} Days`}>
            <Flame size={18} className="flame-animate" />
            <span className="streak-num">{currentStreak}</span>
            <span className="streak-txt">streak</span>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Add Habit Button */}
          <button
            type="button"
            className="btn-add-habit-nav"
            onClick={onOpenAddModal}
          >
            <Plus size={18} />
            <span>New Habit</span>
          </button>
        </div>
      </div>
    </header>
  );
}
