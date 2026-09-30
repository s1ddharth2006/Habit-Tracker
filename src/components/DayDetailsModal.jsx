import React from 'react';
import { X, Calendar, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { formatDisplayDate } from '../utils/streakUtils';

export default function DayDetailsModal({
  isOpen,
  onClose,
  selectedDate,
  habits,
  logs,
  onToggleHabitForDate
}) {
  if (!isOpen || !selectedDate) return null;

  const dayLogs = (logs && logs[selectedDate]) || {};
  const completedHabits = habits.filter((h) => dayLogs[h.id] && dayLogs[h.id].completed);
  const pendingHabits = habits.filter((h) => !dayLogs[h.id] || !dayLogs[h.id].completed);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card day-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="day-modal-title-wrap">
            <div className="day-calendar-icon">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="modal-title">{formatDisplayDate(selectedDate)}</h3>
              <p className="modal-subtitle">
                {completedHabits.length} of {habits.length} habits completed on this date
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="day-modal-body">
          <div className="day-habits-section">
            <h4 className="section-label">Habits Logged For This Date</h4>
            <div className="day-habits-list">
              {habits.map((habit) => {
                const isDone = dayLogs[habit.id] && dayLogs[habit.id].completed;
                const value = dayLogs[habit.id] ? dayLogs[habit.id].value : 0;

                return (
                  <div
                    key={habit.id}
                    className={`day-habit-item ${isDone ? 'done' : ''}`}
                    onClick={() => onToggleHabitForDate(selectedDate, habit.id)}
                  >
                    <div className="day-habit-left">
                      <span
                        className="day-habit-color-indicator"
                        style={{ backgroundColor: habit.color }}
                      ></span>
                      <div>
                        <div className="day-habit-name">{habit.title}</div>
                        <div className="day-habit-meta">
                          Target: {habit.target} {habit.unit} {value > 0 ? `(logged: ${value})` : ''}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`day-habit-checkbox ${isDone ? 'checked' : ''}`}
                      aria-label={`Toggle ${habit.title}`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} className="check-done" />
                      ) : (
                        <Circle size={20} className="check-circle" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-actions-row">
          <button type="button" className="btn-submit-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
