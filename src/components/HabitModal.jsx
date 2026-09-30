import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Dumbbell,
  Droplets,
  Sparkles,
  Code2,
  Heart,
  Moon,
  Smile,
  AlertCircle,
  Check
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'BookOpen', label: 'Reading / Book', icon: BookOpen },
  { name: 'Dumbbell', label: 'Fitness / Workout', icon: Dumbbell },
  { name: 'Droplets', label: 'Water / Hydration', icon: Droplets },
  { name: 'Sparkles', label: 'Meditation / Calm', icon: Sparkles },
  { name: 'Code2', label: 'Coding / Study', icon: Code2 },
  { name: 'Heart', label: 'Health / Wellness', icon: Heart },
  { name: 'Moon', label: 'Sleep / Rest', icon: Moon },
  { name: 'Smile', label: 'Mindset / Gratitude', icon: Smile }
];

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald Green
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ef4444', // Red / Coral
  '#f59e0b', // Amber / Orange
  '#ec4899', // Pink
  '#14b8a6'  // Teal
];

const CATEGORY_OPTIONS = [
  { value: 'reading', label: 'Reading' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'water', label: 'Water Intake' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'wellness', label: 'Health & Wellness' },
  { value: 'custom', label: 'Custom' }
];

export default function HabitModal({ isOpen, onClose, onSave, existingHabit = null, allHabits = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'reading',
    target: 20,
    unit: 'pages',
    timeOfDay: 'anytime',
    color: '#3b82f6',
    icon: 'BookOpen'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (existingHabit) {
      setFormData({
        title: existingHabit.title || '',
        description: existingHabit.description || '',
        category: existingHabit.category || 'reading',
        target: existingHabit.target || 1,
        unit: existingHabit.unit || 'times',
        timeOfDay: existingHabit.timeOfDay || 'anytime',
        color: existingHabit.color || '#3b82f6',
        icon: existingHabit.icon || 'BookOpen'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'reading',
        target: 20,
        unit: 'pages',
        timeOfDay: 'anytime',
        color: '#3b82f6',
        icon: 'BookOpen'
      });
    }
    setErrors({});
    setTouched({});
  }, [existingHabit, isOpen]);

  if (!isOpen) return null;

  // Client-side validation function
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        if (!value || !value.trim()) {
          error = 'Habit title is required.';
        } else if (value.trim().length < 3) {
          error = 'Title must be at least 3 characters long.';
        } else if (value.trim().length > 60) {
          error = 'Title cannot exceed 60 characters.';
        } else {
          // Check for duplicate title
          const duplicate = allHabits.some(
            (h) =>
              h.title.toLowerCase().trim() === value.toLowerCase().trim() &&
              (!existingHabit || h.id !== existingHabit.id)
          );
          if (duplicate) {
            error = 'A habit with this name already exists.';
          }
        }
        break;

      case 'target':
        const num = Number(value);
        if (value === '' || isNaN(num)) {
          error = 'Target must be a valid number.';
        } else if (num <= 0) {
          error = 'Target must be greater than 0.';
        } else if (num > 1000) {
          error = 'Target cannot exceed 1000.';
        }
        break;

      case 'unit':
        if (!value || !value.trim()) {
          error = 'Unit of measurement is required (e.g., pages, mins, glasses).';
        } else if (value.trim().length > 20) {
          error = 'Unit must be less than 20 characters.';
        }
        break;

      case 'category':
        if (!value) {
          error = 'Please select a habit category.';
        }
        break;

      default:
        break;
    }
    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    const titleErr = validateField('title', formData.title);
    if (titleErr) newErrors.title = titleErr;

    const targetErr = validateField('target', formData.target);
    if (targetErr) newErrors.target = targetErr;

    const unitErr = validateField('unit', formData.unit);
    if (unitErr) newErrors.unit = unitErr;

    const catErr = validateField('category', formData.category);
    if (catErr) newErrors.category = catErr;

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'target' ? (value === '' ? '' : Number(value)) : value
    }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateAll();
    setTouched({
      title: true,
      category: true,
      target: true,
      unit: true
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      unit: formData.unit.trim().toLowerCase(),
      target: Number(formData.target)
    });
  };

  // Preset suggestions based on category selection
  const handleCategorySelect = (categoryValue) => {
    let suggestedUnit = formData.unit;
    let suggestedTarget = formData.target;
    let suggestedIcon = formData.icon;
    let suggestedColor = formData.color;

    if (categoryValue === 'reading') {
      suggestedUnit = 'pages';
      suggestedTarget = 20;
      suggestedIcon = 'BookOpen';
      suggestedColor = '#3b82f6';
    } else if (categoryValue === 'exercise') {
      suggestedUnit = 'mins';
      suggestedTarget = 30;
      suggestedIcon = 'Dumbbell';
      suggestedColor = '#ef4444';
    } else if (categoryValue === 'water') {
      suggestedUnit = 'glasses';
      suggestedTarget = 8;
      suggestedIcon = 'Droplets';
      suggestedColor = '#06b6d4';
    } else if (categoryValue === 'meditation') {
      suggestedUnit = 'mins';
      suggestedTarget = 15;
      suggestedIcon = 'Sparkles';
      suggestedColor = '#8b5cf6';
    } else if (categoryValue === 'productivity') {
      suggestedUnit = 'mins';
      suggestedTarget = 45;
      suggestedIcon = 'Code2';
      suggestedColor = '#10b981';
    }

    setFormData((prev) => ({
      ...prev,
      category: categoryValue,
      unit: suggestedUnit,
      target: suggestedTarget,
      icon: suggestedIcon,
      color: suggestedColor
    }));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card habit-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {existingHabit ? 'Edit Habit Details' : 'Create New Daily Habit'}
            </h3>
            <p className="modal-subtitle">
              {existingHabit
                ? 'Update parameters, targets, or category for this habit.'
                : 'Define a routine, target goal, and tracking frequency.'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form with Client-Side Validation */}
        <form onSubmit={handleSubmit} noValidate className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-title-input">
              Habit Name <span className="required-star">*</span>
            </label>
            <input
              id="habit-title-input"
              type="text"
              name="title"
              className={`form-input ${errors.title && touched.title ? 'input-error' : ''}`}
              placeholder="e.g. Read 20 pages, 30-min Cardio, Drink 8 Glasses"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={60}
            />
            {errors.title && touched.title && (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-category-select">
              Category <span className="required-star">*</span>
            </label>
            <div className="category-chips-grid">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`category-chip-btn ${formData.category === cat.value ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {errors.category && touched.category && (
              <div className="form-error-msg">
                <AlertCircle size={14} />
                <span>{errors.category}</span>
              </div>
            )}
          </div>

          {/* Target & Unit in 2 columns */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label" htmlFor="habit-target-input">
                Daily Target Goal <span className="required-star">*</span>
              </label>
              <input
                id="habit-target-input"
                type="number"
                name="target"
                className={`form-input ${errors.target && touched.target ? 'input-error' : ''}`}
                placeholder="e.g. 20"
                min="1"
                max="1000"
                value={formData.target}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.target && touched.target && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.target}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="habit-unit-input">
                Unit of Measure <span className="required-star">*</span>
              </label>
              <input
                id="habit-unit-input"
                type="text"
                name="unit"
                className={`form-input ${errors.unit && touched.unit ? 'input-error' : ''}`}
                placeholder="e.g. pages, mins, glasses, km"
                value={formData.unit}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.unit && touched.unit && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.unit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-desc-input">
              Description / Motivation (Optional)
            </label>
            <textarea
              id="habit-desc-input"
              name="description"
              className="form-textarea"
              rows={2}
              placeholder="Why is this habit important to you? What is your routine?"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Time of Day */}
          <div className="form-group">
            <label className="form-label">Preferred Time of Day</label>
            <div className="time-chips-group">
              {['morning', 'afternoon', 'evening', 'anytime'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`time-chip-btn ${formData.timeOfDay === t ? 'active' : ''}`}
                  onClick={() => setFormData((p) => ({ ...p, timeOfDay: t }))}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Color & Icon Visual Picker */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Theme Color Accent</label>
              <div className="color-swatches-row">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-swatch-btn ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((p) => ({ ...p, color }))}
                    aria-label={`Select color ${color}`}
                  >
                    {formData.color === color && <Check size={14} color="#ffffff" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Choose Icon</label>
              <div className="icon-selector-grid">
                {AVAILABLE_ICONS.map((item) => {
                  const IconCmp = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      className={`icon-choice-btn ${formData.icon === item.name ? 'selected' : ''}`}
                      onClick={() => setFormData((p) => ({ ...p, icon: item.name }))}
                      title={item.label}
                    >
                      <IconCmp size={18} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-row">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit-primary">
              {existingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
