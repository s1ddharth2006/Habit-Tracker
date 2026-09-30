import React from 'react';
import { Droplets, Plus, Minus, Check, RefreshCw } from 'lucide-react';

export default function WaterIntakeWidget({ habit, currentValue = 0, onUpdateValue, isCompleted }) {
  if (!habit) return null;

  const targetGlasses = habit.target || 8;
  const currentGlasses = currentValue || 0;
  const mlPerGlass = 250;
  const currentMl = currentGlasses * mlPerGlass;
  const targetMl = targetGlasses * mlPerGlass;
  const percent = Math.min(100, Math.round((currentGlasses / targetGlasses) * 100));

  const handleGlassClick = (index) => {
    // If clicked on glass 3 (index 2) and current is 3, toggle to 2, else set to index + 1
    if (currentGlasses === index + 1) {
      onUpdateValue(habit.id, index);
    } else {
      onUpdateValue(habit.id, index + 1);
    }
  };

  const handleAddOne = () => {
    onUpdateValue(habit.id, Math.min(targetGlasses * 2, currentGlasses + 1));
  };

  const handleSubOne = () => {
    onUpdateValue(habit.id, Math.max(0, currentGlasses - 1));
  };

  const handleReset = () => {
    onUpdateValue(habit.id, 0);
  };

  return (
    <div className="water-widget-card">
      <div className="water-widget-header">
        <div className="water-title-wrap">
          <div className="water-icon-circle">
            <Droplets size={22} className="water-droplet-icon" />
          </div>
          <div>
            <div className="water-badge">Dedicated Hydration Tracker</div>
            <h4 className="water-title">Daily Water Intake</h4>
          </div>
        </div>
        <div className="water-stats-pill">
          <span className="water-ml-text">{currentMl} ml</span>
          <span className="water-target-sub">/ {targetMl} ml goal</span>
        </div>
      </div>

      {/* Visual Glasses Row */}
      <div className="water-glasses-row">
        {Array.from({ length: targetGlasses }).map((_, index) => {
          const isFilled = index < currentGlasses;
          return (
            <button
              key={index}
              type="button"
              className={`water-glass-btn ${isFilled ? 'filled' : ''}`}
              onClick={() => handleGlassClick(index)}
              title={`Glass ${index + 1} (${(index + 1) * mlPerGlass}ml) - Click to toggle`}
              aria-label={`Water glass ${index + 1}`}
            >
              <div className="glass-container">
                <div
                  className="glass-water-level"
                  style={{ height: isFilled ? '100%' : '0%' }}
                ></div>
                <div className="glass-icon-overlay">
                  {isFilled ? <Check size={14} strokeWidth={3} /> : <span className="glass-num">{index + 1}</span>}
                </div>
              </div>
              <span className="glass-label">250ml</span>
            </button>
          );
        })}
      </div>

      {/* Progress & Quick Controls */}
      <div className="water-controls-bar">
        <div className="water-progress-info">
          <span className="water-progress-label">
            {currentGlasses >= targetGlasses ? '🎉 Daily Hydration Goal Reached!' : `${targetGlasses - currentGlasses} glasses remaining today`}
          </span>
          <div className="water-progress-rail">
            <div className="water-progress-stream" style={{ width: `${percent}%` }}></div>
          </div>
        </div>

        <div className="water-action-buttons">
          <button
            type="button"
            className="water-action-btn"
            onClick={handleSubOne}
            disabled={currentGlasses <= 0}
            title="Minus 1 Glass"
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            className="water-action-btn primary"
            onClick={handleAddOne}
            title="Add 1 Glass (250ml)"
          >
            <Plus size={15} />
            <span>+1 Glass</span>
          </button>
          {currentGlasses > 0 && (
            <button
              type="button"
              className="water-action-btn reset"
              onClick={handleReset}
              title="Reset Water Counter"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
