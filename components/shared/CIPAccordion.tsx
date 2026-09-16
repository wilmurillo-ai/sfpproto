'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';

export type CIPLineStatus = 'running' | 'attention' | 'stopped';
export type CIPInnerTab = 'progress' | 'stage';

export interface CIPTelemetryItem {
  current: number | string;
  unit: string;
  min: number | string;
  max: number | string;
  target: string;
  percentFill?: number;
}

export interface CIPLineData {
  id: string;
  lineName: string;
  status: CIPLineStatus;
  statusLabel?: string;
  recipeTarget: string;
  activeCIPId: string;
  activeCIPProducts: string;
  overallProgress: {
    minutes: string;
    percent: number;
    started: string;
    estCompletion: string;
  };
  currentStage: {
    name: string;
    status: string;
    minutes: string;
    percent: number;
    started: string;
    estCompletion: string;
  };
  telemetry: {
    temperature: CIPTelemetryItem;
    flowRate: CIPTelemetryItem;
    conductivity: CIPTelemetryItem;
  };
}

export interface CIPAccordionProps {
  line: CIPLineData;
  isOpen: boolean;
  onToggle: () => void;
  onViewDetail: (lineId: string) => void;
  className?: string;
}

export default function CIPAccordion({
  line,
  isOpen,
  onToggle,
  onViewDetail,
  className = '',
}: CIPAccordionProps) {
  const [activeTab, setActiveTab] = useState<CIPInnerTab>('progress');

  const isStopped = line.status === 'stopped';
  const isAttention = line.status === 'attention';

  // Status badge styling
  const getStatusBadge = () => {
    if (isStopped) {
      return (
        <span className="cip-line-status-badge status-stopped">
          <span className="cip-status-bullet" />
          {line.statusLabel || 'Stopped'}
        </span>
      );
    }
    if (isAttention) {
      return (
        <span className="cip-line-status-badge status-attention">
          <span className="cip-status-bullet" />
          {line.statusLabel || 'Attention'}
        </span>
      );
    }
    return (
      <span className="cip-line-status-badge status-running">
        <Icon name="play_arrow" size="small" className="cip-play-icon" />
        {line.statusLabel || 'Running'}
      </span>
    );
  };

  return (
    <div
      className={`cip-accordion-card ${isOpen ? 'is-open' : 'is-collapsed'} status-${line.status} ${className}`.trim()}
    >
      {/* ================= ACCORDION HEADER ================= */}
      <div
        className="cip-accordion-header"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* LEFT: Title + Status Badge */}
        <div className="cip-header-left">
          <h3 className="cip-accordion-title">{line.lineName}</h3>
          {getStatusBadge()}
        </div>

        {/* RIGHT: Recipe info + Chevron */}
        <div className="cip-header-right">
          <div className="cip-header-recipe-info">
            <span className="cip-recipe-label">Recipe · Target</span>
            <span className="cip-recipe-value">{line.recipeTarget}</span>
          </div>
          <button
            type="button"
            className="cip-accordion-chevron-btn"
            aria-label={isOpen ? `Collapse ${line.lineName}` : `Expand ${line.lineName}`}
            tabIndex={-1}
          >
            <Icon
              name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              size="medium"
            />
          </button>
        </div>
      </div>


      {/* ================= ACCORDION CONTENT ================= */}
      {isOpen && (
        <div className="cip-accordion-content">
          {/* Active CIP Banner */}
          <div className="cip-active-banner">
            <div className="cip-banner-left">
              <span className="cip-banner-code">{line.activeCIPId}</span>
            </div>
            <div className="cip-banner-right">
              <span className="cip-banner-transition">{line.activeCIPProducts}</span>
            </div>
          </div>

          {/* Inner Tabs: Progress vs Current Stage */}
          <div className="cip-inner-tabs-container">
            <div className="cip-inner-tab-bar" role="tablist">
              {/* Label on the left */}
              <span className="cip-progress-label">Overall Progress</span>
              {/* Pills on the right */}
              <div className="cip-inner-tab-bar-pills">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'progress'}
                  className={`cip-inner-tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
                  onClick={() => setActiveTab('progress')}
                >
                  Progress
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'stage'}
                  className={`cip-inner-tab-btn ${activeTab === 'stage' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stage')}
                >
                  Current Stage
                </button>
              </div>
            </div>

            {/* TAB 1: Overall Progress */}
            {activeTab === 'progress' && (
              <div className="cip-inner-tab-panel" role="tabpanel">
                <div className="cip-progress-headline">
                  <div className="cip-progress-stats">
                    <span className="cip-progress-time">{line.overallProgress.minutes}</span>
                    <span className="cip-progress-percent">{line.overallProgress.percent}% Complete</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="cip-progress-track">
                  <div
                    className="cip-progress-fill"
                    style={{ width: `${line.overallProgress.percent}%` }}
                  />
                </div>

                {/* Timestamps */}
                <div className="cip-progress-timestamps">
                  <span className="cip-time-item">
                    Started <strong>{line.overallProgress.started}</strong>
                  </span>
                  <span className="cip-time-item">
                    Est. Completion <strong>{line.overallProgress.estCompletion}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: Current Stage */}
            {activeTab === 'stage' && (
              <div className="cip-inner-tab-panel" role="tabpanel">
                <div className="cip-progress-headline">
                  <div className="cip-stage-title-group">
                    <span className="cip-stage-name">{line.currentStage.name}</span>
                    <span className="cip-stage-running-tag">
                      <Icon name="play_arrow" size="small" />
                      {line.currentStage.status}
                    </span>
                  </div>
                  <div className="cip-progress-stats">
                    <span className="cip-progress-time">{line.currentStage.minutes}</span>
                    <span className="cip-progress-percent">{line.currentStage.percent}% Complete</span>
                  </div>
                </div>

                {/* Stage Progress bar */}
                <div className="cip-progress-track">
                  <div
                    className="cip-progress-fill"
                    style={{ width: `${line.currentStage.percent}%` }}
                  />
                </div>

                {/* Stage Timestamps */}
                <div className="cip-progress-timestamps">
                  <span className="cip-time-item">
                    Started <strong>{line.currentStage.started}</strong>
                  </span>
                  <span className="cip-time-item">
                    Stage Est. Completion <strong>{line.currentStage.estCompletion}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Live Telemetry Section */}
          <div className="cip-telemetry-section">
            <div className="cip-telemetry-header">
              <h4 className="cip-telemetry-title">Live Telemetry</h4>
              <button
                type="button"
                className="cip-view-detail-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(line.id);
                }}
              >
                <span>View Detail</span>
                <Icon name="arrow_forward" size="large" />
              </button>
            </div>

            {/* 3 Telemetry Cards */}
            <div className="cip-telemetry-cards-grid">
              {/* Temperature */}
              <div className="cip-telemetry-card">
                <div className="cip-tel-card-header">
                  <span className="cip-tel-param-name">Temperature</span>
                  <span className="cip-tel-target-tag">Target {line.telemetry.temperature.target}</span>
                </div>
                <div className="cip-tel-reading">
                  <span className="cip-tel-val">{line.telemetry.temperature.current}</span>
                  <span className="cip-tel-unit">{line.telemetry.temperature.unit}</span>
                </div>
                <div className="cip-tel-gauge">
                  <div className="cip-tel-gauge-track">
                    <div className="cip-tel-target-zone" style={{ left: '33%', width: '33%' }} />
                    <div
                      className="cip-tel-current-pin"
                      style={{ left: `${line.telemetry.temperature.percentFill || 47}%` }}
                    />
                  </div>
                  <div className="cip-tel-limits">
                    <span>{line.telemetry.temperature.min}</span>
                    <span>{line.telemetry.temperature.max}</span>
                  </div>
                </div>
              </div>

              {/* Flow Rate */}
              <div className="cip-telemetry-card">
                <div className="cip-tel-card-header">
                  <span className="cip-tel-param-name">Flow Rate</span>
                  <span className="cip-tel-target-tag">Target {line.telemetry.flowRate.target}</span>
                </div>
                <div className="cip-tel-reading">
                  <span className="cip-tel-val">{line.telemetry.flowRate.current}</span>
                  <span className="cip-tel-unit">{line.telemetry.flowRate.unit}</span>
                </div>
                <div className="cip-tel-gauge">
                  <div className="cip-tel-gauge-track">
                    <div className="cip-tel-target-zone" style={{ left: '30%', width: '30%' }} />
                    <div
                      className="cip-tel-current-pin"
                      style={{ left: `${line.telemetry.flowRate.percentFill || 46}%` }}
                    />
                  </div>
                  <div className="cip-tel-limits">
                    <span>{line.telemetry.flowRate.min}</span>
                    <span>{line.telemetry.flowRate.max}</span>
                  </div>
                </div>
              </div>

              {/* Conductivity */}
              <div className="cip-telemetry-card">
                <div className="cip-tel-card-header">
                  <span className="cip-tel-param-name">Conductivity</span>
                  <span className="cip-tel-target-tag">Target {line.telemetry.conductivity.target}</span>
                </div>
                <div className="cip-tel-reading">
                  <span className="cip-tel-val">{line.telemetry.conductivity.current}</span>
                  <span className="cip-tel-unit">{line.telemetry.conductivity.unit}</span>
                </div>
                <div className="cip-tel-gauge">
                  <div className="cip-tel-gauge-track">
                    <div className="cip-tel-target-zone" style={{ left: '32%', width: '28%' }} />
                    <div
                      className="cip-tel-current-pin"
                      style={{ left: `${line.telemetry.conductivity.percentFill || 44}%` }}
                    />
                  </div>
                  <div className="cip-tel-limits">
                    <span>{line.telemetry.conductivity.min}</span>
                    <span>{line.telemetry.conductivity.max}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
