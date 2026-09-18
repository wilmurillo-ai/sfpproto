'use client';

import React, { useState, useMemo } from 'react';
import { CIPDayData, CIPLine, CIP_LINES, getDeviationTimeSeries } from './mockData';
import { CIPKPIKey } from './CIPKPIStrip';

type BreakdownTab = 'distribution' | 'deviations';

interface CIPDayBreakdownProps {
  days: CIPDayData[];
  selectedDayIndex: number | null;
  selectedLines: CIPLine[];
  activeKPI: CIPKPIKey | null;
}

interface BreakdownRow {
  name: string;
  pct: number;
  subtext: string;
}

function BreakdownColumn({ title, rows }: { title: string; rows: BreakdownRow[] }) {
  return (
    <div className="cip-breakdown-col">
      <h3 className="cip-breakdown-col-title">{title}</h3>
      <div className="cip-breakdown-col-items">
        {rows.map((row) => {
          const isWarning = row.pct < 75;
          const barColor = isWarning ? 'var(--orange-400, #e78710)' : 'var(--blue-400, #4484f4)';

          return (
            <div key={row.name} className="cip-breakdown-row">
              <div className="cip-breakdown-row-top">
                <span className="cip-breakdown-row-name">{row.name}</span>
                <span className="cip-breakdown-row-pct">{row.pct}%</span>
              </div>
              <div className="cip-breakdown-bar-track">
                <div
                  className="cip-breakdown-bar-fill"
                  style={{ width: `${row.pct}%`, background: barColor }}
                />
              </div>
              <div className="cip-breakdown-row-subtext">{row.subtext}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeviationChart({ points }: { points: Array<{ dateLabel: string; offTime: number; onTime: number }> }) {
  if (points.length === 0) return null;

  const svgH = 180;
  const maxY = 100;
  const n = points.length;

  const toX = (i: number) => (i / Math.max(n - 1, 1)) * 100;
  const toY = (val: number) => svgH - (val / maxY) * svgH;

  const offTimePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)},${toY(p.offTime)}`)
    .join(' ');
  const areaPath = `${offTimePath} L ${toX(n - 1)},${svgH} L 0,${svgH} Z`;

  return (
    <div className="cip-deviation-chart">
      <div className="cip-deviation-legend">
        <span className="cip-dev-legend-item">
          <span className="cip-dev-dot" style={{ background: 'var(--orange-400, #e78710)' }} />
          Off-Time Deviations
        </span>
        <span className="cip-dev-legend-item">
          <span className="cip-dev-dot" style={{ background: 'var(--blue-400, #4484f4)' }} />
          On-Time Baseline
        </span>
      </div>

      <div className="cip-deviation-svg-wrap">
        <svg
          viewBox={`0 0 100 ${svgH}`}
          preserveAspectRatio="none"
          className="cip-deviation-svg"
        >
          <defs>
            <linearGradient id="devGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e78710" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e78710" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#devGradient)" />
          <path d={offTimePath} fill="none" stroke="#e78710" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export default function CIPDayBreakdown({
  days,
  selectedDayIndex,
  selectedLines,
}: CIPDayBreakdownProps) {
  const [activeTab, setActiveTab] = useState<BreakdownTab>('distribution');

  // Identify active day data if a specific day is selected, else aggregate across days
  const activeDay: CIPDayData | null = useMemo(() => {
    if (selectedDayIndex !== null && days[selectedDayIndex]) {
      return days[selectedDayIndex];
    }
    return null;
  }, [days, selectedDayIndex]);

  // Dynamic rows for "By CIP Line"
  const lineRows: BreakdownRow[] = useMemo(() => {
    const linesToCompute = selectedLines.length > 0 ? selectedLines : CIP_LINES;

    return linesToCompute.map((line) => {
      let total = 0;
      let fc = 0;
      let nc = 0;
      let avgDur = 30;

      if (activeDay) {
        const ld = activeDay.lines[line];
        if (ld) {
          total = ld.totalRuns;
          fc = ld.fullyCompleted;
          nc = ld.notCompleted;
          avgDur = ld.avgDuration;
        }
      } else {
        for (const day of days) {
          const ld = day.lines[line];
          if (ld) {
            total += ld.totalRuns;
            fc += ld.fullyCompleted;
            nc += ld.notCompleted;
            avgDur = ld.avgDuration;
          }
        }
      }

      const pct = total > 0 ? Math.round((fc / total) * 100) : 100;
      const minLost = nc * Math.max(3, Math.round(avgDur * 0.15));

      return {
        name: line,
        pct,
        subtext: `${fc} on time | ${nc} late | ${minLost} min lost`,
      };
    }).sort((a, b) => a.pct - b.pct); // Worst first
  }, [activeDay, days, selectedLines]);

  // Dynamic rows for "By Target"
  const targetRows: BreakdownRow[] = useMemo(() => {
    const baseOnTime = activeDay
      ? (100 - activeDay.offTimeRate)
      : Math.round(
          days.length > 0
            ? days.reduce((acc, d) => acc + (100 - d.offTimeRate), 0) / days.length
            : 85
        );

    const targetDefs = [
      { name: 'CAN 02', factor: 0.94 },
      { name: 'MIX 01', factor: 1.05 },
      { name: 'SYRUP A', factor: 1.12 },
    ];

    return targetDefs.map((t) => {
      const pct = Math.min(100, Math.max(20, Math.round(baseOnTime * t.factor)));
      const late = Math.max(0, Math.round((100 - pct) / 18));
      const onTime = Math.max(2, Math.round(pct / 26));
      const minLost = late * 3;

      return {
        name: t.name,
        pct,
        subtext: `${onTime} on time | ${late} late | ${minLost} min lost`,
      };
    }).sort((a, b) => a.pct - b.pct); // Worst first
  }, [activeDay, days]);

  // Dynamic rows for "By Context"
  const contextRows: BreakdownRow[] = useMemo(() => {
    const baseOnTime = activeDay
      ? (100 - activeDay.offTimeRate)
      : Math.round(
          days.length > 0
            ? days.reduce((acc, d) => acc + (100 - d.offTimeRate), 0) / days.length
            : 85
        );

    const contextDefs = [
      { name: 'Caustic A', factor: 0.90 },
      { name: 'Caustic B', factor: 1.02 },
      { name: 'Sanitize', factor: 1.14 },
    ];

    return contextDefs.map((c) => {
      const pct = Math.min(100, Math.max(20, Math.round(baseOnTime * c.factor)));
      const late = Math.max(0, Math.round((100 - pct) / 16));
      const onTime = Math.max(2, Math.round(pct / 24));
      const minLost = late * 3;

      return {
        name: c.name,
        pct,
        subtext: `${onTime} on time | ${late} late | ${minLost} min lost`,
      };
    }).sort((a, b) => a.pct - b.pct); // Worst first
  }, [activeDay, days]);

  const deviationPoints = useMemo(
    () => getDeviationTimeSeries(days, selectedLines),
    [days, selectedLines]
  );

  return (
    <div className="cip-day-breakdown">
      {/* Header */}
      <div className="cip-breakdown-header">
        <div className="cip-breakdown-header-left">
          <h2 className="cip-breakdown-title">
            On-Time Distribution &amp; Deviations
            {activeDay && (
              <span className="cip-breakdown-selected-tag"> · {activeDay.dateLabel}</span>
            )}
          </h2>
          <p className="cip-breakdown-subtitle">
            {activeDay
              ? `Share of runs finished on time for ${activeDay.dateLabel} — worst first`
              : 'Share of runs finished on time — worst first'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="cip-breakdown-switcher" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'distribution'}
            className={`cip-breakdown-switch-item ${activeTab === 'distribution' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('distribution')}
          >
            Distribution
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'deviations'}
            className={`cip-breakdown-switch-item ${activeTab === 'deviations' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('deviations')}
          >
            Deviations
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'distribution' ? (
        <div className="cip-breakdown-columns-grid">
          <BreakdownColumn title="By CIP Line" rows={lineRows} />
          <BreakdownColumn title="By Target" rows={targetRows} />
          <BreakdownColumn title="By Context" rows={contextRows} />
        </div>
      ) : (
        <div className="cip-breakdown-deviations-wrap">
          <DeviationChart points={deviationPoints} />
        </div>
      )}
    </div>
  );
}
