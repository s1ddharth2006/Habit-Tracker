import React from 'react';
import { getPastDates, formatShortDay } from '../utils/habitStorage';
import { Check } from 'lucide-react';

export default function WeeklyView({ habits, logs, onToggleHabitForDate }) {
  const dates = getPastDates(7);

  return (
    <div className="view-container">
      <div className="view-header-simple">
        <h2 className="view-title-simple">7-day overview</h2>
        <p className="view-desc-simple">
          Click any day to mark completion or update past consistency.
        </p>
      </div>

      <div className="table-wrapper">
        <table className="weekly-table">
          <thead>
            <tr>
              <th className="th-habit">Habit</th>
              {dates.map((dateStr, idx) => {
                const isToday = idx === dates.length - 1;
                const [y, m, d] = dateStr.split('-').map(Number);
                const dayObj = new Date(y, m - 1, d);
                const dayNum = dayObj.getDate();
                const dayName = formatShortDay(dateStr);

                return (
                  <th
                    key={dateStr}
                    className={`th-day ${isToday ? 'is-today' : ''}`}
                  >
                    <span className="th-dayname">{dayName}</span>
                    <span className="th-daynum">{dayNum}</span>
                  </th>
                );
              })}
              <th className="th-rate">Consistency</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              let doneInWeek = 0;

              return (
                <tr key={habit.id} className="tr-habit">
                  <td className="td-habit-info">
                    <span className="tbl-habit-title">{habit.title}</span>
                    <span className="tbl-habit-goal">
                      {habit.target} {habit.unit}
                    </span>
                  </td>

                  {dates.map((dateStr) => {
                    const isDone =
                      logs[dateStr] &&
                      logs[dateStr][habit.id] &&
                      logs[dateStr][habit.id].completed;
                    if (isDone) doneInWeek++;

                    return (
                      <td key={dateStr} className="td-day-cell">
                        <button
                          type="button"
                          className={`grid-dot-btn ${isDone ? 'done' : ''}`}
                          onClick={() => onToggleHabitForDate(dateStr, habit.id)}
                          aria-label={`Toggle ${habit.title} on ${dateStr}`}
                        >
                          {isDone ? <Check size={12} strokeWidth={3} /> : null}
                        </button>
                      </td>
                    );
                  })}

                  <td className="td-rate-cell">
                    <span className="rate-text">
                      {doneInWeek}/7 ({Math.round((doneInWeek / 7) * 100)}%)
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
