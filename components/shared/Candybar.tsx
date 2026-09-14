'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui';

export type CandybarStatus =
  | 'running'
  | 'slow-running'
  | 'stopped'
  | 'fault'
  | 'planned-dt'
  | 'planned-stop'
  | 'hidden'
  | 'first-fault';

export type CandybarSize = 'small' | 'large';
export type CandybarTimeframe = '1hr' | '4hr' | 'shift' | '24hr';

export interface OperatorNote {
  author: string;
  initials: string;
  text: string;
  timestamp?: string;
}

export interface CandybarSegment {
  id: string;
  status: CandybarStatus;
  durationMinutes: number;
  title: string;
  timeRange: string;
  equipment?: string;
  plannedSpeed?: string;
  avgSpeed?: string;
  speedDelta?: string;
  hasNote?: boolean;
  noteRequired?: boolean;
  isFirstFault?: boolean;
  operatorNote?: OperatorNote;
}

export interface CandybarProps {
  className?: string;
  size?: CandybarSize;
  initialTimeframe?: CandybarTimeframe;
  timeframe?: CandybarTimeframe;
  onTimeframeChange?: (timeframe: CandybarTimeframe) => void;
  showTimeframeSelector?: boolean;
  showSizeToggle?: boolean;
  showLegend?: boolean;
  showNowNeedle?: boolean;
  segments?: CandybarSegment[];
  onSegmentClick?: (segment: CandybarSegment) => void;
  title?: string;
  subtitle?: string;
}

// -------------------------------------------------------------
// Default Mock Data for Timeframes (Derived from Figma specs)
// -------------------------------------------------------------

const mock1HrSegments: CandybarSegment[] = [
  {
    id: '1h-1',
    status: 'running',
    durationMinutes: 3,
    title: 'High Speed Production',
    timeRange: '10:30am – 10:33am',
    equipment: 'Main Filler G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '912 BPM',
    speedDelta: '+1.3%',
  },
  {
    id: '1h-2',
    status: 'stopped',
    durationMinutes: 3,
    title: 'Sensor Calibration & QA Halt',
    timeRange: '10:33am – 10:36am',
    equipment: 'Filler',
    hasNote: true,
    operatorNote: {
      author: 'Rigoberto Malta',
      initials: 'RM',
      text: 'I had to replace the filler cap in order to keep the line going without further issue.',
    },
  },
  {
    id: '1h-3',
    status: 'slow-running',
    durationMinutes: 3,
    title: 'Slow Running — Pressure Ramp',
    timeRange: '10:36am – 10:39am',
    equipment: 'Conveyor 2B',
    plannedSpeed: '900 BPM',
    avgSpeed: '520 BPM',
    speedDelta: '-42%',
  },
  {
    id: '1h-4',
    status: 'stopped',
    durationMinutes: 3,
    title: 'Capper Discharge Jam',
    timeRange: '10:39am – 10:42am',
    equipment: 'Capper 01',
    noteRequired: true,
  },
  {
    id: '1h-5',
    status: 'slow-running',
    durationMinutes: 6,
    title: 'Slow Running — SKU Feed Throttle',
    timeRange: '10:42am – 10:48am',
    equipment: 'Infeed Conveyor',
    plannedSpeed: '900 BPM',
    avgSpeed: '640 BPM',
    speedDelta: '-28%',
  },
  {
    id: '1h-6',
    status: 'running',
    durationMinutes: 42,
    title: 'Steady State Bottling',
    timeRange: '10:48am – 11:30am',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '905 BPM',
    speedDelta: '+0.5%',
  },
];

