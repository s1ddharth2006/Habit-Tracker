import React, { useState } from 'react';
import { generateHeatmapData, formatDisplayDate } from '../utils/streakUtils';
import { Flame, Trophy, Calendar, CheckCircle2, ChevronRight, Info } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function GithubHeatmap({ logs, habits, onSelectDate, selectedHabitId = 'all', onSelectHabit }) {
  const [filterId, setFilterId] = useState(selectedHabitId);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate 28 weeks (~6.5 months) of activity matrix
  const weeks = generateHeatmapData(logs, habits, filterId, 28);

  const handleHabitFilterChange = (e) => {
    const val = e.target.value;
    setFilterId(val);
    if (onSelectHabit) onSelectHabit(val);
  };

  const handleMouseEnter = (day, e) => {
    if (day.isFuture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // Extract month labels with their column positions
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    // Check first day of the week
    const firstDay = week[0]?.date;
    if (firstDay) {
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          name: MONTH_NAMES[month],
          weekIndex: weekIdx
        });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="github-heatmap-card">
      <div className="heatmap-header">
        <div className="heatmap-title-group">
          <div className="heatmap-badge">
            <span className="live-dot"></span>
            GitHub-Style Activity Matrix
          </div>
          <h3 className="heatmap-title">Daily Habit Consistency Heatmap</h3>
          <p className="heatmap-subtitle">
            Visualizing your daily habit completion streak and intensity over the last 6 months.
          </p>
        </div>

        <div className="heatmap-controls">
          <label htmlFor="heatmap-habit-filter" className="filter-label">Filter View:</label>
          <select
            id="heatmap-habit-filter"
            className="habit-select-input"
            value={filterId}
            onChange={handleHabitFilterChange}
          >
            <option value="all">All Habits Combined</option>
            {habits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.title} ({habit.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="heatmap-scroll-wrapper">
        <div className="heatmap-grid-container">
          {/* Month labels row */}
          <div className="heatmap-months-row">
            <div className="day-label-placeholder"></div>
            <div className="months-track">
              {weeks.map((week, idx) => {
                const labelObj = monthLabels.find((m) => m.weekIndex === idx);
                return (
                  <div key={idx} className="month-col-slot">
                    {labelObj ? <span className="month-label">{labelObj.name}</span> : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matrix body: day labels + weeks columns */}
          <div className="heatmap-matrix-body">
            {/* Days of week labels */}
            <div className="heatmap-day-labels">
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>

            {/* Columns of weeks */}
            <div className="heatmap-weeks">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="heatmap-week-column">
                  {week.map((day) => {
                    const levelClass = day.isFuture
                      ? 'level-future'
                      : `level-${day.level}`;
                    const isTodayClass = day.isToday ? 'cell-today' : '';

                    return (
                      <button
                        key={day.dateStr}
                        type="button"
                        className={`heatmap-cell ${levelClass} ${isTodayClass}`}
                        disabled={day.isFuture}
                        onClick={() => onSelectDate && onSelectDate(day.dateStr)}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseLeave={handleMouseLeave}
                        aria-label={`${day.count} habits on ${day.dateStr}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend & Summary Footer */}
      <div className="heatmap-footer">
        <div className="heatmap-hint">
          <Info size={14} />
          <span>Click any square to inspect and log habits for that date</span>
        </div>

        <div className="heatmap-legend">
          <span className="legend-text">Less</span>
          <span className="legend-cell level-0" title="0 habits completed"></span>
          <span className="legend-cell level-1" title="1 habit completed"></span>
          <span className="legend-cell level-2" title="2 habits completed"></span>
          <span className="legend-cell level-3" title="3 habits completed"></span>
          <span className="legend-cell level-4" title="4+ habits completed"></span>
          <span className="legend-text">More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <div
          className="heatmap-tooltip"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
          }}
        >
          <div className="tooltip-header">
            <strong>{formatDisplayDate(hoveredDay.dateStr)}</strong>
            {hoveredDay.isToday && <span className="tooltip-today-pill">Today</span>}
          </div>
          <div className="tooltip-count">
            {hoveredDay.count === 0 ? (
              <span className="text-muted">No habits logged on this day</span>
            ) : (
              <span>
                <strong>{hoveredDay.count}</strong> {hoveredDay.count === 1 ? 'habit' : 'habits'} completed
              </span>
            )}
          </div>
          {hoveredDay.habitTitles && hoveredDay.habitTitles.length > 0 && (
            <ul className="tooltip-habit-list">
              {hoveredDay.habitTitles.map((title, i) => (
                <li key={i}>
                  <CheckCircle2 size={11} className="tooltip-check-icon" />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
