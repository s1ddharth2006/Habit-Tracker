import React from 'react';
import { Flame, Trophy, CheckCircle, Activity, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats, todayCompletedCount, totalHabitsCount, adherenceRate }) {
  const percentage = totalHabitsCount > 0 ? Math.round((todayCompletedCount / totalHabitsCount) * 100) : 0;

  return (
    <div className="stats-cards-grid">
      {/* Current Streak */}
      <div className="stat-card streak-card">
        <div className="stat-card-icon-wrapper streak-glow">
          <Flame size={24} className="flame-icon animate-pulse-glow" />
        </div>
        <div className="stat-card-content">
          <span className="stat-card-label">Current Streak</span>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{stats.currentStreak}</span>
            <span className="stat-card-unit">Days</span>
          </div>
          <span className="stat-card-subtext">
            {stats.currentStreak > 0 ? 'Keep the fire burning! 🔥' : 'Complete a habit to start!'}
          </span>
        </div>
      </div>

      {/* Longest Streak */}
      <div className="stat-card trophy-card">
        <div className="stat-card-icon-wrapper trophy-glow">
          <Trophy size={24} className="trophy-icon" />
        </div>
        <div className="stat-card-content">
          <span className="stat-card-label">Longest Streak</span>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{stats.longestStreak}</span>
            <span className="stat-card-unit">Days</span>
          </div>
          <span className="stat-card-subtext">Personal best record 🏆</span>
        </div>
      </div>

      {/* Today's Completion */}
      <div className="stat-card today-card">
        <div className="stat-card-icon-wrapper today-glow">
          <CheckCircle size={24} className="check-icon" />
        </div>
        <div className="stat-card-content">
          <div className="stat-card-header-flex">
            <span className="stat-card-label">Today's Progress</span>
            <span className="stat-card-badge">{percentage}%</span>
          </div>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{todayCompletedCount}</span>
            <span className="stat-card-unit">/ {totalHabitsCount} done</span>
          </div>
          <div className="stat-progress-bar-bg">
            <div
              className="stat-progress-bar-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Total Active Check-ins */}
      <div className="stat-card active-card">
        <div className="stat-card-icon-wrapper active-glow">
          <Activity size={24} className="activity-icon" />
        </div>
        <div className="stat-card-content">
          <span className="stat-card-label">Active Days Logged</span>
          <div className="stat-card-value-row">
            <span className="stat-card-value">{stats.totalActiveDays}</span>
            <span className="stat-card-unit">Days</span>
          </div>
          <span className="stat-card-subtext">Historical commitment rate 📈</span>
        </div>
      </div>
    </div>
  );
}
