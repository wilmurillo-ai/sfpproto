'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Icon } from '@/components/ui';

export type CIPDatePreset = '1D' | '3D' | '7D' | '30D' | 'Custom';

export interface CIPDateRangeValue {
  preset: CIPDatePreset;
  startDate: Date;
  endDate: Date;
  label: string;
}

interface CIPDateRangeProps {
  value: CIPDateRangeValue;
  onChange: (val: CIPDateRangeValue) => void;
}

const PRESETS: CIPDatePreset[] = ['1D', '3D', '7D', '30D', 'Custom'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function padZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatShortDate(d: Date): string {
  return `${MONTH_NAMES_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function formatShortDateTime(d: Date, time: string): string {
  return `${MONTH_NAMES_SHORT[d.getMonth()]} ${d.getDate()}, ${time}`;
}

function getPresetRange(preset: Exclude<CIPDatePreset, 'Custom'>): { startDate: Date; endDate: Date; label: string } {
  const today = new Date(2026, 8, 18); // Sept 18, 2026
  const map: Record<Exclude<CIPDatePreset, 'Custom'>, number> = { '1D': 0, '3D': 2, '7D': 6, '30D': 29 };
  const days = map[preset];
  const start = addDays(today, -days);
  return {
    startDate: start,
    endDate: today,
    label: preset === '1D' ? 'Today' : `Last ${preset}`,
  };
}

export default function CIPDateRange({ value, onChange }: CIPDateRangeProps) {
  const [customOpen, setCustomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'start' | 'end'>('start');

  // Today reference (Sept 18, 2026 in prototype)
  const defaultToday = useMemo(() => new Date(2026, 8, 18), []);

  // Calendar month/year navigation state
  const [calYear, setCalYear] = useState<number>(2026);
  const [calMonth, setCalMonth] = useState<number>(8); // September (0-indexed)

  // Temporary selection state for Custom popover
  const [draftStart, setDraftStart] = useState<Date | null>(value.startDate || defaultToday);
  const [draftEnd, setDraftEnd] = useState<Date | null>(value.endDate || defaultToday);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  const panelRef = useRef<HTMLDivElement>(null);

  // Sync draft state with controlled value when opened
  useEffect(() => {
    if (customOpen) {
      setDraftStart(value.startDate || defaultToday);
      setDraftEnd(value.endDate || defaultToday);
      setCalYear((value.startDate || defaultToday).getFullYear());
      setCalMonth((value.startDate || defaultToday).getMonth());
      setActiveTab('start');
    }
  }, [customOpen, value.startDate, value.endDate, defaultToday]);

  // Outside click listener
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setCustomOpen(false);
      }
    };

    if (customOpen) {
      document.addEventListener('mousedown', handleMouseDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [customOpen]);

  // Handle clicking preset pill
  const handlePreset = (preset: CIPDatePreset) => {
    if (preset === 'Custom') {
      setCustomOpen((prev) => !prev);
    } else {
      setCustomOpen(false);
      const r = getPresetRange(preset);
      onChange({
        preset,
        startDate: r.startDate,
        endDate: r.endDate,
        label: r.label,
      });
    }
  };

  // Calendar day grid generation (6 weeks = 42 cells)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

    const days: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      date: Date;
    }> = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = calMonth === 0 ? 11 : calMonth - 1;
      const prevYear = calMonth === 0 ? calYear - 1 : calYear;
      days.push({
        day: d,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        date: new Date(prevYear, prevMonth, d),
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      days.push({
        day: d,
        month: calMonth,
        year: calYear,
        isCurrentMonth: true,
        date: new Date(calYear, calMonth, d),
      });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = calMonth === 11 ? 0 : calMonth + 1;
      const nextYear = calMonth === 11 ? calYear + 1 : calYear;
      days.push({
        day: d,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        date: new Date(nextYear, nextMonth, d),
      });
    }

    return days;
  }, [calYear, calMonth]);

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const handleDayClick = (clickedDate: Date) => {
    if (activeTab === 'start') {
      setDraftStart(clickedDate);
      if (draftEnd && clickedDate > draftEnd) {
        setDraftEnd(null);
      }
      setActiveTab('end');
    } else {
      if (draftStart && clickedDate < draftStart) {
        setDraftEnd(draftStart);
        setDraftStart(clickedDate);
      } else {
        setDraftEnd(clickedDate);
      }
    }
  };

  const isInRange = (d: Date): boolean => {
    if (!draftStart || !draftEnd) return false;
    const start = draftStart < draftEnd ? draftStart : draftEnd;
    const end = draftStart < draftEnd ? draftEnd : draftStart;
    return d > start && d < end;
  };

  const handleApply = () => {
    if (!draftStart || !draftEnd) return;
    const start = draftStart < draftEnd ? draftStart : draftEnd;
    const end = draftStart < draftEnd ? draftEnd : draftStart;
    onChange({
      preset: 'Custom',
      startDate: start,
      endDate: end,
      label: `${formatShortDate(start)} – ${formatShortDate(end)}`,
    });
    setCustomOpen(false);
  };

  const canApply = Boolean(draftStart && draftEnd);

  const [startHour, startMin] = startTime.split(':');
  const [endHour, endMin] = endTime.split(':');

  return (
    <div className="cip-date-range" ref={panelRef}>
      {/* Pills Container */}
      <div className="cip-date-pills">
        {PRESETS.map((p) => {
          const isSelected = value.preset === p;
          const isCustom = p === 'Custom';

          return (
            <button
              key={p}
              type="button"
              className={`cip-date-pill ${isSelected ? 'is-active' : ''} ${
                isCustom ? 'cip-date-pill-custom' : ''
              } ${isCustom && customOpen ? 'is-open' : ''}`}
              onClick={() => handlePreset(p)}
              aria-expanded={isCustom ? customOpen : undefined}
            >
              {p}
              {isCustom && (
                <Icon
                  name="keyboard_arrow_down"
                  size="small"
                  className={`cip-date-pill-icon ${customOpen ? 'is-open' : ''}`}
                />
              )}
              {isCustom && isSelected && value.label && (
                <span className="cip-date-pill-custom-label"> · {value.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating Overlapping Custom Popover (Figma node 23227-193624) */}
      {customOpen && (
        <div className="cip-custom-popover" role="dialog" aria-modal="false">
          {/* Start Date vs End Date Tabs */}
          <div className="cip-custom-tabs-row">
            <button
              type="button"
              className={`cip-custom-tab ${activeTab === 'start' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('start')}
            >
              <span className="cip-custom-tab-title">Start Date</span>
              <span className="cip-custom-tab-value">
                {draftStart ? formatShortDateTime(draftStart, startTime) : 'Select...'}
              </span>
            </button>

            <button
              type="button"
              className={`cip-custom-tab ${activeTab === 'end' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('end')}
            >
              <span className="cip-custom-tab-title">End Date</span>
              <span className="cip-custom-tab-value">
                {draftEnd ? formatShortDateTime(draftEnd, endTime) : 'Select...'}
              </span>
            </button>
          </div>

          {/* Calendar Card */}
          <div className="cip-custom-calendar-card">
            {/* Calendar Navigation Header */}
            <div className="cip-custom-cal-header">
              <button
                type="button"
                className="cip-custom-cal-nav"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <Icon name="chevron_left" size="small" />
              </button>

              <div className="cip-custom-cal-month-year">
                <span className="cip-custom-month-text">{MONTH_NAMES[calMonth]}</span>
                <span className="cip-custom-year-text">{calYear}</span>
              </div>

              <button
                type="button"
                className="cip-custom-cal-nav"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <Icon name="chevron_right" size="small" />
              </button>
            </div>

            {/* Days of Week Row */}
            <div className="cip-custom-day-letters">
              {DAY_LETTERS.map((l, idx) => (
                <span key={idx} className="cip-custom-day-letter">
                  {l}
                </span>
              ))}
            </div>

            {/* Calendar Days 7x6 Grid */}
            <div className="cip-custom-days-grid">
              {calendarDays.map((item, idx) => {
                const isStart = isSameDay(draftStart, item.date);
                const isEnd = isSameDay(draftEnd, item.date);
                const inRange = isInRange(item.date);
                const isToday = isSameDay(defaultToday, item.date);

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`cip-custom-day-cell ${
                      !item.isCurrentMonth ? 'is-outside' : ''
                    } ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''} ${
                      inRange ? 'is-in-range' : ''
                    } ${isToday && !isStart && !isEnd ? 'is-today' : ''}`}
                    onClick={() => handleDayClick(item.date)}
                  >
                    <span className="cip-custom-day-num">{item.day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Digital Time Row */}
          <div className="cip-custom-time-row">
            <span className="cip-custom-time-label">Time:</span>
            <div className="cip-custom-time-inputs">
              <input
                type="text"
                className="cip-custom-time-box"
                value={activeTab === 'start' ? startHour : endHour}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  if (activeTab === 'start') {
                    setStartTime(`${val}:${startMin}`);
                  } else {
                    setEndTime(`${val}:${endMin}`);
                  }
                }}
                maxLength={2}
              />
              <span className="cip-custom-time-colon">:</span>
              <input
                type="text"
                className="cip-custom-time-box"
                value={activeTab === 'start' ? startMin : endMin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  if (activeTab === 'start') {
                    setStartTime(`${startHour}:${val}`);
                  } else {
                    setEndTime(`${endHour}:${val}`);
                  }
                }}
                maxLength={2}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cip-custom-footer-actions">
            <button
              type="button"
              className="cip-custom-cancel-btn"
              onClick={() => setCustomOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canApply}
              className={`cip-custom-apply-btn ${canApply ? 'is-enabled' : 'is-disabled'}`}
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
