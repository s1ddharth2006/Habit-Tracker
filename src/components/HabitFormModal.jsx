import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Mind', 'General'];

export default function HabitFormModal({
  isOpen,
  onClose,
  onSave,
  initialHabit = null,
  existingHabits = []
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState('times');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialHabit) {
      setTitle(initialHabit.title || '');
      setCategory(initialHabit.category || 'General');
      setTarget(initialHabit.target || 1);
      setUnit(initialHabit.unit || 'times');
    } else {
      setTitle('');
      setCategory('General');
      setTarget(1);
      setUnit('times');
    }
    setErrors({});
  }, [initialHabit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      errs.title = 'Habit title is required';
    } else if (trimmedTitle.length < 2) {
      errs.title = 'Title must be at least 2 characters';
    } else if (trimmedTitle.length > 50) {
      errs.title = 'Title is too long (max 50)';
    } else {
      const isDuplicate = existingHabits.some(
        (h) =>
          h.title.toLowerCase().trim() === trimmedTitle.toLowerCase() &&
          (!initialHabit || h.id !== initialHabit.id)
      );
      if (isDuplicate) {
        errs.title = 'A habit with this name already exists';
      }
    }

    const numTarget = Number(target);
    if (!target || isNaN(numTarget) || numTarget <= 0) {
      errs.target = 'Target must be greater than 0';
    }

    if (!unit.trim()) {
      errs.unit = 'Unit is required (e.g. mins, pages, glasses)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      title: title.trim(),
      category,
      target: Number(target),
      unit: unit.trim().toLowerCase()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <h2 className="modal-heading">
            {initialHabit ? 'Edit habit' : 'New habit'}
          </h2>
          <button
            type="button"
            className="btn-icon-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="field-group">
            <label className="field-label" htmlFor="habit-title">
              Habit name
            </label>
            <input
              id="habit-title"
              type="text"
              className={`field-input ${errors.title ? 'has-error' : ''}`}
              placeholder="e.g. Reading, Exercise, Drink water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="field-label" htmlFor="habit-target">
                Daily target
              </label>
              <input
                id="habit-target"
                type="number"
                min="1"
                className={`field-input ${errors.target ? 'has-error' : ''}`}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              {errors.target && (
                <span className="field-error">{errors.target}</span>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="habit-unit">
                Unit
              </label>
              <input
                id="habit-unit"
                type="text"
                className={`field-input ${errors.unit ? 'has-error' : ''}`}
                placeholder="pages, mins, glasses"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              {errors.unit && <span className="field-error">{errors.unit}</span>}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Category</label>
            <div className="category-options">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-tag ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-bottom">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialHabit ? 'Save changes' : 'Add habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
