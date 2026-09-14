'use client';

import React, { useState, useRef } from 'react';
import ModalWindow from './ModalWindow';
import KPICard from './KPICard';
import { CandybarSegment, CandybarTimeframe } from './Candybar';
import { Icon } from '@/components/ui';
import {
  EQUIPMENT_MONITOR_ROWS,
  EquipmentMonitorRow,
} from '@/lib/equipmentMonitorData';

export interface EquipmentMonitorProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback triggered when modal is closed */
  onClose: () => void;
  /** Line identifier or title (defaults to 'CAN 01') */
  lineName?: string;
  /** Initial timeframe (defaults to '1hr') */
  initialTimeframe?: CandybarTimeframe;
}

export default function EquipmentMonitor({
  isOpen,
  onClose,
  lineName = 'CAN 01',
  initialTimeframe = '1hr',
}: EquipmentMonitorProps) {
  const [timeframe, setTimeframe] = useState<CandybarTimeframe>(initialTimeframe);
  const [isKpiExpanded, setIsKpiExpanded] = useState<boolean>(true);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'running' | 'attention'>('all');

  // Popover state
  const [hoveredSegment, setHoveredSegment] = useState<CandybarSegment | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Timeframe tabs
  const timeframeTabs: { id: CandybarTimeframe; label: string }[] = [
    { id: '1hr', label: '1hr' },
    { id: '4hr', label: '4hr' },
    { id: 'shift', label: 'Shift' },
    { id: '24hr', label: '24hr' },
  ];

  // Time markers based on selected timeframe
  const getTimeMarkers = (tf: CandybarTimeframe) => {
    switch (tf) {
      case '1hr':
        return { start: '11:19', mid: '11:49', end: '12:19' };
      case '4hr':
        return { start: '08:30', mid: '10:30', end: '12:30' };
      case 'shift':
        return { start: '07:00', mid: '11:00', end: '15:00' };
      case '24hr':
        return { start: 'Yesterday 12:00', mid: 'Today 00:00', end: '12:00' };
      default:
        return { start: '11:19', mid: '11:49', end: '12:19' };
    }
  };

  const markers = getTimeMarkers(timeframe);

  // Filtered rows
  const filteredRows = EQUIPMENT_MONITOR_ROWS.filter((row) => {
    if (filterQuery) {
      if (!row.name.toLowerCase().includes(filterQuery.toLowerCase())) return false;
    }
    if (activeFilter === 'running') return row.status === 'Running';
    if (activeFilter === 'attention') return row.status === 'Faulted' || row.status === 'Blocked' || row.status === 'Slow Run';
    return true;
  });

  // Handle popover positioning
  const handleSegmentHover = (seg: CandybarSegment, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredSegment(seg);
    if (!tableRef.current) return;
    const tableRect = tableRef.current.getBoundingClientRect();
    const segRect = e.currentTarget.getBoundingClientRect();

    const x = segRect.left - tableRect.left + segRect.width / 2;
    const y = segRect.top - tableRect.top;
    setPopoverPos({ x, y });
  };

  const handleSegmentLeave = () => {
    setHoveredSegment(null);
  };

  // Header Actions element passed to ModalWindow
  const headerActionsElement = (
    <div className="equipment-monitor-header-actions">
      {/* Refreshed Pill */}
      <button
        type="button"
        className="equipment-monitor-refresh-btn"
        title="Refresh Equipment Monitor Data"
        onClick={() => {
          // Visual feedback on refresh
          setHoveredSegment(null);
        }}
      >
        <div className="equipment-monitor-refresh-icon">
          <Icon name="refresh" size="small" />
        </div>
        <span>Refreshed 4 min ago</span>
      </button>

      {/* Clock & Shift Indicator */}
      <div className="equipment-monitor-shift-pill">
        <span className="shift-time">10:50</span>
        <span className="shift-name">Shift 1</span>
      </div>
    </div>
  );

  return (
    <ModalWindow
      isOpen={isOpen}
      onClose={onClose}
      size="fullscreen"
      icon="insert_chart"
      title="Equipment Monitor"
      subtitle=""
      headerActions={headerActionsElement}
      className="equipment-monitor-modal"
    >
      <div className="equipment-monitor-root">
        {/* ===================================================================
            SUB-HEADER: Line Name + Secondary Timeframe Tabs
            =================================================================== */}
        <div className="equipment-monitor-subbar" data-name="equipment monitor KPIs">
          <h2 className="equipment-monitor-line-title">{lineName}</h2>

          <div className="equipment-monitor-tabs" role="tablist" aria-label="Timeline Timeframe">
            {timeframeTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={timeframe === tab.id}
                className={`equipment-monitor-tab-btn ${timeframe === tab.id ? 'active' : ''}`}
                onClick={() => setTimeframe(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================================
            COLLAPSIBLE KPI CARDS SECTION
            =================================================================== */}
        <div className={`equipment-monitor-kpi-container ${!isKpiExpanded ? 'is-collapsed' : ''}`}>
          <div className="equipment-monitor-kpi-grid">
            {/* 1. Net Efficiency (92%) */}
            <KPICard
              id="em-kpi-efficiency"
              title="Net Efficiency"
              value={92}
              unit="%"
              size="Regular"
              type="Simple"
              delta="Positive"
              targetDelta="2% vs Target"
              targetDeltaType="positive"
              secondaryDelta="+2.4% vs last hr"
              clickable={false}
            />

            {/* 2. Waste (0.39%) */}
            <KPICard
              id="em-kpi-waste"
              title="Waste"
              value="0.39"
              unit="%"
              size="Regular"
              type="Simple"
              delta="Positive"
              targetDelta="1.7% vs Target"
              targetDeltaType="positive"
              secondaryDelta="+0.3% vs last hr"
              clickable={true}
              href="/waste"
            />

            {/* 3. Rate Loss (12%) */}
            <KPICard
              id="em-kpi-rate"
              title="Rate Loss"
              value={12}
              unit="%"
              size="Regular"
              type="Simple"
              delta="Positive"
              targetDelta="3% vs Target"
              targetDeltaType="positive"
              secondaryDelta="-2.4% vs last hr"
              clickable={true}
              href="/rateloss"
            />

            {/* 4. Downtime (16% Compound) */}
            <KPICard
              id="em-kpi-downtime"
              title="Downtime"
              value={16}
              unit="%"
              size="Regular"
              type="Compound"
              delta="Positive"
              targetDelta="2% vs Target"
              targetDeltaType="positive"
              secondaryDelta="+2.4% vs last hr"
              clickable={true}
              href="/downtimes"
              subMetrics={[
                { value: 6, label: 'Major Events' },
                { value: '2.17', unit: 'min', label: 'MTBF' },
                { value: '1.55', unit: 'min', label: 'MTTR' },
              ]}
            />
          </div>

          {/* Centered Chevron Toggle Divider */}
          <div className="equipment-monitor-collapse-divider">
            <button
              type="button"
              className="equipment-monitor-collapse-btn"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
              aria-label={isKpiExpanded ? 'Collapse KPI Section' : 'Expand KPI Section'}
              title={isKpiExpanded ? 'Collapse KPI Section' : 'Expand KPI Section'}
            >
              <Icon
                name={isKpiExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                size="large"
              />
            </button>
          </div>
        </div>

        {/* ===================================================================
            TIME MARKERS ROW
            =================================================================== */}
        <div className="equipment-monitor-time-markers">
          <span>{markers.start}</span>
          <span>{markers.mid}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {markers.end}
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#129f14',
                boxShadow: '0 0 6px #129f14',
              }}
            />
          </span>
        </div>

        {/* ===================================================================
            TOOLBAR: Filter Button + Color Legend
            =================================================================== */}
        <div className="equipment-monitor-toolbar">
          {/* Filter Equipment Dropdown Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="equipment-monitor-filter-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
            >
              <span>Filter Equipment</span>
              <Icon name="filter_list" size="medium" />
            </button>

            {/* Simple Filter Dropdown */}
            {isFilterOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 8,
                  background: '#262626',
                  border: '1px solid #404040',
                  borderRadius: 8,
                  padding: 8,
                  zIndex: 20,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  minWidth: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    textAlign: 'left',
                    background: activeFilter === 'all' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: 4,
                    color: '#efefef',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                  onClick={() => {
                    setActiveFilter('all');
                    setIsFilterOpen(false);
                  }}
                >
                  All Equipment ({EQUIPMENT_MONITOR_ROWS.length})
                </button>
                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    textAlign: 'left',
                    background: activeFilter === 'running' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: 4,
                    color: '#7adb74',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                  onClick={() => {
                    setActiveFilter('running');
                    setIsFilterOpen(false);
                  }}
                >
                  Running Only
                </button>
                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    textAlign: 'left',
                    background: activeFilter === 'attention' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: 4,
                    color: '#fa6443',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                  onClick={() => {
                    setActiveFilter('attention');
                    setIsFilterOpen(false);
                  }}
                >
                  Attention Required (Faults / Blocked)
                </button>
              </div>
            )}
          </div>

          {/* Shared Legend */}
          <div className="equipment-monitor-legend" role="list" aria-label="Candybar Legend">
            <div className="equipment-monitor-legend-item" role="listitem">
              <div className="equipment-monitor-legend-swatch swatch-running" />
              <span>Running</span>
            </div>
            <div className="equipment-monitor-legend-item" role="listitem">
              <div className="equipment-monitor-legend-swatch swatch-slow-running" />
              <span>Slow Run</span>
            </div>
            <div className="equipment-monitor-legend-item" role="listitem">
              <div className="equipment-monitor-legend-swatch swatch-fault" />
              <span>Fault</span>
            </div>
            <div className="equipment-monitor-legend-item" role="listitem">
              <div className="equipment-monitor-legend-swatch swatch-planned" />
              <span>Planned Stop</span>
            </div>
            <div className="equipment-monitor-legend-item" role="listitem">
              <div className="equipment-monitor-legend-swatch swatch-blocked" />
              <span>Blocked/Starved</span>
            </div>
            <div className="equipment-monitor-legend-item" role="listitem">
              <div className="equipment-monitor-legend-dot" />
              <span>Info. Required</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            EQUIPMENT TIMELINE ROWS (8 Machines)
            =================================================================== */}
        <div className="equipment-monitor-table" ref={tableRef}>
          {filteredRows.map((row) => {
            const segments = row.timeframeSegments[timeframe] || [];
            const totalDuration = segments.reduce((sum, s) => sum + s.durationMinutes, 0) || 1;
            const height = row.candybarHeight || 44;

            return (
              <div key={row.id} className="equipment-monitor-row">
                {/* Left Machine Column (190px) */}
                <div className="equipment-monitor-row-info">
                  <h3 className="equipment-monitor-row-name" title={row.name}>
                    {row.name}
                  </h3>

                  <div className={`equipment-monitor-tag tag-${row.statusTag.variant}`}>
                    <span className="equipment-monitor-tag-icon">
                      <Icon name={row.statusTag.icon} size="small" />
                    </span>
                    <span className="equipment-monitor-tag-label">
                      {row.statusTag.label}
                    </span>
                  </div>
                </div>

                {/* Right Timeline Track */}
                <div className="equipment-monitor-track-col">
                  <div className="equipment-monitor-track" style={{ height }}>
                    {segments.map((seg) => {
                      const widthPercent = (seg.durationMinutes / totalDuration) * 100;
                      return (
                        <div
                          key={seg.id}
                          className={`equipment-monitor-segment status-${seg.status}`}
                          style={{
                            flex: `${seg.durationMinutes} 0 0%`,
                            minWidth: 4,
                          }}
                          onMouseEnter={(e) => handleSegmentHover(seg, e)}
                          onMouseLeave={handleSegmentLeave}
                          title={`${seg.title} (${seg.durationMinutes}m)`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Vertical Now Needle Indicator */}
          <div className="equipment-monitor-now-track">
            <div className="equipment-monitor-now-pill">
              <span>{markers.end}</span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#129f14',
                  boxShadow: '0 0 6px #129f14',
                }}
              />
            </div>
            <div className="equipment-monitor-now-line" />
          </div>

          {/* Interactive Popover Tooltip on Hover */}
          {hoveredSegment && popoverPos && (
            <div
              className="candybar-popover"
              style={{
                left: `${Math.max(160, Math.min(popoverPos.x, (tableRef.current?.offsetWidth || 1000) - 160))}px`,
                top: `${popoverPos.y - 12}px`,
              }}
              role="tooltip"
            >
              <div className="candybar-popover-content">
                <div className="candybar-popover-status-row">
                  <div className={`candybar-popover-badge badge-${hoveredSegment.status}`}>
                    {hoveredSegment.status === 'running' && <Icon name="play_arrow" size="small" />}
                    {hoveredSegment.status === 'slow-running' && <Icon name="speed" size="small" />}
                    {(hoveredSegment.status === 'stopped' ||
                      hoveredSegment.status === 'fault' ||
                      hoveredSegment.status === 'first-fault') && (
                      <Icon name="warning" size="small" />
                    )}
                    {(hoveredSegment.status === 'planned-dt' ||
                      hoveredSegment.status === 'planned-stop') && (
                      <Icon name="build" size="small" />
                    )}
                    {hoveredSegment.status === 'not-running' && <Icon name="hourglass_empty" size="small" />}
                    {(hoveredSegment.status === 'blocked' || hoveredSegment.status === 'starved') && (
                      <Icon name="warning" size="small" />
                    )}
                    <span className="candybar-popover-badge-text">
                      {hoveredSegment.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </div>

                  {hoveredSegment.isFirstFault && (
                    <span className="candybar-popover-tag first-fault-tag">First Fault</span>
                  )}
                  {hoveredSegment.noteRequired && (
                    <span className="candybar-popover-tag note-req-tag">Note Required</span>
                  )}
                </div>

                <h4 className="candybar-popover-title">{hoveredSegment.title}</h4>

                <div className="candybar-popover-meta">
                  <div className="candybar-meta-item">
                    <span className="candybar-meta-label">Time:</span>
                    <span className="candybar-meta-val">{hoveredSegment.timeRange}</span>
                  </div>
                  <div className="candybar-meta-item">
                    <span className="candybar-meta-label">Duration:</span>
                    <span className="candybar-meta-val">{hoveredSegment.durationMinutes}m</span>
                  </div>
                  {hoveredSegment.equipment && (
                    <div className="candybar-meta-item">
                      <span className="candybar-meta-label">Equipment:</span>
                      <span className="candybar-meta-val">{hoveredSegment.equipment}</span>
                    </div>
                  )}
                  {hoveredSegment.avgSpeed && (
                    <div className="candybar-meta-item">
                      <span className="candybar-meta-label">Speed:</span>
                      <span className="candybar-meta-val">{hoveredSegment.avgSpeed}</span>
                    </div>
                  )}
                </div>

                {hoveredSegment.operatorNote && (
                  <div className="candybar-operator-note-card">
                    <div className="candybar-operator-header">
                      <div className="candybar-avatar-initials">
                        {hoveredSegment.operatorNote.initials}
                      </div>
                      <span className="candybar-operator-name">
                        {hoveredSegment.operatorNote.author}
                      </span>
                    </div>
                    <p className="candybar-operator-text">
                      "{hoveredSegment.operatorNote.text}"
                    </p>
                  </div>
                )}
              </div>
              <div className="candybar-popover-arrow" />
            </div>
          )}
        </div>
      </div>
    </ModalWindow>
  );
}
