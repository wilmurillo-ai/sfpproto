'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Icon } from '@/components/ui';

export type PresetRange =
  | 'This Shift'
  | 'Last Shift'
  | 'Today'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Custom';

export interface DateRangeValue {
  type: PresetRange;
  label: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string; // 'HH:MM'
  endTime?: string;   // 'HH:MM'
}

export interface DateRangeProps {
  className?: string;
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  dimUnderneath?: boolean;
  align?: 'left' | 'right';
  presets?: PresetRange[];
}

const DEFAULT_PRESETS: PresetRange[] = [
  'This Shift',
  'Last Shift',
  'Today',
  'Last 7 Days',
  'Last 30 Days',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function formatDateDisplay(d: Date, time: string = '00:00'): string {
  const mm = padZero(d.getMonth() + 1);
  const dd = padZero(d.getDate());
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy} ${time}`;
}

function formatShortDate(d: Date, time: string): string {
  const monthName = MONTH_NAMES[d.getMonth()];
  const dd = d.getDate();
  return `${monthName} ${dd}, ${time}`;
}

export default function DateRange({
  className = '',
  value: controlledValue,
  defaultValue,
  onChange,
  dimUnderneath = true,
  align = 'right',
  presets = DEFAULT_PRESETS,
}: DateRangeProps) {
  // Today reference (defaults to April 2026 to match prototype / Figma timeline, or current date)
  const defaultToday = useMemo(() => new Date(2026, 3, 13), []); // April 13, 2026

  // Internal state
  const [selectedRange, setSelectedRange] = useState<DateRangeValue>(
    controlledValue ||
      defaultValue || {
        type: 'Today',
        label: 'Today',
        startDate: defaultToday,
        endDate: defaultToday,
        startTime: '00:00',
        endTime: '23:59',
      }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'start' | 'end'>('start');

  // Custom Calendar state
  const [calendarMonth, setCalendarMonth] = useState<number>(3); // April (0-indexed)
  const [calendarYear, setCalendarYear] = useState<number>(2026);

  // Temporary custom dates in draft mode
  const [draftStartDate, setDraftStartDate] = useState<Date | null>(defaultToday);
  const [draftEndDate, setDraftEndDate] = useState<Date | null>(null);
  const [draftStartTime, setDraftStartTime] = useState<string>('00:00');
  const [draftEndTime, setDraftEndTime] = useState<string>('23:59');

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync controlled value if passed
  useEffect(() => {
    if (controlledValue) {
      setSelectedRange(controlledValue);
    }
  }, [controlledValue]);

  // Click outside listener to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsCustomOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsCustomOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handlers
  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsCustomOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleSelectPreset = (preset: PresetRange) => {
    const newVal: DateRangeValue = {
      type: preset,
      label: preset,
    };
    setSelectedRange(newVal);
    onChange?.(newVal);
    setIsOpen(false);
    setIsCustomOpen(false);
  };

  const handleOpenCustom = () => {
    setIsCustomOpen(true);
    setActiveTab('start');
    if (!draftStartDate) {
      setDraftStartDate(defaultToday);
    }
  };

  // Calendar Day Generation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInCurrentMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

    const days: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      date: Date;
    }> = [];

    // Prev month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
      const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
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
        month: calendarMonth,
        year: calendarYear,
        isCurrentMonth: true,
        date: new Date(calendarYear, calendarMonth, d),
      });
    }

    // Next month padding to fill grid (up to 35 or 42)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
      const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
      days.push({
        day: d,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        date: new Date(nextYear, nextMonth, d),
      });
    }

    return days;
  }, [calendarMonth, calendarYear]);

  // Prev / Next month buttons
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  // Day selection
  const handleDayClick = (date: Date) => {
    if (activeTab === 'start') {
      setDraftStartDate(date);
      // Auto move to End Date tab after picking start date
      setActiveTab('end');
      if (draftEndDate && date > draftEndDate) {
        setDraftEndDate(null);
      }
    } else {
      // End tab active
      if (draftStartDate && date < draftStartDate) {
        // If chosen date is before start date, treat as new start date
        setDraftStartDate(date);
        setDraftEndDate(null);
      } else {
        setDraftEndDate(date);
      }
    }
  };

  const isSameDay = (d1: Date | null, d2: Date) => {
    if (!d1) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = (date: Date) => {
    if (!draftStartDate || !draftEndDate) return false;
    const time = date.getTime();
    return time > draftStartDate.getTime() && time < draftEndDate.getTime();
  };

  const canApply = Boolean(draftStartDate && draftEndDate);

  const handleApplyCustom = () => {
    if (!draftStartDate || !draftEndDate) return;

    const label = `${formatDateDisplay(draftStartDate, draftStartTime)} - ${formatDateDisplay(
      draftEndDate,
      draftEndTime
    )}`;

    const newVal: DateRangeValue = {
      type: 'Custom',
      label,
      startDate: draftStartDate,
      endDate: draftEndDate,
      startTime: draftStartTime,
      endTime: draftEndTime,
    };

    setSelectedRange(newVal);
    onChange?.(newVal);
    setIsOpen(false);
    setIsCustomOpen(false);
  };

  const handleCancelCustom = () => {
    setIsCustomOpen(false);
    setActiveTab('start');
  };

  // Parse time input strings for hours & minutes
  const [startHour, startMin] = (draftStartTime || '00:00').split(':');
  const [endHour, endMin] = (draftEndTime || '23:59').split(':');

  const handleTimeChange = (type: 'start' | 'end', part: 'hour' | 'min', val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(0, 2);
    if (type === 'start') {
      const h = part === 'hour' ? cleanVal : startHour;
      const m = part === 'min' ? cleanVal : startMin;
      setDraftStartTime(`${h.padStart(2, '0')}:${m.padStart(2, '0')}`);
    } else {
      const h = part === 'hour' ? cleanVal : endHour;
      const m = part === 'min' ? cleanVal : endMin;
      setDraftEndTime(`${h.padStart(2, '0')}:${m.padStart(2, '0')}`);
    }
  };

  return (
    <>
      {/* 50% Opacity Dimmed Layer Underneath when Open (Figma Requirement) */}
      {dimUnderneath && isOpen && (
        <div
          className="daterange-dimmed-backdrop"
          onClick={() => {
            setIsOpen(false);
            setIsCustomOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      <div
        ref={containerRef}
        className={`daterange-container ${isOpen ? 'is-open' : ''} ${className}`.trim()}
      >
        {/* Trigger Pill Button (Filter component from Peacock DS) */}
        <button
          type="button"
          className={`daterange-trigger-pill ${
            selectedRange.type === 'Custom' ? 'is-custom-filled' : ''
          } ${isOpen ? 'is-active' : ''}`}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <span className="daterange-trigger-label">{selectedRange.label}</span>
          <Icon name="arrow_drop_down" size="small" className="daterange-arrow-icon" />
        </button>

        {/* Dropdown Menu & Custom Picker Popover */}
        {isOpen && (
          <div className={`daterange-dropdown-wrapper align-${align}`} role="dialog">
            {/* Custom Date & Time Picker (Second Level Panel on Left) */}
            {isCustomOpen && (
              <div className="daterange-custom-panel">
                {/* Tabs: Start Date vs End Date */}
                <div className="daterange-tabs-row">
                  <button
                    type="button"
                    className={`daterange-tab ${activeTab === 'start' ? 'active' : ''}`}
                    onClick={() => setActiveTab('start')}
                  >
                    <span className="daterange-tab-title">Start Date</span>
                    <span className="daterange-tab-desc">
                      {draftStartDate
                        ? formatShortDate(draftStartDate, draftStartTime)
                        : 'Select...'}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`daterange-tab ${activeTab === 'end' ? 'active' : ''}`}
                    onClick={() => setActiveTab('end')}
                  >
                    <span className="daterange-tab-title">End Date</span>
                    <span className="daterange-tab-desc">
                      {draftEndDate ? formatShortDate(draftEndDate, draftEndTime) : 'Select...'}
                    </span>
                  </button>
                </div>

                {/* Calendar Card */}
                <div className="daterange-calendar-card">
                  {/* Calendar Navigation Header */}
                  <div className="daterange-calendar-header">
                    <button
                      type="button"
                      className="daterange-cal-nav-btn"
                      onClick={handlePrevMonth}
                      title="Previous Month"
                    >
                      <Icon name="chevron_left" size="small" />
                    </button>

                    <div className="daterange-cal-month-year">
                      <span className="daterange-month-text">{MONTH_NAMES[calendarMonth]}</span>
                      <Icon name="arrow_drop_down" size="small" />
                      <span className="daterange-year-text">{calendarYear}</span>
                      <Icon name="arrow_drop_down" size="small" />
                    </div>

                    <button
                      type="button"
                      className="daterange-cal-nav-btn"
                      onClick={handleNextMonth}
                      title="Next Month"
                    >
                      <Icon name="chevron_right" size="small" />
                    </button>
                  </div>

                  {/* Day of Week Row */}
                  <div className="daterange-day-letters-row">
                    {DAY_LETTERS.map((letter, idx) => (
                      <span key={idx} className="daterange-day-letter">
                        {letter}
                      </span>
                    ))}
                  </div>

                  {/* Calendar Days 7x6 Grid */}
                  <div className="daterange-days-grid">
                    {calendarDays.map((item, idx) => {
                      const isStart = isSameDay(draftStartDate, item.date);
                      const isEnd = isSameDay(draftEndDate, item.date);
                      const inRange = isInRange(item.date);
                      const isToday = isSameDay(defaultToday, item.date);

                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`daterange-day-cell ${
                            !item.isCurrentMonth ? 'is-outside-month' : ''
                          } ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''} ${
                            inRange ? 'is-in-range' : ''
                          } ${isToday && !isStart && !isEnd ? 'is-today' : ''}`}
                          onClick={() => handleDayClick(item.date)}
                        >
                          <span className="daterange-day-num">{item.day}</span>
                          {isStart && <span className="daterange-start-dot" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Digital Time Row */}
                <div className="daterange-time-row">
                  <span className="daterange-time-label">Time:</span>
                  <div className="daterange-time-inputs">
                    <input
                      type="text"
                      className="daterange-time-box"
                      value={activeTab === 'start' ? startHour : endHour}
                      onChange={(e) =>
                        handleTimeChange(activeTab, 'hour', e.target.value)
                      }
                      maxLength={2}
                    />
                    <span className="daterange-time-colon">:</span>
                    <input
                      type="text"
                      className="daterange-time-box"
                      value={activeTab === 'start' ? startMin : endMin}
                      onChange={(e) =>
                        handleTimeChange(activeTab, 'min', e.target.value)
                      }
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Action Buttons: Apply & Cancel */}
                <div className="daterange-footer-actions">
                  <button
                    type="button"
                    disabled={!canApply}
                    className={`daterange-apply-btn ${canApply ? 'enabled' : 'disabled'}`}
                    onClick={handleApplyCustom}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    className="daterange-cancel-btn"
                    onClick={handleCancelCustom}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Menu List (First Level Options) */}
            <div className="daterange-menu-list">
              {presets.map((preset) => {
                const isSelected = selectedRange.type === preset && !isCustomOpen;
                return (
                  <button
                    key={preset}
                    type="button"
                    className={`daterange-menu-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <span>{preset}</span>
                    {isSelected && (
                      <Icon name="check" size="small" className="daterange-check-icon" />
                    )}
                  </button>
                );
              })}

              {/* Custom Item with Chevron */}
              <button
                type="button"
                className={`daterange-menu-item daterange-custom-menu-item ${
                  isCustomOpen || selectedRange.type === 'Custom' ? 'is-custom-active' : ''
                }`}
                onClick={handleOpenCustom}
              >
                <span>Custom</span>
                <Icon name="chevron_right" size="small" className="daterange-chevron-icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
