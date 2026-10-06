'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui';
import TVMonitorModal from './TVMonitorModal';

export type AppHeaderVariant = 'default' | 'tv-button';

export interface AppHeaderProps {
  className?: string;
  defaultDept?: string;
  defaultLine?: string;
  variant?: AppHeaderVariant;
}

const DEPARTMENTS = [
  { id: 'CAN', name: 'Canning' },
  { id: 'BTL', name: 'Bottling' },
  { id: 'SNK', name: 'Snacks' },
  { id: 'PKG', name: 'Packaging' },
];

const LINES: Record<string, string[]> = {
  CAN: ['G4', 'Line A', 'Line B', 'Line C'],
  BTL: ['B1', 'B2', 'B3'],
  SNK: ['S1', 'S2', 'S3'],
  PKG: ['P1', 'P2'],
};

export default function AppHeader({
  className = '',
  defaultDept = 'CAN',
  defaultLine = 'G4',
  variant = 'tv-button',
}: AppHeaderProps) {
  const pathname = usePathname();
  const isTv = pathname?.startsWith('/tv');
  const isTvLine = pathname?.startsWith('/tv/line');

  if (isTv) {
    return null;
  }
  // State
  const [dept, setDept] = useState(defaultDept);
  const [line, setLine] = useState(defaultLine);
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);
  const [lineMenuOpen, setLineMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tvModalOpen, setTvModalOpen] = useState(false);

  // Time & Shift state
  const [currentTime, setCurrentTime] = useState('10:50');
  const [currentShift, setCurrentShift] = useState('Shift 1');

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(4);

  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Refs for outside click closing
  const deptRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);

      // Determine shift: Shift 1 (06:00-14:00), Shift 2 (14:00-22:00), Shift 3 (22:00-06:00)
      const h = now.getHours();
      if (h >= 6 && h < 14) setCurrentShift('Shift 1');
      else if (h >= 14 && h < 22) setCurrentShift('Shift 2');
      else setCurrentShift('Shift 3');
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Theme synchronization
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    setIsDark(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setDeptMenuOpen(false);
      }
      if (lineRef.current && !lineRef.current.contains(e.target as Node)) {
        setLineMenuOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setElapsedMinutes(0);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Available lines for current department
  const availableLines = LINES[dept] || ['G4', 'Line A', 'Line B'];

  return (
    <header className={`sfp-app-header ${className}`.trim()}>
      {/* ================= LEFT SECTION ================= */}
      <div className="sfp-header-left">
        {/* SFP Logo */}
        <Link href="/dashboard" className="sfp-logo-container" title="SFP Dashboard">
          <Image
            src="/sfp-logo.png"
            alt="SFP"
            width={86}
            height={25}
            priority
            className="sfp-logo-image"
          />
        </Link>

        {/* Segmented Button Group: Dept & Line selector */}
        <div className="sfp-segmented-group" id="header-dept-line-group">
          {/* Department segment */}
          <div className="sfp-segment-item" ref={deptRef}>
            <button
              type="button"
              className="sfp-segment-button"
              onClick={() => {
                setDeptMenuOpen(!deptMenuOpen);
                setLineMenuOpen(false);
              }}
              aria-expanded={deptMenuOpen}
              id="header-dept-trigger"
            >
              <span className="sfp-segment-label">Dept.</span>
              <span className="sfp-segment-val">{dept}</span>
              <Icon name="keyboard_arrow_down" size="medium" className="sfp-dropdown-caret" />
            </button>

            {deptMenuOpen && (
              <div className="sfp-dropdown-menu" role="menu">
                <div className="sfp-dropdown-header">Select Department</div>
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`sfp-dropdown-option ${d.id === dept ? 'active' : ''}`}
                    onClick={() => {
                      setDept(d.id);
                      setLine((LINES[d.id] && LINES[d.id][0]) || 'Line 1');
                      setDeptMenuOpen(false);
                    }}
                  >
                    <span className="sfp-opt-code">{d.id}</span>
                    <span className="sfp-opt-name">{d.name}</span>
                    {d.id === dept && <Icon name="check" size="small" className="sfp-opt-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Segment Divider */}
          <div className="sfp-segment-divider" />

          {/* Line segment */}
          <div className="sfp-segment-item" ref={lineRef}>
            <button
              type="button"
              className="sfp-segment-button"
              onClick={() => {
                setLineMenuOpen(!lineMenuOpen);
                setDeptMenuOpen(false);
              }}
              aria-expanded={lineMenuOpen}
              id="header-line-trigger"
            >
              <span className="sfp-segment-label">Line</span>
              <span className="sfp-segment-val">{line}</span>
              <Icon name="keyboard_arrow_down" size="medium" className="sfp-dropdown-caret" />
            </button>

            {lineMenuOpen && (
              <div className="sfp-dropdown-menu" role="menu">
                <div className="sfp-dropdown-header">Select Line ({dept})</div>
                {availableLines.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`sfp-dropdown-option ${l === line ? 'active' : ''}`}
                    onClick={() => {
                      setLine(l);
                      setLineMenuOpen(false);
                    }}
                  >
                    <span className="sfp-opt-code">{l}</span>
                    {l === line && <Icon name="check" size="small" className="sfp-opt-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Refresh button & Elapsed label */}
        <div className="sfp-refresh-container">
          <button
            type="button"
            className="sfp-refresh-button"
            onClick={handleRefresh}
            id="header-refresh-btn"
            title="Refresh dashboard data"
            aria-label="Refresh data"
          >
            <Icon
              name="refresh"
              size="medium"
              className={`sfp-refresh-icon ${isRefreshing ? 'spinning' : ''}`}
            />
          </button>
          <span className="sfp-refresh-label">
            {elapsedMinutes === 0 ? 'Refreshed just now' : `Refreshed ${elapsedMinutes} min ago`}
          </span>
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="sfp-header-right">
        {/* Create button */}
        <div className="sfp-create-container" ref={createRef}>
          <button
            type="button"
            className="sfp-create-button"
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
            id="header-create-btn"
            aria-expanded={createMenuOpen}
          >
            <Icon name="add" size="medium" className="sfp-create-add-icon" />
            <span className="sfp-create-text">Create</span>
            <Icon name="keyboard_arrow_down" size="medium" className="sfp-dropdown-caret" />
          </button>

          {createMenuOpen && (
            <div className="sfp-dropdown-menu sfp-dropdown-right" role="menu">
              <div className="sfp-dropdown-header">Operator Actions</div>
              <button
                type="button"
                className="sfp-dropdown-option"
                onClick={() => setCreateMenuOpen(false)}
              >
                <Icon name="error_outline" size="small" style={{ color: 'var(--color-feedback-error-default)' }} />
                <span>Log Downtime Event</span>
              </button>
              <button
                type="button"
                className="sfp-dropdown-option"
                onClick={() => setCreateMenuOpen(false)}
              >
                <Icon name="delete_outline" size="small" style={{ color: 'var(--color-feedback-warning-default)' }} />
                <span>Record Scrap / Waste</span>
              </button>
              <button
                type="button"
                className="sfp-dropdown-option"
                onClick={() => setCreateMenuOpen(false)}
              >
                <Icon name="build" size="small" style={{ color: 'var(--color-interaction-primary)' }} />
                <span>Maintenance Request</span>
              </button>
              <button
                type="button"
                className="sfp-dropdown-option"
                onClick={() => setCreateMenuOpen(false)}
              >
                <Icon name="calendar_today" size="small" style={{ color: 'var(--color-feedback-info-default)' }} />
                <span>Schedule Changeover</span>
              </button>
            </div>
          )}
        </div>

        {/* TV Mode / Screen Share Icon Button (Variant: tv-button, Figma 29118:603923 & Modal 29193:14821) */}
        {variant === 'tv-button' && (
          <>
            <button
              type="button"
              onClick={() => setTvModalOpen(true)}
              className={`sfp-header-tv-btn ${isTv ? 'active' : ''}`}
              id="header-tv-btn"
              data-testid="header-tb-btn"
              title="TV Monitor"
              aria-label="TV Monitor"
            >
              <Icon name="screen_share" size="medium" />
            </button>
            {/* Alias button supporting #header-tb-btn */}
            <button
              type="button"
              id="header-tb-btn"
              onClick={() => setTvModalOpen(true)}
              style={{ display: 'none' }}
              aria-hidden="true"
              tabIndex={-1}
            />
          </>
        )}

        {/* Vertical Divider */}
        <div className="sfp-header-vdivider" />

        {/* Time & Shift */}
        <div className="sfp-time-shift-display" id="header-time-shift">
          <span className="sfp-current-time">{currentTime}</span>
          <span className="sfp-current-shift">{currentShift}</span>
        </div>

        {/* Vertical Divider */}
        <div className="sfp-header-vdivider" />

        {/* Help icon button */}
        <button
          type="button"
          className="sfp-header-icon-btn"
          title="Operator Documentation & Help"
          aria-label="Help"
          id="header-help-btn"
        >
          <Icon name="help_outline" size="medium" />
        </button>

        {/* User Profile dropdown */}
        <div className="sfp-user-container" ref={userRef}>
          <button
            type="button"
            className="sfp-user-button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            id="header-user-btn"
            aria-expanded={userMenuOpen}
          >
            <span className="sfp-user-name">Chris G.</span>
            <div className="sfp-user-avatar">
              <Icon name="person" size="medium" className="sfp-user-avatar-icon" />
            </div>
            <Icon name="arrow_drop_down" size="medium" className="sfp-dropdown-caret" />
          </button>

          {userMenuOpen && (
            <div className="sfp-dropdown-menu sfp-dropdown-right" role="menu">
              <div className="sfp-user-card-preview">
                <div className="sfp-user-avatar-large">
                  <Icon name="person" size="large" />
                </div>
                <div>
                  <p className="sfp-user-card-name">Chris G.</p>
                  <p className="sfp-user-card-role">Line Operator · Station 04</p>
                </div>
              </div>
              <div className="sfp-dropdown-divider" />
              <button
                type="button"
                className="sfp-dropdown-option"
                onClick={toggleTheme}
                id="header-theme-toggle-option"
              >
                <Icon name={isDark ? 'light_mode' : 'dark_mode'} size="small" />
                <span>Switch to {isDark ? 'Light Peacock' : 'Dark Peacock'}</span>
              </button>
              <button
                type="button"
                className="sfp-dropdown-option"
                onClick={() => setUserMenuOpen(false)}
              >
                <Icon name="tune" size="small" />
                <span>Line Station Settings</span>
              </button>
              <div className="sfp-dropdown-divider" />
              <button
                type="button"
                className="sfp-dropdown-option sfp-danger-opt"
                onClick={() => setUserMenuOpen(false)}
              >
                <Icon name="logout" size="small" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TV Monitor Selection Modal (Figma node 29193:14821) */}
      <TVMonitorModal
        isOpen={tvModalOpen}
        onClose={() => setTvModalOpen(false)}
      />
    </header>
  );
}
