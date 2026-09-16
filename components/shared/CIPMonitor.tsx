'use client';

import React, { useState } from 'react';
import ModalWindow from './ModalWindow';
import TankKPICard from './TankKPICard';
import { Icon } from '@/components/ui';

export interface CIPMonitorProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Initial CIP line selected */
  initialLine?: string;
}

interface CIPLineData {
  id: string;
  name: string;
  status: 'Running' | 'Stopped' | 'Attention' | 'Standby';
  statusDotColor: string;
  recipe: string;
  targetTank: string;
  activeCipId: string;
  transition: string;
  overallProgress: {
    elapsedMin: number;
    totalMin: number;
    percent: number;
    started: string;
    estCompletion: string;
    remainingMin: number;
    progressBarVariant?: 'blue' | 'red';
  };
  currentStage: {
    name: string;
    status: string;
    elapsedMin: number;
    totalMin: number;
    percent: number;
    started: string;
    estCompletion: string;
    remainingMin: number;
  };
  telemetry: {
    id: string;
    label: string;
    value: string;
    unit: string;
    targetRange: string;
    currentValueNum: number;
    minScale: number;
    maxScale: number;
    targetMin: number;
    targetMax: number;
    isAlert?: boolean;
  }[];
}

const CIP_LINES_DATA: Record<string, CIPLineData> = {
  line1: {
    id: 'line1',
    name: 'CIP Line 1',
    status: 'Running',
    statusDotColor: '#129f14',
    recipe: 'Type 2',
    targetTank: 'Tank-01',
    activeCipId: 'CIP-123456790',
    transition: 'Mirinda → KAS Naranja',
    overallProgress: {
      elapsedMin: 11,
      totalMin: 12,
      percent: 92,
      started: '14:09',
      estCompletion: '14:21',
      remainingMin: 12,
    },
    currentStage: {
      name: 'Alkali Cleaning',
      status: 'Running',
      elapsedMin: 11,
      totalMin: 12,
      percent: 88,
      started: '14:09',
      estCompletion: '14:21',
      remainingMin: 12,
    },
    telemetry: [
      {
        id: 'temp-1',
        label: 'Supply Temperature',
        value: '82',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 82,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
      },
      {
        id: 'temp-2',
        label: 'Return Temperature',
        value: '82',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 82,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
      },
      {
        id: 'temp-3',
        label: 'Tank Temperature',
        value: '82',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 82,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
      },
    ],
  },
  line2: {
    id: 'line2',
    name: 'CIP Line 2',
    status: 'Running',
    statusDotColor: '#129f14',
    recipe: 'Type 1',
    targetTank: 'Tank-02',
    activeCipId: 'CIP-123456791',
    transition: 'Pepsi Max → Diet Pepsi',
    overallProgress: {
      elapsedMin: 8,
      totalMin: 15,
      percent: 53,
      started: '14:15',
      estCompletion: '14:30',
      remainingMin: 7,
    },
    currentStage: {
      name: 'Pre-Rinse',
      status: 'Running',
      elapsedMin: 4,
      totalMin: 5,
      percent: 80,
      started: '14:15',
      estCompletion: '14:20',
      remainingMin: 1,
    },
    telemetry: [
      {
        id: 'temp-1',
        label: 'Supply Temperature',
        value: '79',
        unit: '°C',
        targetRange: '75 – 82 °C',
        currentValueNum: 79,
        minScale: 70,
        maxScale: 90,
        targetMin: 75,
        targetMax: 82,
      },
      {
        id: 'temp-2',
        label: 'Return Temperature',
        value: '78',
        unit: '°C',
        targetRange: '75 – 82 °C',
        currentValueNum: 78,
        minScale: 70,
        maxScale: 90,
        targetMin: 75,
        targetMax: 82,
      },
      {
        id: 'temp-3',
        label: 'Tank Temperature',
        value: '80',
        unit: '°C',
        targetRange: '75 – 82 °C',
        currentValueNum: 80,
        minScale: 70,
        maxScale: 90,
        targetMin: 75,
        targetMax: 82,
      },
    ],
  },
  line3: {
    id: 'line3',
    name: 'CIP Line 3',
    status: 'Running',
    statusDotColor: '#129f14',
    recipe: 'Sanitize',
    targetTank: 'Tank-03',
    activeCipId: 'CIP-123456792',
    transition: '7UP Free → 7UP Regular',
    overallProgress: {
      elapsedMin: 10,
      totalMin: 10,
      percent: 100,
      started: '14:00',
      estCompletion: '14:10',
      remainingMin: 0,
    },
    currentStage: {
      name: 'Final Sanitization',
      status: 'Running',
      elapsedMin: 9,
      totalMin: 10,
      percent: 90,
      started: '14:00',
      estCompletion: '14:10',
      remainingMin: 1,
    },
    telemetry: [
      {
        id: 'temp-1',
        label: 'Supply Temperature',
        value: '83',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 83,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
      },
      {
        id: 'temp-2',
        label: 'Return Temperature',
        value: '82',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 82,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
      },
      {
        id: 'temp-3',
        label: 'Tank Temperature',
        value: '84',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 84,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
      },
    ],
  },
  line4: {
    id: 'line4',
    name: 'CIP Line 4',
    status: 'Stopped',
    statusDotColor: '#fa6443',
    recipe: 'Type 2',
    targetTank: 'Tank-01',
    activeCipId: 'CIP-123456791',
    transition: 'Pepsi Zero Cherry → Bitter KAS',
    overallProgress: {
      elapsedMin: 11,
      totalMin: 12,
      percent: 92,
      started: '14:09',
      estCompletion: '14:21',
      remainingMin: 12,
      progressBarVariant: 'red',
    },
    currentStage: {
      name: 'Alkali Cleaning',
      status: 'Running',
      elapsedMin: 11,
      totalMin: 12,
      percent: 88,
      started: '14:09',
      estCompletion: '14:21',
      remainingMin: 12,
    },
    telemetry: [
      {
        id: 'temp-1',
        label: 'Temperature',
        value: '88',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 88,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
        isAlert: true,
      },
      {
        id: 'temp-2',
        label: 'Temperature',
        value: '82',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 82,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
        isAlert: false,
      },
      {
        id: 'temp-3',
        label: 'Temperature',
        value: '82',
        unit: '°C',
        targetRange: '80 – 85 °C',
        currentValueNum: 82,
        minScale: 75,
        maxScale: 90,
        targetMin: 80,
        targetMax: 85,
        isAlert: false,
      },
    ],
  },
};

