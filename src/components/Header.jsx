import React from 'react';
import { Plus } from 'lucide-react';

export default function Header({
  activeTab,
  onTabChange,
  onOpenNewHabit,
  completedCount,
  totalCount
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-group">
          <h1 className="brand-title">Habits</h1>
          {totalCount > 0 && (
            <span className="brand-count">
              {completedCount}/{totalCount} today
            </span>
          )}
        </div>

        <nav className="nav-tabs">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => onTabChange('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'week' ? 'active' : ''}`}
            onClick={() => onTabChange('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => onTabChange('manage')}
          >
            Manage
          </button>
        </nav>

        <button
          type="button"
          className="btn-add-header"
          onClick={onOpenNewHabit}
        >
          <Plus size={15} />
          <span>New habit</span>
        </button>
      </div>
    </header>
  );
}