const mock4HrSegments: CandybarSegment[] = [
  {
    id: '4h-1',
    status: 'running',
    durationMinutes: 15,
    title: 'Morning Line Production',
    timeRange: '09:00am – 09:15am',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '895 BPM',
  },
  {
    id: '4h-2',
    status: 'stopped',
    durationMinutes: 28,
    title: 'Filler Mechanical Jam',
    timeRange: '09:15am – 09:43am',
    equipment: 'Filler',
    isFirstFault: true,
    hasNote: true,
    operatorNote: {
      author: 'Carlos Mendez',
      initials: 'CM',
      text: 'Cleared jammed container in guide rail 3 and reset trip sensor.',
    },
  },
  {
    id: '4h-3',
    status: 'slow-running',
    durationMinutes: 9,
    title: 'Post-clearance warmup',
    timeRange: '09:43am – 09:52am',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '610 BPM',
  },
  {
    id: '4h-4',
    status: 'stopped',
    durationMinutes: 6,
    title: 'Labeler Web Splice',
    timeRange: '09:52am – 09:58am',
    equipment: 'Labeler North',
    noteRequired: true,
  },
  {
    id: '4h-5',
    status: 'slow-running',
    durationMinutes: 5,
    title: 'Speed stabilization',
    timeRange: '09:58am – 10:03am',
    equipment: 'Labeler North',
  },
  {
    id: '4h-6',
    status: 'running',
    durationMinutes: 25,
    title: 'Batch A101 Run',
    timeRange: '10:03am – 10:28am',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '910 BPM',
  },
  {
    id: '4h-7',
    status: 'planned-dt',
    durationMinutes: 48,
    title: 'Scheduled CIP Cleaning & Sanitation',
    timeRange: '10:28am – 11:16am',
    equipment: 'CIP Wash Station',
  },
  {
    id: '4h-8',
    status: 'running',
    durationMinutes: 7,
    title: 'CIP Flush Verification',
    timeRange: '11:16am – 11:23am',
    equipment: 'Filler Rinse',
  },
  {
    id: '4h-9',
    status: 'stopped',
    durationMinutes: 8,
    title: 'Optical Check Sensor Fault',
    timeRange: '11:23am – 11:31am',
    equipment: 'Vision Inspector',
    noteRequired: true,
  },
  {
    id: '4h-10',
    status: 'slow-running',
    durationMinutes: 18,
    title: 'Inspection Recalibration Run',
    timeRange: '11:31am – 11:49am',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '680 BPM',
  },
  {
    id: '4h-11',
    status: 'running',
    durationMinutes: 71,
    title: 'Continuous Run — SKU A101',
    timeRange: '11:49am – 01:00pm',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '918 BPM',
    speedDelta: '+2.0%',
  },
];

const mockShiftSegments: CandybarSegment[] = [
  {
    id: 'sh-1',
    status: 'hidden',
    durationMinutes: 65,
    title: 'Shift Pre-Start & Safety Inspection',
    timeRange: '09:00am – 10:05am',
    equipment: 'Line G4',
  },
  {
    id: 'sh-2',
    status: 'stopped',
    durationMinutes: 8,
    title: 'Emergency Stop — Palletizer Gate',
    timeRange: '10:05am – 10:13am',
    equipment: 'Palletizer',
    noteRequired: true,
  },
  {
    id: 'sh-3',
    status: 'slow-running',
    durationMinutes: 7,
    title: 'Conveyor slow crawl',
    timeRange: '10:13am – 10:20am',
    equipment: 'Outfeed System',
  },
  {
    id: 'sh-4',
    status: 'stopped',
    durationMinutes: 8,
    title: 'Cardboard Tray Feeder Jam',
    timeRange: '10:20am – 10:28am',
    equipment: 'Case Packer',
    noteRequired: true,
  },
  {
    id: 'sh-5',
    status: 'running',
    durationMinutes: 98,
    title: 'High Efficiency Bottling',
    timeRange: '10:28am – 12:06pm',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '920 BPM',
    speedDelta: '+2.2%',
  },
  {
    id: 'sh-6',
    status: 'stopped',
    durationMinutes: 18,
    title: 'Glue Applicator Nozzle Clog',
    timeRange: '12:06pm – 12:24pm',
    equipment: 'Case Packer',
    isFirstFault: true,
    hasNote: true,
    operatorNote: {
      author: 'Rigoberto Malta',
      initials: 'RM',
      text: 'Purged hot-melt glue lines and recalibrated temperature thermocouple.',
    },
  },
  {
    id: 'sh-7',
    status: 'stopped',
    durationMinutes: 6,
    title: 'Discharge Photoeye Blocked',
    timeRange: '12:24pm – 12:30pm',
    equipment: 'Discharge Rail',
    noteRequired: true,
  },
  {
    id: 'sh-8',
    status: 'slow-running',
    durationMinutes: 10,
    title: 'Throttle during infeed queue build',
    timeRange: '12:30pm – 12:40pm',
    equipment: 'Line G4',
  },
  {
    id: 'sh-9',
    status: 'planned-dt',
    durationMinutes: 40,
    title: 'Planned Product Changeover (12oz to 20oz)',
    timeRange: '12:40pm – 01:20pm',
    equipment: 'Line G4 Changeover Team',
  },
  {
    id: 'sh-10',
    status: 'running',
    durationMinutes: 44,
    title: 'New Product Test Run & Qualification',
    timeRange: '01:20pm – 02:04pm',
    equipment: 'Line G4',
    plannedSpeed: '850 BPM',
    avgSpeed: '840 BPM',
  },
  {
    id: 'sh-11',
    status: 'stopped',
    durationMinutes: 7,
    title: 'Cap Feeder Chute Misalignment',
    timeRange: '02:04pm – 02:11pm',
    equipment: 'Capper Elevator',
    noteRequired: true,
  },
  {
    id: 'sh-12',
    status: 'stopped',
    durationMinutes: 6,
    title: 'Bottle orienter hesitation',
    timeRange: '02:11pm – 02:17pm',
    equipment: 'Depalletizer',
    noteRequired: true,
  },
  {
    id: 'sh-13',
    status: 'slow-running',
    durationMinutes: 16,
    title: 'Bottle unscrambler buffer fill',
    timeRange: '02:17pm – 02:33pm',
    equipment: 'Unscrambler',
  },
  {
    id: 'sh-14',
    status: 'stopped',
    durationMinutes: 15,
    title: 'Film Wrap Roll Exhausted',
    timeRange: '02:33pm – 02:48pm',
    equipment: 'Shrink Wrapper',
    hasNote: true,
    operatorNote: {
      author: 'Elena Torres',
      initials: 'ET',
      text: 'Swapped reel and aligned tension arms.',
    },
  },
  {
    id: 'sh-15',
    status: 'slow-running',
    durationMinutes: 10,
    title: 'Heat tunnel temperature recovery',
    timeRange: '02:48pm – 02:58pm',
    equipment: 'Shrink Tunnel',
  },
  {
    id: 'sh-16',
    status: 'running',
    durationMinutes: 122,
    title: 'Full Rate Production Run',
    timeRange: '02:58pm – 05:00pm',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '915 BPM',
    speedDelta: '+1.6%',
  },
];