export default function CIPMonitor({
  isOpen,
  onClose,
  initialLine = 'line1',
}: CIPMonitorProps) {
  const [selectedLineId, setSelectedLineId] = useState<string>(initialLine);
  const [isKpiExpanded, setIsKpiExpanded] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'phases' | 'log'>('overview');

  const lineData = CIP_LINES_DATA[selectedLineId] || CIP_LINES_DATA.line1;

  // Header Actions (Shift & Last updated)
  const headerActionsElement = (
    <div className="cip-monitor-header-actions">
      <div className="cip-monitor-shift-pill">
        <span className="cip-shift-time">12:45pm</span>
        <span className="cip-shift-name">Shift 1</span>
      </div>
      <span className="cip-last-updated-text">Last updated: 4 mins ago</span>
    </div>
  );

  return (
    <ModalWindow
      isOpen={isOpen}
      onClose={onClose}
      size="fullscreen"
      icon="cleaning_services"
      title="CIP Monitor"
      subtitle=""
      headerActions={headerActionsElement}
      className="cip-monitor-modal"
    >
      <div className="cip-monitor-root">
        {/* ===================================================================
            1. COLLAPSIBLE TANK STATUS KPI STRIP
            =================================================================== */}
        <section
          className={`cip-tank-section ${!isKpiExpanded ? 'is-collapsed' : ''}`}
          aria-label="Tank Status KPIs"
        >
          <div className="cip-tank-wrapper">
            <h2 className="cip-tank-section-title">Tank Status</h2>

            <div className="cip-tank-grid">
              {/* 1. Hot Water */}
              <TankKPICard
                id="tank-kpi-hot-water"
                tankId="Tank-01"
                title="Hot Water"
                level={81}
                variant="green"
                temperature={80}
                minTemp="75ºC min"
                maxTemp="81ºC max"
              />

              {/* 2. Rinse */}
              <TankKPICard
                id="tank-kpi-rinse"
                tankId="Tank-01"
                title="Rinse"
                level={81}
                variant="green"
                temperature={80}
                minTemp="75ºC min"
                maxTemp="81ºC max"
              />

              {/* 3. Acid */}
              <TankKPICard
                id="tank-kpi-acid"
                tankId="Tank-01"
                title="Acid"
                level={77}
                variant="yellow"
                temperature={80}
                minTemp="75ºC min"
                maxTemp="81ºC max"
              />

              {/* 4. Caustic (with warning alert) */}
              <TankKPICard
                id="tank-kpi-caustic"
                tankId="Tank-01"
                title="Caustic"
                level={15}
                variant="red"
                temperature={86}
                minTemp="75ºC min"
                maxTemp="81ºC max"
                alertMessage="Conductivity: 78.76m S/Cm"
              />
            </div>
          </div>

          {/* Centered KPI Collapse/Expand Toggle Divider */}
          <div className="cip-collapse-divider">
            <button
              type="button"
              className="cip-collapse-btn"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
              aria-label={isKpiExpanded ? 'Collapse Tank Status' : 'Expand Tank Status'}
              title={isKpiExpanded ? 'Collapse Tank Status' : 'Expand Tank Status'}
            >
              <Icon
                name={isKpiExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                size="large"
              />
            </button>
          </div>
        </section>

        {/* ===================================================================
            2. SECONDARY TABS: CIP LINE / SLOT SELECTOR
            =================================================================== */}
        <div className="cip-lines-selector-container">
          <div className="cip-lines-pill-nav" role="tablist" aria-label="CIP Lines">
            {Object.values(CIP_LINES_DATA).map((line) => {
              const isSelected = selectedLineId === line.id;
              return (
                <button
                  key={line.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`cip-line-pill-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setSelectedLineId(line.id)}
                >
                  <span className="cip-line-pill-label">{line.name}</span>
                  <span
                    className="cip-line-status-dot"
                    style={{ backgroundColor: line.statusDotColor }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            3. MAIN CONTENT: SUB-NAV TABS & OVERVIEW SECTION
            =================================================================== */}
        <div className="cip-main-layout">
          {/* Left Column: Sub-navigation Tabs (Overview, Phases, Log) */}
          <aside className="cip-sub-nav" aria-label="CIP Details Navigation">
            <div className="cip-sub-nav-card">
              <button
                type="button"
                className={`cip-sub-nav-item ${activeSubTab === 'overview' ? 'is-active' : ''}`}
                onClick={() => setActiveSubTab('overview')}
              >
                Overview
              </button>
              <button
                type="button"
                className={`cip-sub-nav-item ${activeSubTab === 'phases' ? 'is-active' : ''}`}
                onClick={() => setActiveSubTab('phases')}
                title="Phases view (coming soon)"
              >
                Phases
              </button>
              <button
                type="button"
                className={`cip-sub-nav-item ${activeSubTab === 'log' ? 'is-active' : ''}`}
                onClick={() => setActiveSubTab('log')}
                title="Log view (coming soon)"
              >
                Log
              </button>
            </div>
          </aside>

          {/* Right Column: Overview Panel */}
          <main className="cip-overview-panel">
            {activeSubTab === 'overview' ? (
              <div className="cip-overview-content">
                {/* Panel Top Header: Line Title + Running Pill & Recipe/Target */}
                <div className="cip-overview-header">
                  <div className="cip-title-status-group">
                    <h2 className="cip-line-main-title">{lineData.name}</h2>
                    <div className={`cip-running-tag status-${lineData.status.toLowerCase()}`}>
                      <Icon
                        name={lineData.status === 'Stopped' ? 'warning' : 'play_arrow'}
                        size="small"
                        className="cip-tag-play-icon"
                      />
                      <span>{lineData.status}</span>
                    </div>
                  </div>

                  <div className="cip-recipe-target-col">
                    <span className="cip-recipe-target-label">Recipe · Target</span>
                    <div className="cip-recipe-target-val">
                      <span>{lineData.recipe} →</span>
                      <strong className="cip-target-tank-highlight">
                        {' '}
                        {lineData.targetTank}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Active CIP Green or Stopped Red/Burgundy Banner */}
                <div className={`cip-active-banner ${lineData.status === 'Stopped' ? 'is-stopped' : ''}`}>
                  <div className="cip-active-info-col">
                    <span className="cip-active-label">Active CIP</span>
                    <strong className="cip-active-code">{lineData.activeCipId}</strong>
                  </div>
                  <div className="cip-active-transition">
                    <strong>{lineData.transition}</strong>
                  </div>
                </div>

                {/* Overall Progress Block */}
                <section className="cip-overall-progress-block">
                  <h3 className="cip-block-heading">Overall Progress</h3>

                  <div className="cip-progress-metrics-row">
                    <span className="cip-progress-time-count">
                      {lineData.overallProgress.elapsedMin}/{lineData.overallProgress.totalMin} min
                    </span>
                    <span className="cip-progress-percent-count">
                      {lineData.overallProgress.percent}% Complete
                    </span>
                  </div>

                  {/* Progress Bar (20px track, blue or red fill) */}
                  <div className="cip-progress-track is-thick" aria-hidden="true">
                    <div
                      className={`cip-progress-fill ${
                        lineData.overallProgress.progressBarVariant === 'red'
                          ? 'is-red'
                          : 'is-blue'
                      }`}
                      style={{ width: `${lineData.overallProgress.percent}%` }}
                    />
                  </div>

                  {/* Started & Est. Completion Row */}
                  <div className="cip-timing-meta-row">
                    <div className="cip-timing-meta-col">
                      <span className="cip-meta-label">Started</span>
                      <span className="cip-meta-val">{lineData.overallProgress.started}</span>
                    </div>
                    <div className="cip-timing-meta-col">
                      <span className="cip-meta-label">Est. Completion</span>
                      <span className="cip-meta-val">
                        {lineData.overallProgress.estCompletion}{' '}
                        <span className="cip-meta-sub">
                          (in {lineData.overallProgress.remainingMin} min)
                        </span>
                      </span>
                    </div>
                  </div>
                </section>

                {/* Current Stage Card */}
                <section className="cip-current-stage-card">
                  <div className="cip-stage-top-row">
                    <div className="cip-stage-title-col">
                      <span className="cip-stage-label">Current Stage</span>
                      <h4 className="cip-stage-name">{lineData.currentStage.name}</h4>
                    </div>
                    <div className={`cip-running-tag status-${lineData.currentStage.status.toLowerCase()}`}>
                      <Icon name="play_arrow" size="small" className="cip-tag-play-icon" />
                      <span>{lineData.currentStage.status}</span>
                    </div>
                  </div>

                  {/* Stage Progress Row */}
                  <div className="cip-progress-metrics-row">
                    <span className="cip-progress-time-count">
                      {lineData.currentStage.elapsedMin}/{lineData.currentStage.totalMin} min
                    </span>
                    <span className="cip-progress-percent-count">
                      {lineData.currentStage.percent}% Complete
                    </span>
                  </div>

                  {/* Stage Progress Bar (16px track, blue fill) */}
                  <div className="cip-progress-track is-medium" aria-hidden="true">
                    <div
                      className="cip-progress-fill is-blue"
                      style={{ width: `${lineData.currentStage.percent}%` }}
                    />
                  </div>

                  {/* Stage Timings */}
                  <div className="cip-timing-meta-row">
                    <div className="cip-timing-meta-col">
                      <span className="cip-meta-label">Started</span>
                      <span className="cip-meta-val">{lineData.currentStage.started}</span>
                    </div>
                    <div className="cip-timing-meta-col">
                      <span className="cip-meta-label">Stage Est. Completion</span>
                      <span className="cip-meta-val">
                        {lineData.currentStage.estCompletion}{' '}
                        <span className="cip-meta-sub">
                          (in {lineData.currentStage.remainingMin} min)
                        </span>
                      </span>
                    </div>
                  </div>
                </section>

                {/* Live Telemetry Section */}
                <section className="cip-telemetry-section">
                  <div className="cip-telemetry-header">
                    <h3 className="cip-block-heading">Live Telemetry</h3>
                    <button
                      type="button"
                      className="cip-view-trend-link"
                      onClick={() => {}}
                    >
                      <span>View Trend</span>
                      <Icon name="arrow_forward" size="small" />
                    </button>
                  </div>

                  {/* 3 Telemetry Cards */}
                  <div className="cip-telemetry-grid">
                    {lineData.telemetry.map((t) => {
                      // Calculate positions for target pill and dot on scale
                      const totalScale = t.maxScale - t.minScale;
                      const targetLeftPct = ((t.targetMin - t.minScale) / totalScale) * 100;
                      const targetWidthPct = ((t.targetMax - t.targetMin) / totalScale) * 100;
                      const currentValPct = Math.max(
                        0,
                        Math.min(100, ((t.currentValueNum - t.minScale) / totalScale) * 100)
                      );

                      return (
                        <div
                          key={t.id}
                          className={`cip-telemetry-card ${t.isAlert ? 'is-alert' : ''}`}
                        >
                          <div className="cip-telem-info">
                            <span className="cip-telem-label">Temperature</span>
                            <div className="cip-telem-val-row">
                              <span className="cip-telem-val">
                                {t.value} {t.unit}
                              </span>
                            </div>
                            <span className="cip-telem-range">{t.targetRange}</span>
                          </div>

                          {/* Range Bar Gauge */}
                          <div className="cip-gauge-wrapper">
                            <div className="cip-gauge-track">
                              {/* Green Target Zone */}
                              <div
                                className="cip-gauge-target"
                                style={{
                                  left: `${targetLeftPct}%`,
                                  width: `${targetWidthPct}%`,
                                }}
                              />
                              {/* Indicator Dot */}
                              <div
                                className="cip-gauge-dot"
                                style={{ left: `calc(${currentValPct}% - 4px)` }}
                              />
                            </div>

                            {/* Scale Bounds */}
                            <div className="cip-gauge-bounds">
                              <span>{t.minScale}°</span>
                              <span>{t.maxScale}°</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : (
              <div className="cip-placeholder-tab-view">
                <Icon name="construction" size="large" />
                <h3>{activeSubTab === 'phases' ? 'Phases' : 'Log'} View</h3>
                <p>This sub-section will be available in an upcoming release.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ModalWindow>
  );
}
