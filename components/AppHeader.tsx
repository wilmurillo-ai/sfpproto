'use client';

import { lines, shifts, currentLine, currentShift, currentTime, lastRefreshed } from '@/lib/dummyData';
import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui';

interface AppHeaderProps {
  pageTitle: string;
}

export default function AppHeader({ pageTitle }: AppHeaderProps) {
  const [line, setLine] = useState(currentLine);
  const [shift, setShift] = useState(currentShift);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        {/* Refresh label */}
        <span className="header-meta">Refreshed {lastRefreshed}</span>

        {/* Line selector */}
        <select
          id="header-line-select"
          className="header-select"
          value={line}
          onChange={(e) => setLine(e.target.value)}
          aria-label="Select line"
        >
          {lines.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Shift selector */}
        <select
          id="header-shift-select"
          className="header-select"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          aria-label="Select shift"
        >
          {shifts.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Time badge */}
        <div className="header-time-badge">
          <Icon name="schedule" size="small" style={{ color: 'var(--color-text-secondary)', marginRight: '4px' }} />
          <span className="time-value">{currentTime}</span>
        </div>

        {/* Theme toggle */}
        <button
          className="header-icon-btn"
          id="header-theme-toggle"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          <Icon name={isDark ? 'light_mode' : 'dark_mode'} size="medium" />
        </button>

        {/* Refresh icon */}
        <button className="header-icon-btn" id="header-refresh-btn" aria-label="Refresh data" title="Refresh">
          <Icon name="refresh" size="medium" />
        </button>

        {/* Avatar */}
        <div className="header-avatar" id="header-user-avatar" title="Operator">OP</div>
      </div>
    </header>
  );
}
