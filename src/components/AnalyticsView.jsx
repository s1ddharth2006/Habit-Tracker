import React, { useState } from 'react';
import GithubHeatmap from './GithubHeatmap';
import {
  Flame,
  Trophy,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  BarChart2,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { formatDateKey } from '../utils/streakUtils';

export default function AnalyticsView({
  logs,
  habits,
  stats,
  habitStreaks,
  onSelectHeatmapDate
}) {
  const [selectedHabitForHeatmap, setSelectedHabitForHeatmap] = useState('all');

  // Compute 7-day completion percentages
  const last7DaysData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const dayLogs = (logs && logs[dateStr]) || {};

    let done = 0;
    habits.forEach((h) => {
      if (dayLogs[h.id] && dayLogs[h.id].completed) done++;
    });

    const rate = habits.length > 0 ? Math.round((done / habits.length) * 100) : 0;
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    last7DaysData.push({
      dateStr,
      dayLabel,
      completed: done,
      total: habits.length,
      percentage: rate
    });
  }

  // Calculate category completion statistics
  const categoryStats = {};
  habits.forEach((h) => {
    if (!categoryStats[h.category]) {
      categoryStats[h.category] = { count: 0, completions: 0, color: h.color };
    }
    categoryStats[h.category].count++;
    const s = habitStreaks[h.id];
    if (s) {
      categoryStats[h.category].completions += s.totalCompleted;
    }
  });

  // Calculate achievements
  const achievements = [
    {
      id: 'streak-3',
      title: 'First Flame',
      description: 'Achieve a 3-day continuous habit streak',
      icon: Flame,
      unlocked: stats.longestStreak >= 3,
      current: Math.min(3, stats.longestStreak),
      max: 3
    },
    {
      id: 'streak-7',
      title: '7-Day Warrior',
      description: 'Keep your routine alive for a full week',
      icon: Zap,
      unlocked: stats.longestStreak >= 7,
      current: Math.min(7, stats.longestStreak),
      max: 7
    },
    {
      id: 'streak-14',
      title: 'Fortnight Master',
      description: '14 consecutive days of unstoppable momentum',
      icon: Trophy,
      unlocked: stats.longestStreak >= 14,
      current: Math.min(14, stats.longestStreak),
      max: 14
    },
    {
      id: 'streak-30',
      title: 'Monthly Legend',
      description: 'Maintain habit consistency for 30 consecutive days',
      icon: Award,
      unlocked: stats.longestStreak >= 30,
      current: Math.min(30, stats.longestStreak),
      max: 30
    },
    {
      id: 'century-club',
      title: 'Century Check-in',
      description: 'Log 100 total habit completions',
      icon: Target,
      unlocked: stats.totalActiveDays >= 50,
      current: Math.min(50, stats.totalActiveDays),
      max: 50
    },
    {
      id: 'zen-master',
      title: 'Balanced Life',
      description: 'Active habits in Reading, Exercise, Water & Meditation',
      icon: Sparkles,
      unlocked: habits.length >= 4,
      current: habits.length,
      max: 4
    }
  ];

  return (
    <div className="analytics-view-container">
      {/* Top Banner */}
      <div className="view-header-row">
        <div>
          <div className="view-badge">Deep Analytics & Streaks</div>
          <h2 className="view-title">Habit Heatmap & Adherence Insights</h2>
          <p className="view-subtitle">
            Explore your GitHub contribution activity grid, analyze weekly consistency charts, and unlock habit milestone badges.
          </p>
        </div>
      </div>

      {/* GitHub Heatmap Section */}
      <section className="analytics-section">
        <GithubHeatmap
          logs={logs}
          habits={habits}
          selectedHabitId={selectedHabitForHeatmap}
          onSelectHabit={setSelectedHabitForHeatmap}
          onSelectDate={onSelectHeatmapDate}
        />
      </section>

      {/* Two Column Layout: Weekly Trend & Category Breakdown */}
      <div className="analytics-grid-2col">
        {/* Weekly Adherence Chart */}
        <div className="analytics-card">
          <div className="card-header-flex">
            <div>
              <h3 className="analytics-card-title">Last 7 Days Consistency</h3>
              <p className="analytics-card-sub">Daily percentage of habits marked complete</p>
            </div>
            <BarChart2 size={20} className="card-accent-icon" />
          </div>

          <div className="bar-chart-container">
            {last7DaysData.map((day) => (
              <div key={day.dateStr} className="bar-column">
                <span className="bar-tooltip-label">{day.percentage}%</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${day.percentage}%`,
                      backgroundColor:
                        day.percentage === 100
                          ? '#10b981'
                          : day.percentage >= 50
                          ? '#3b82f6'
                          : '#f59e0b'
                    }}
                  ></div>
                </div>
                <span className="bar-day-name">{day.dayLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Adherence Breakdown */}
        <div className="analytics-card">
          <div className="card-header-flex">
            <div>
              <h3 className="analytics-card-title">Category Distribution</h3>
              <p className="analytics-card-sub">Habit categories and all-time completions</p>
            </div>
            <TrendingUp size={20} className="card-accent-icon" />
          </div>

          <div className="category-stats-list">
            {Object.entries(categoryStats).map(([catKey, data]) => (
              <div key={catKey} className="category-stat-row">
                <div className="cat-row-left">
                  <span
                    className="cat-color-dot"
                    style={{ backgroundColor: data.color || '#3b82f6' }}
                  ></span>
                  <div>
                    <span className="cat-name capitalize">{catKey}</span>
                    <span className="cat-count">{data.count} habits configured</span>
                  </div>
                </div>
                <div className="cat-row-right">
                  <span className="cat-completions-badge">
                    {data.completions} check-ins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement & Streak Badges */}
      <div className="analytics-card milestones-card">
        <div className="card-header-flex">
          <div>
            <h3 className="analytics-card-title">Streak Milestones & Achievements</h3>
            <p className="analytics-card-sub">
              Gamified awards unlocked through consistent daily practice
            </p>
          </div>
          <Award size={22} className="card-accent-icon" />
        </div>

        <div className="achievements-grid">
          {achievements.map((ach) => {
            const AchIcon = ach.icon;
            return (
              <div
                key={ach.id}
                className={`achievement-badge-card ${ach.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon-wrapper">
                  <AchIcon size={24} />
                </div>
                <div className="achievement-content">
                  <div className="achievement-title-row">
                    <h4 className="achievement-title">{ach.title}</h4>
                    {ach.unlocked && <span className="unlocked-tag">Unlocked ✓</span>}
                  </div>
                  <p className="achievement-desc">{ach.description}</p>
                  <div className="achievement-progress-wrap">
                    <div className="achievement-progress-bar">
                      <div
                        className="achievement-progress-fill"
                        style={{
                          width: `${Math.min(100, Math.round((ach.current / ach.max) * 100))}%`
                        }}
                      ></div>
                    </div>
                    <span className="achievement-progress-txt">
                      {ach.current} / {ach.max}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