const mock24HrSegments: CandybarSegment[] = [
  {
    id: '24h-1',
    status: 'hidden',
    durationMinutes: 75,
    title: 'Previous Day Turnover',
    timeRange: 'Yesterday 09:00am – 10:15am',
    equipment: 'Line G4',
  },
  {
    id: '24h-2',
    status: 'stopped',
    durationMinutes: 12,
    title: 'Pre-rinse valve stall',
    timeRange: 'Yesterday 10:15am – 10:27am',
    equipment: 'Rinser',
  },
  {
    id: '24h-3',
    status: 'running',
    durationMinutes: 130,
    title: 'Day Shift Run',
    timeRange: 'Yesterday 10:27am – 12:37pm',
    equipment: 'Line G4',
  },
  {
    id: '24h-4',
    status: 'planned-dt',
    durationMinutes: 50,
    title: 'Scheduled Meal & Tooling Inspection',
    timeRange: 'Yesterday 12:37pm – 01:27pm',
    equipment: 'Line G4',
  },
  {
    id: '24h-5',
    status: 'running',
    durationMinutes: 220,
    title: 'Midday Steady State',
    timeRange: 'Yesterday 01:27pm – 05:07pm',
    equipment: 'Line G4',
  },
  {
    id: '24h-6',
    status: 'stopped',
    durationMinutes: 20,
    title: 'Coder Printhead Defect',
    timeRange: 'Yesterday 05:07pm – 05:27pm',
    equipment: 'Videojet Laser Coder',
    hasNote: true,
    operatorNote: {
      author: 'David Wu',
      initials: 'DW',
      text: 'Replaced ink nozzle filter and validated 2D barcode scan quality.',
    },
  },
  {
    id: '24h-7',
    status: 'slow-running',
    durationMinutes: 30,
    title: 'Shift 2 Ramp Up',
    timeRange: 'Yesterday 05:27pm – 05:57pm',
    equipment: 'Line G4',
  },
  {
    id: '24h-8',
    status: 'running',
    durationMinutes: 190,
    title: 'Shift 2 Primary Production',
    timeRange: 'Yesterday 05:57pm – 09:07pm',
    equipment: 'Line G4',
  },
  {
    id: '24h-9',
    status: 'planned-dt',
    durationMinutes: 60,
    title: 'Night Shift Sanitation Cycle',
    timeRange: 'Yesterday 09:07pm – 10:07pm',
    equipment: 'Sanitation Dept',
  },
  {
    id: '24h-10',
    status: 'running',
    durationMinutes: 290,
    title: 'Graveyard Shift Continuous Bottling',
    timeRange: 'Yesterday 10:07pm – 02:57am',
    equipment: 'Line G4',
  },
  {
    id: '24h-11',
    status: 'stopped',
    durationMinutes: 18,
    title: 'Discharge Belt Shear Pin Break',
    timeRange: '02:57am – 03:15am',
    equipment: 'Pallet Outfeed',
    noteRequired: true,
  },
  {
    id: '24h-12',
    status: 'slow-running',
    durationMinutes: 25,
    title: 'Controlled Speed Feed',
    timeRange: '03:15am – 03:40am',
    equipment: 'Line G4',
  },
  {
    id: '24h-13',
    status: 'running',
    durationMinutes: 320,
    title: 'Shift 1 Morning Production Run',
    timeRange: '03:40am – 09:00am',
    equipment: 'Line G4',
    plannedSpeed: '900 BPM',
    avgSpeed: '924 BPM',
    speedDelta: '+2.6%',
  },
];

