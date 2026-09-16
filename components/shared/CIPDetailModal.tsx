'use client';

import React, { useState } from 'react';
import ModalWindow from './ModalWindow';
import { Icon } from '@/components/ui';

export interface CIPDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cipId?: string;
  lineName?: string;
  productTransition?: string;
}

export default function CIPDetailModal({
  isOpen,
  onClose,
  cipId = 'CIP-123456790',
  lineName = 'CIP Line 1',
  productTransition = 'Mirinda → KAS Naranja',
}: CIPDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'phases' | 'log'>('phases');

  const timeTicks = [
    '11:45am',
    '11:50am',
    '11:55am',
    '12:00pm',
    '12:05pm',
    '12:10pm',
    '12:15pm',
    '12:20pm',
    '12:25pm',
    '12:30pm',
  ];

  // Phase color tokens matching Figma:
  // completed/alert  = warm red background, light-red text
  // active/running   = deep green background, green text
  // queued/pending   = dark neutral background, muted text
  const phases = [
    {
      name: 'Pending Clip',
      duration: '11m',
      state: 'completed-alert',
      widthPct: 11.5,
      bg: 'rgba(227, 65, 25, 0.22)',
      border: 'rgba(250, 100, 67, 0.4)',
      text: '#fa6443',
    },
    {
      name: 'Pre Rinsing',
      duration: '15m',
      state: 'active-ok',
      widthPct: 26.8,
      bg: 'rgba(18, 159, 20, 0.25)',
      border: 'rgba(18, 159, 20, 0.5)',
      text: '#86efac',
    },
    {
      name: 'Rinsing',
      duration: '--',
      state: 'queued',
      widthPct: 23.4,
      bg: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.08)',
      text: '#838383',
    },
    {
      name: 'Acid Cleaning',
      duration: '--',
      state: 'queued',
      widthPct: 26.8,
      bg: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.08)',
      text: '#838383',
    },
    {
      name: 'Rinsing',
      duration: '--',
      state: 'queued',
      widthPct: 11.5,
      bg: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.08)',
      text: '#838383',
    },
  ];

  // Helper: build a smooth cubic-bezier SVG path from an array of [x, y] points
  function smoothPath(pts: [number, number][]): string {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev[0] + curr[0]) / 2;
      d += ` C ${cpx} ${prev[1]}, ${cpx} ${curr[1]}, ${curr[0]} ${curr[1]}`;
    }
    return d;
  }

  // Temperature: Send & Return curves (stops at needle x=383)
  const tempSendPts: [number, number][] = [
    [0, 95], [60, 90], [130, 82], [200, 68], [270, 52], [340, 44], [383, 44],
  ];
  const tempReturnPts: [number, number][] = [
    [0, 108], [60, 102], [130, 95], [200, 80], [270, 66], [340, 55], [383, 54],
  ];

  // Flow Rate: Send & Return curves (stops at needle x=383)
  const flowSendPts: [number, number][] = [
    [0, 102], [60, 96], [130, 84], [200, 60], [270, 48], [340, 41], [383, 41],
  ];
  const flowReturnPts: [number, number][] = [
    [0, 114], [60, 108], [130, 98], [200, 76], [270, 58], [340, 51], [383, 51],
  ];

  // Conductivity: Send & Return curves (stops at needle x=383)
  const condSendPts: [number, number][] = [
    [0, 110], [60, 104], [130, 92], [200, 70], [270, 56], [340, 50], [383, 50],
  ];
  const condReturnPts: [number, number][] = [
    [0, 118], [60, 112], [130, 102], [200, 84], [270, 68], [340, 60], [383, 59],
  ];

  return (
    <ModalWindow
      isOpen={isOpen}
      onClose={onClose}
      title={`CIP Detail: ${cipId}`}
      subtitle=""
      icon="cleaning_services"
      size="fullscreen"
      className="cip-detail-modal-root"
      headerActions={
        <div className="cip-detail-header-meta">
          <span className="cip-meta-shift">12:45pm Shift 1</span>
          <span className="cip-meta-dot">·</span>
          <span className="cip-meta-updated">Last updated: 4 mins ago</span>
        </div>
      }
    >
      <div className="cip-detail-content-wrapper">
        {/* ── Nav Header: CIP ID on left, Switcher Pills on right (no summary bar) ── */}
        <div className="cip-modal-header-nav">
          <h2 className="cip-modal-entity-title">{cipId}</h2>
          <div className="cip-modal-pill-switcher" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'phases'}
              className={`cip-modal-pill-btn ${activeTab === 'phases' ? 'active' : ''}`}
              onClick={() => setActiveTab('phases')}
            >
              Phases
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'log'}
              className={`cip-modal-pill-btn ${activeTab === 'log' ? 'active' : ''}`}
              onClick={() => setActiveTab('log')}
            >
              Log
            </button>
          </div>
        </div>

        {/* ── PHASES TAB ── */}
        {activeTab === 'phases' ? (
          <div className="cip-timeline-chart-container">
            {/* TIME AXIS */}
            <div className="cip-timeline-axis-row">
              <div className="cip-chart-label-spacer" />
              <div className="cip-timeline-ticks-wrapper">
                {timeTicks.map((tick) => (
                  <div key={tick} className="cip-timeline-tick">
                    <span className="cip-tick-label">{tick}</span>
                  </div>
                ))}
                {/* Yellow "Now" badge and stem perfectly aligned with the needle at 38.3% */}
                <div className="cip-now-axis-indicator" style={{ left: '38.3%' }}>
                  <span className="cip-now-badge">Now</span>
                  <div className="cip-now-needle-stem" />
                </div>
              </div>
            </div>

            {/* PHASES TRACK */}
            <div className="cip-timeline-phases-row">
              <div className="cip-chart-label-spacer">
                <span className="cip-phases-row-label">Phases</span>
              </div>
              <div className="cip-phases-track">
                {phases.map((p, i) => (
                  <div
                    key={i}
                    className={`cip-phase-pill phase-${p.state}`}
                    style={{
                      width: `${p.widthPct}%`,
                      backgroundColor: p.bg,
                      borderColor: p.border,
                      color: p.text,
                    }}
                  >
                    <span className="cip-phase-name">{p.name}</span>
                    <span className="cip-phase-dur">{p.duration}</span>
                  </div>
                ))}
                {/* Now indicator line (yellow) */}
                <div className="cip-now-vertical-line" style={{ left: '38.3%' }} />
              </div>
            </div>

            {/* METRIC CHART ROWS - ZERO SPACING BETWEEN ROWS */}
            <div className="cip-metric-charts-group">
              {/* Temperature */}
              <div className="cip-metric-chart-row">
                <div className="cip-metric-info-col">
                  <span className="cip-metric-title">Temperature</span>
                  <div className="cip-metric-value-row">
                    <Icon name="thermostat" size="medium" className="cip-metric-icon" />
                    <span className="cip-metric-current-val">80°C</span>
                  </div>
                  <span className="cip-metric-target-desc">Target 80 – 85 °C</span>
                </div>
                <div className="cip-metric-svg-wrapper">
                  <svg className="cip-chart-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                    <line x1="0" y1="25" x2="1000" y2="25" stroke="#2d2d2d" strokeDasharray="3 3" />
                    <line x1="0" y1="65" x2="1000" y2="65" stroke="#2d2d2d" strokeDasharray="3 3" />
                    <line x1="0" y1="105" x2="1000" y2="105" stroke="#2d2d2d" strokeDasharray="3 3" />
                    {/* Min/max threshold dashed guidelines */}
                    <line x1="0" y1="78" x2="1000" y2="78" stroke="#838383" strokeWidth="1.5" strokeDasharray="6 4" />
                    {/* Send curve - stops at needle (x=383) */}
                    <path d={smoothPath(tempSendPts)} fill="none" stroke="#60a3fc" strokeWidth="2.5" />
                    <circle cx="383" cy="44" r="3.5" fill="#60a3fc" />
                    {/* Return curve - stops at needle (x=383) */}
                    <path d={smoothPath(tempReturnPts)} fill="none" stroke="#fe7c5f" strokeWidth="2.5" />
                    <circle cx="383" cy="54" r="3.5" fill="#fe7c5f" />
                    {/* Now needle - yellow, matches token var(--yellow-250, #ebcd07) */}
                    <line x1="383" y1="0" x2="383" y2="130" stroke="#ebcd07" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                </div>
              </div>

              {/* Flow Rate */}
              <div className="cip-metric-chart-row">
                <div className="cip-metric-info-col">
                  <span className="cip-metric-title">Flow Rate</span>
                  <div className="cip-metric-value-row">
                    <Icon name="graphic_eq" size="medium" className="cip-metric-icon" />
                    <span className="cip-metric-current-val">120 L/m</span>
                  </div>
                  <span className="cip-metric-target-desc">Target 115 – 130 L/m</span>
                </div>
                <div className="cip-metric-svg-wrapper">
                  <svg className="cip-chart-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                    <line x1="0" y1="25" x2="1000" y2="25" stroke="#2d2d2d" strokeDasharray="3 3" />
                    <line x1="0" y1="65" x2="1000" y2="65" stroke="#2d2d2d" strokeDasharray="3 3" />
                    <line x1="0" y1="105" x2="1000" y2="105" stroke="#2d2d2d" strokeDasharray="3 3" />
                    {/* Min/max threshold dashed guidelines */}
                    <line x1="0" y1="84" x2="1000" y2="84" stroke="#838383" strokeWidth="1.5" strokeDasharray="6 4" />
                    {/* Send curve - stops at needle (x=383) */}
                    <path d={smoothPath(flowSendPts)} fill="none" stroke="#60a3fc" strokeWidth="2.5" />
                    <circle cx="383" cy="41" r="3.5" fill="#60a3fc" />
                    {/* Return curve - stops at needle (x=383) */}
                    <path d={smoothPath(flowReturnPts)} fill="none" stroke="#fe7c5f" strokeWidth="2.5" />
                    <circle cx="383" cy="51" r="3.5" fill="#fe7c5f" />
                    {/* Now needle - yellow */}
                    <line x1="383" y1="0" x2="383" y2="130" stroke="#ebcd07" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                </div>
              </div>

              {/* Conductivity */}
              <div className="cip-metric-chart-row">
                <div className="cip-metric-info-col">
                  <span className="cip-metric-title">Conductivity</span>
                  <div className="cip-metric-value-row">
                    <Icon name="usb" size="medium" className="cip-metric-icon" />
                    <span className="cip-metric-current-val">12 mS/cm</span>
                  </div>
                  <span className="cip-metric-target-desc">Target 10 – 15 mS/cm</span>
                </div>
                <div className="cip-metric-svg-wrapper">
                  <svg className="cip-chart-svg" viewBox="0 0 1000 130" preserveAspectRatio="none">
                    <line x1="0" y1="25" x2="1000" y2="25" stroke="#2d2d2d" strokeDasharray="3 3" />
                    <line x1="0" y1="65" x2="1000" y2="65" stroke="#2d2d2d" strokeDasharray="3 3" />
                    <line x1="0" y1="105" x2="1000" y2="105" stroke="#2d2d2d" strokeDasharray="3 3" />
                    {/* Min/max threshold dashed guidelines */}
                    <line x1="0" y1="88" x2="1000" y2="88" stroke="#838383" strokeWidth="1.5" strokeDasharray="6 4" />
                    {/* Send curve - stops at needle (x=383) */}
                    <path d={smoothPath(condSendPts)} fill="none" stroke="#60a3fc" strokeWidth="2.5" />
                    <circle cx="383" cy="50" r="3.5" fill="#60a3fc" />
                    {/* Return curve - stops at needle (x=383) */}
                    <path d={smoothPath(condReturnPts)} fill="none" stroke="#fe7c5f" strokeWidth="2.5" />
                    <circle cx="383" cy="59" r="3.5" fill="#fe7c5f" />
                    {/* Now needle - yellow */}
                    <line x1="383" y1="0" x2="383" y2="130" stroke="#ebcd07" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Legend - aligned right per Figma */}
            <div className="cip-chart-legend-bar">
              <div className="cip-legend-item">
                <span className="cip-legend-dot" style={{ backgroundColor: '#60a3fc' }} />
                <span className="cip-legend-label">Send</span>
              </div>
              <div className="cip-legend-item">
                <span className="cip-legend-dot" style={{ backgroundColor: '#fe7c5f' }} />
                <span className="cip-legend-label">Return</span>
              </div>
              <div className="cip-legend-item">
                <span className="cip-legend-dash" style={{ borderColor: '#838383' }} />
                <span className="cip-legend-label">Min/max</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── LOG TAB ── */
          <div className="cip-modal-log-tab">
            <table className="cip-log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Event</th>
                  <th>Stage</th>
                  <th>Operator</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>14:09:12</td>
                  <td>CIP Cycle Initiated</td>
                  <td>Pending Clip</td>
                  <td>Automated System</td>
                  <td><span className="cip-log-tag success">Completed</span></td>
                </tr>
                <tr>
                  <td>14:15:30</td>
                  <td>Pre-Rinse Cycle Started</td>
                  <td>Pre Rinsing</td>
                  <td>Automated System</td>
                  <td><span className="cip-log-tag success">Completed</span></td>
                </tr>
                <tr>
                  <td>14:20:05</td>
                  <td>Caustic Wash Commenced</td>
                  <td>Alkali Cleaning</td>
                  <td>Chris G.</td>
                  <td><span className="cip-log-tag active">In Progress</span></td>
                </tr>
                <tr>
                  <td>14:22:18</td>
                  <td>Conductivity Target Achieved (78.53m S/Cm)</td>
                  <td>Alkali Cleaning</td>
                  <td>Sensor S-104</td>
                  <td><span className="cip-log-tag info">Logged</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ModalWindow>
  );
}
