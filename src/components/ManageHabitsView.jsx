import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ManageHabitsView({
  habits,
  streaks,
  onOpenNewHabit,
  onEditHabit,
  onDeleteHabit
}) {
  return (
    <div className="view-container">
      <div className="view-header-simple flex-between">
        <div>
          <h2 className="view-title-simple">Manage habits</h2>
          <p className="view-desc-simple">
            Configure your routines, targets, and tracking metrics.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenNewHabit}
        >
          <Plus size={15} />
          <span>Add habit</span>
        </button>
      </div>

      <div className="manage-list">
        {habits.map((habit) => {
          const streak = streaks[habit.id] || 0;

          return (
            <div key={habit.id} className="manage-row">
              <div className="manage-info">
                <div className="manage-title-group">
                  <span className="manage-title">{habit.title}</span>
                  <span className="manage-badge">{habit.category}</span>
                </div>
                <div className="manage-meta">
                  Goal: {habit.target} {habit.unit} / day • Streak: {streak} days
                </div>
              </div>

              <div className="manage-actions">
                <button
                  type="button"
                  className="btn-action-text"
                  onClick={() => onEditHabit(habit)}
                  title="Edit habit"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="btn-action-text danger"
                  onClick={() => onDeleteHabit(habit)}
                  title="Delete habit"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