const timeframeDataMap: Record<
  CandybarTimeframe,
  {
    startLabel: string;
    midLabel: string;
    nowLabel: string;
    segments: CandybarSegment[];
  }
> = {
  '1hr': {
    startLabel: '10:30',
    midLabel: '11:00',
    nowLabel: '11:30',
    segments: mock1HrSegments,
  },
  '4hr': {
    startLabel: '09:00',
    midLabel: '11:00',
    nowLabel: '13:00',
    segments: mock4HrSegments,
  },
  shift: {
    startLabel: '09:00',
    midLabel: '13:00',
    nowLabel: '17:00',
    segments: mockShiftSegments,
  },
  '24hr': {
    startLabel: 'Yesterday 09:00',
    midLabel: 'Yesterday 21:00',
    nowLabel: '09:00',
    segments: mock24HrSegments,
  },
};

export default function Candybar({
  className = '',
  size = 'large',
  initialTimeframe = 'shift',
  timeframe: controlledTimeframe,
  onTimeframeChange,
  showTimeframeSelector = true,
  showSizeToggle = true,
  showLegend = true,
  showNowNeedle = true,
  segments: customSegments,
  onSegmentClick,
  title,
  subtitle,
}: CandybarProps) {
  // State
  const [internalTimeframe, setInternalTimeframe] = useState<CandybarTimeframe>(initialTimeframe);
  const [currentSize, setCurrentSize] = useState<CandybarSize>(size);
  const [hoveredSegment, setHoveredSegment] = useState<CandybarSegment | null>(null);
  const [activeSegment, setActiveSegment] = useState<CandybarSegment | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const activeTimeframe = controlledTimeframe || internalTimeframe;
  const currentConfig = timeframeDataMap[activeTimeframe];
  const activeSegments = customSegments || currentConfig.segments;

  const totalDuration = activeSegments.reduce((sum, seg) => sum + seg.durationMinutes, 0) || 1;

  // Sync prop size if changed externally
  useEffect(() => {
    setCurrentSize(size);
  }, [size]);

  const handleTimeframeSelect = (tf: CandybarTimeframe) => {
    setInternalTimeframe(tf);
    setHoveredSegment(null);
    setActiveSegment(null);
    onTimeframeChange?.(tf);
  };

  const handleSegmentHover = (seg: CandybarSegment, event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredSegment(seg);
    computePopoverPosition(event.currentTarget);
  };

  const handleSegmentLeave = () => {
    setHoveredSegment(null);
  };

  const handleSegmentClick = (seg: CandybarSegment, event: React.MouseEvent<HTMLDivElement>) => {
    setActiveSegment(activeSegment?.id === seg.id ? null : seg);
    computePopoverPosition(event.currentTarget);
    onSegmentClick?.(seg);
  };

  const computePopoverPosition = (targetEl: HTMLElement) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const x = targetRect.left - containerRect.left + targetRect.width / 2;
    const y = targetRect.top - containerRect.top;
    setPopoverPos({ x, y });
  };

  const displayedSegment = activeSegment || hoveredSegment;

  return (
    <div
      ref={containerRef}
      className={`candybar-wrapper ${currentSize === 'small' ? 'candybar-small' : 'candybar-large'} ${className}`.trim()}
    >
      {/* Top Header & Controls */}
      <div className="candybar-top-bar">
        {/* Optional Title or Timeframe Selector */}
        <div className="candybar-header-left">
          {title && (
            <div className="candybar-title-block">
              <span className="candybar-title">{title}</span>
              {subtitle && <span className="candybar-subtitle">{subtitle}</span>}
            </div>
          )}

          {showTimeframeSelector && (
            <div className="candybar-timeframe-selector" role="tablist" aria-label="Candybar Timeframe">
              {(
                [
                  { id: '1hr', label: '1 Hour' },
                  { id: '4hr', label: '4 Hours' },
                  { id: 'shift', label: 'Shift' },
                  { id: '24hr', label: '24 Hours' },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTimeframe === id}
                  className={`candybar-tf-btn ${activeTimeframe === id ? 'active' : ''}`}
                  onClick={() => handleTimeframeSelect(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Legend & Size Toggle */}
        <div className="candybar-header-right">
          {showLegend && (
            <div className="candybar-legend">
              <div className="candybar-legend-item">
                <div className="candybar-swatch swatch-running" />
                <span>Running</span>
              </div>
              <div className="candybar-legend-item">
                <div className="candybar-swatch swatch-slow-running" />
                <span>Slow Run</span>
              </div>
              <div className="candybar-legend-item">
                <div className="candybar-swatch swatch-fault" />
                <span>Fault</span>
              </div>
              <div className="candybar-legend-item">
                <div className="candybar-swatch swatch-planned" />
                <span>Planned Stop</span>
              </div>
              <div className="candybar-legend-item">
                <div className="candybar-swatch-dot" />
                <span>Info. Required</span>
              </div>
            </div>
          )}

          {showSizeToggle && (
            <div className="candybar-size-toggle">
              <button
                type="button"
                className={`candybar-size-btn ${currentSize === 'small' ? 'active' : ''}`}
                onClick={() => setCurrentSize('small')}
                title="Small height (44px)"
              >
                S
              </button>
              <button
                type="button"
                className={`candybar-size-btn ${currentSize === 'large' ? 'active' : ''}`}
                onClick={() => setCurrentSize('large')}
                title="Large height (87px)"
              >
                L
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Candy Bar Container */}
      <div className="candybar-track-container">
        <div
          ref={barRef}
          className={`candybar-track ${currentSize === 'small' ? 'h-44' : 'h-87'}`}
          role="region"
          aria-label="Production performance timeline"
        >
          {activeSegments.map((segment) => {
            const widthPct = (segment.durationMinutes / totalDuration) * 100;
            const isHovered = displayedSegment?.id === segment.id;

            return (
              <div
                key={segment.id}
                className={`candybar-segment-wrapper ${segment.noteRequired ? 'has-note-required' : ''}`}
                style={{ width: `${widthPct}%` }}
                onMouseEnter={(e) => handleSegmentHover(segment, e)}
                onMouseLeave={handleSegmentLeave}
                onClick={(e) => handleSegmentClick(segment, e)}
                tabIndex={0}
                role="button"
                aria-label={`${segment.title} (${segment.timeRange})`}
              >
                {/* Note Required Floating Dot (Figma Rule: hidden if segment width < 8px) */}
                {segment.noteRequired && (
                  <div className="candybar-note-required-pin" title="Operator Note Required">
                    <span className="candybar-note-pin-dot" />
                  </div>
                )}

                {/* The Color/Pattern Block */}
                <div
                  className={`candybar-segment status-${segment.status} ${isHovered ? 'is-hovered' : ''} ${
                    segment.isFirstFault ? 'is-first-fault' : ''
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Now Needle Marker Line Cutting Vertically */}
        {showNowNeedle && (
          <div className="candybar-now-marker" title={`Current time: ${currentConfig.nowLabel}`}>
            <div className="candybar-now-line" />
          </div>
        )}
      </div>

      {/* Time Axis & Now Needle Badge */}
      <div className="candybar-axis">
        <span className="candybar-axis-label start-time">{currentConfig.startLabel}</span>
        <span className="candybar-axis-label mid-time">{currentConfig.midLabel}</span>

        {showNowNeedle && (
          <div className="candybar-now-needle" title={`Live system time: ${currentConfig.nowLabel}`}>
            <span className="candybar-now-time">{currentConfig.nowLabel}</span>
            <span className="candybar-led-pulse" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Peacock DS Popover Card */}
      {displayedSegment && popoverPos && (
        <div
          className="candybar-popover"
          style={{
            left: `${Math.max(160, Math.min(popoverPos.x, (containerRef.current?.offsetWidth || 800) - 160))}px`,
            top: `${popoverPos.y - 12}px`,
          }}
          role="tooltip"
        >
          <div className="candybar-popover-content">
            {/* Popover Header Status */}
            <div className="candybar-popover-status-row">
              <div className={`candybar-popover-badge badge-${displayedSegment.status}`}>
                {displayedSegment.status === 'running' && <Icon name="play_arrow" size="small" />}
                {displayedSegment.status === 'slow-running' && <Icon name="speed" size="small" />}
                {(displayedSegment.status === 'stopped' || displayedSegment.status === 'fault') && (
                  <Icon name="warning" size="small" />
                )}
                {displayedSegment.status === 'planned-dt' && <Icon name="build" size="small" />}
                {displayedSegment.status === 'hidden' && <Icon name="visibility_off" size="small" />}
                <span className="candybar-popover-badge-text">
                  {displayedSegment.status === 'running' && 'RUNNING'}
                  {displayedSegment.status === 'slow-running' && 'SLOW RUNNING'}
                  {(displayedSegment.status === 'stopped' || displayedSegment.status === 'fault') && 'STOPPED'}
                  {displayedSegment.status === 'planned-dt' && 'PLANNED DOWNTIME'}
                  {displayedSegment.status === 'hidden' && 'INACTIVE'}
                  {displayedSegment.status === 'first-fault' && 'FIRST FAULT'}
                </span>
              </div>

              {displayedSegment.isFirstFault && (
                <span className="candybar-popover-tag first-fault-tag">First Fault</span>
              )}

              {displayedSegment.noteRequired && (
                <span className="candybar-popover-tag note-req-tag">Note Required</span>
              )}
            </div>

            {/* Event Title */}
            <h4 className="candybar-popover-title">{displayedSegment.title}</h4>

            {/* Event Meta Details */}
            <div className="candybar-popover-meta">
              <div className="candybar-meta-item">
                <span className="candybar-meta-label">Time:</span>
                <span className="candybar-meta-val">{displayedSegment.timeRange}</span>
              </div>
              <div className="candybar-meta-item">
                <span className="candybar-meta-label">Duration:</span>
                <span className="candybar-meta-val">{displayedSegment.durationMinutes}m</span>
              </div>
              {displayedSegment.equipment && (
                <div className="candybar-meta-item">
                  <span className="candybar-meta-label">Equipment:</span>
                  <span className="candybar-meta-val">{displayedSegment.equipment}</span>
                </div>
              )}
              {displayedSegment.plannedSpeed && (
                <div className="candybar-meta-item">
                  <span className="candybar-meta-label">Speed:</span>
                  <span className="candybar-meta-val">
                    {displayedSegment.avgSpeed || displayedSegment.plannedSpeed}
                    {displayedSegment.speedDelta && (
                      <span
                        className={`candybar-delta ${
                          displayedSegment.speedDelta.startsWith('+') ? 'positive' : 'negative'
                        }`}
                      >
                        {' '}
                        ({displayedSegment.speedDelta})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Operator Note (if available) */}
            {displayedSegment.operatorNote && (
              <div className="candybar-operator-note-card">
                <div className="candybar-operator-header">
                  <div className="candybar-avatar-initials">
                    {displayedSegment.operatorNote.initials}
                  </div>
                  <span className="candybar-operator-name">
                    {displayedSegment.operatorNote.author}
                  </span>
                </div>
                <p className="candybar-operator-text">
                  "{displayedSegment.operatorNote.text}"
                </p>
              </div>
            )}

            {/* Note Required Banner */}
            {displayedSegment.noteRequired && !displayedSegment.operatorNote && (
              <div className="candybar-note-required-banner">
                <Icon name="edit_note" size="small" />
                <span>Action required: Add reason & operator note (&gt; 5 min)</span>
              </div>
            )}
          </div>

          {/* Downward Caret Arrow */}
          <div className="candybar-popover-arrow" />
        </div>
      )}
    </div>
  );
}
