'use client';

import React, { useState, useMemo } from 'react';
import { CIPChartBlock, CIPLine, CIP_LINES } from './mockData';
import { CIPKPIKey } from './CIPKPIStrip';

type BreakdownTab = 'distribution' | 'deviations';

interface CIPDayBreakdownProps {
  blocks: CIPChartBlock[];
  selectedBlockIndex: number | null;
  selectedLines: CIPLine[];
  activeKPI: CIPKPIKey | null;
}

interface BreakdownRow {
  name: string;
  pct: number;
  subtext: string;
  isPrimary?: boolean;
}

// Guarantee that rows in a column strictly sum to 100%
function normalizeTo100Percent(
  items: Array<{ name: string; rawShare: number; subtext: string }>
): BreakdownRow[] {
  if (items.length === 0) return [];

  const total = items.reduce((acc, it) => acc + it.rawShare, 0);
  if (total === 0) {
    const even = Math.floor(100 / items.length);
    return items.map((it, i) => ({
      name: it.name,
      pct: i === 0 ? 100 - even * (items.length - 1) : even,
      subtext: it.subtext,
      isPrimary: i === 0,
    }));
  }

  // Calculate rounded integer percentages
  let currentSum = 0;
  const processed = items.map((it) => {
    const pct = Math.round((it.rawShare / total) * 100);
    currentSum += pct;
    return { ...it, pct };
  });

  // Adjust difference on the highest item so total is exactly 100%
  const diff = 100 - currentSum;
  if (diff !== 0 && processed.length > 0) {
    let maxIdx = 0;
    for (let i = 1; i < processed.length; i++) {
      if (processed[i].pct > processed[maxIdx].pct) maxIdx = i;
    }
    processed[maxIdx].pct += diff;
  }

  // Ensure items are strictly sorted worst/highest first
  processed.sort((a, b) => b.pct - a.pct);

  return processed.map(({ name, pct, subtext }, idx) => ({
    name,
    pct,
    subtext,
    isPrimary: idx === 0, // Top/worst driver is highlighted in orange as per Figma
  }));
}

function BreakdownColumn({ title, rows }: { title: string; rows: BreakdownRow[] }) {
  return (
    <div className="cip-breakdown-col">
      <h3 className="cip-breakdown-col-title">{title}</h3>
      <div className="cip-breakdown-col-items">
        {rows.map((row) => {
          const barColor = row.isPrimary
            ? 'var(--orange-400, #e78710)'
            : 'var(--blue-400, #4484f4)';

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

// Actual Figma Deviation Pareto Chart matching 28840:5557
interface DeviationBarItem {
  name: string;
  lostMinutes: number;
}

function ActualDeviationChart({ selectedBlock }: { selectedBlock: CIPChartBlock | null }) {
  // Scaling factor based on whether a selected day has higher/lower lost time
  const scale = selectedBlock ? Math.max(0.6, Math.min(1.4, selectedBlock.offTimeRate / 15)) : 1.0;

  // Base categories and lost time in minutes matching Figma design 28840:5557
  const baseItems: DeviationBarItem[] = [
    { name: 'Water Q', lostMinutes: Math.round(28 * scale) },
    { name: 'Chemicals', lostMinutes: Math.round(8 * scale) },
    { name: 'Elbow 12', lostMinutes: Math.round(10 * scale) },
    { name: 'Temp Ramp', lostMinutes: Math.round(13 * scale) },
    { name: 'Elbow 14', lostMinutes: Math.round(10 * scale) },
  ];

  // SVG Chart Dimensions
  const svgWidth = 1100;
  const svgHeight = 310;
  const padLeft = 60;
  const padRight = 40;
  const padTop = 30;
  const padBottom = 50;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom; // 230px
  const maxMinutes = 32;

  // 80% lost time reference line position (around 24m)
  const y80 = padTop + chartH - (24 / maxMinutes) * chartH;
  const yBaseline = padTop + chartH;

  // Calculate positions for each of the 5 bars
  const numBars = baseItems.length;
  const barWidth = 110;
  const stepX = chartW / numBars;

  // Cumulative line points
  // Total lost minutes
  const totalMinutes = baseItems.reduce((acc, it) => acc + it.lostMinutes, 0);
  let cumMinutes = 0;

  const barsWithGeometry = baseItems.map((item, idx) => {
    cumMinutes += item.lostMinutes;
    const cumPct = totalMinutes > 0 ? cumMinutes / totalMinutes : 0;

    const centerX = padLeft + stepX * idx + stepX / 2;
    const barHeight = Math.max(8, (item.lostMinutes / maxMinutes) * chartH);
    const barY = yBaseline - barHeight;
    const barX = centerX - barWidth / 2;

    // Cumulative point y sits between 18m and 30m
    const cumY = padTop + chartH - (0.55 + cumPct * 0.38) * chartH;

    return {
      ...item,
      barX,
      barY,
      barHeight,
      centerX,
      cumY,
      cumPct: Math.round(cumPct * 100),
    };
  });

  // Cumulative line SVG path
  const cumPath = barsWithGeometry.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.centerX},${pt.cumY}`;
    return `${acc} L ${pt.centerX},${pt.cumY}`;
  }, '');

  return (
    <div className="cip-actual-deviation-chart">
      <div className="cip-actual-deviation-svg-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="cip-actual-deviation-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-Axis Grid Lines & Labels */}
          {/* 30m */}
          <text
            x={padLeft - 16}
            y={padTop + 14}
            textAnchor="end"
            fontSize="12"
            fill="#8e8e93"
            fontFamily="Inter, sans-serif"
          >
            30m
          </text>

          {/* 15m */}
          <text
            x={padLeft - 16}
            y={padTop + chartH / 2 + 4}
            textAnchor="end"
            fontSize="12"
            fill="#8e8e93"
            fontFamily="Inter, sans-serif"
          >
            15m
          </text>

          {/* 0m */}
          <text
            x={padLeft - 16}
            y={yBaseline + 4}
            textAnchor="end"
            fontSize="12"
            fill="#8e8e93"
            fontFamily="Inter, sans-serif"
          >
            0m
          </text>

          {/* Baseline (Line 226 in Figma) */}
          <line
            x1={padLeft - 10}
            y1={yBaseline}
            x2={svgWidth - padRight}
            y2={yBaseline}
            stroke="#2a2a2e"
            strokeWidth="1"
          />

          {/* 80% Lost Time Reference Line (Line 227 in Figma) */}
          <line
            x1={padLeft}
            y1={y80}
            x2={svgWidth - padRight}
            y2={y80}
            stroke="var(--red-400, #fa6443)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={padLeft + 10}
            y={y80 - 8}
            fontSize="12"
            fontWeight="500"
            fill="var(--red-400, #fa6443)"
            fontFamily="Inter, sans-serif"
          >
            80% lost time
          </text>

          {/* 5 Vertical Bars: Water Q, Chemicals, Elbow 12, Temp Ramp, Elbow 14 */}
          {barsWithGeometry.map((b) => (
            <g key={b.name} className="cip-deviation-bar-group">
              <rect
                x={b.barX}
                y={b.barY}
                width={barWidth}
                height={b.barHeight}
                fill="var(--data-viz-qualitative-09, #7871e2)"
                rx="2"
                className="cip-deviation-rect"
              />
              {/* Category label beneath baseline */}
              <text
                x={b.centerX}
                y={yBaseline + 24}
                textAnchor="middle"
                fontSize="13"
                fontWeight="500"
                fill="#a0a0a8"
                fontFamily="Inter, sans-serif"
              >
                {b.name}
              </text>
            </g>
          ))}

          {/* Cumulative Lost Time Line (Yellow) */}
          <path
            d={cumPath}
            fill="none"
            stroke="var(--yellow-400, #f5c842)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cumulative Points (Yellow Dots) */}
          {barsWithGeometry.map((b, i) => (
            <g key={i}>
              <circle
                cx={b.centerX}
                cy={b.cumY}
                r={4.5}
                fill="var(--yellow-400, #f5c842)"
                stroke="#19191c"
                strokeWidth="1.5"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Legend matching Frame 2085667738 in Figma */}
      <div className="cip-deviation-legend-center">
        <div className="cip-deviation-legend-item">
          <span
            className="cip-dev-legend-dot"
            style={{ background: 'var(--data-viz-qualitative-09, #7871e2)' }}
          />
          <span className="cip-dev-legend-text">Minutes Lost by Shift</span>
        </div>
        <div className="cip-deviation-legend-item">
          <span
            className="cip-dev-legend-dot"
            style={{ background: 'var(--yellow-400, #f5c842)' }}
          />
          <span className="cip-dev-legend-text">Cumulative Lost Time</span>
        </div>
      </div>
    </div>
  );
}

export default function CIPDayBreakdown({
  blocks,
  selectedBlockIndex,
  selectedLines,
}: CIPDayBreakdownProps) {
  const [activeTab, setActiveTab] = useState<BreakdownTab>('distribution');

  // Currently active block
  const activeBlock: CIPChartBlock | null = useMemo(() => {
    if (selectedBlockIndex !== null && blocks[selectedBlockIndex]) {
      return blocks[selectedBlockIndex];
    }
    return null;
  }, [blocks, selectedBlockIndex]);

  // 1. By CIP Line: Dynamic rows summing strictly to 100%
  const lineRows: BreakdownRow[] = useMemo(() => {
    // If lines are selected, use them; if only 2 selected, show them or all available lines
    const candidateLines = selectedLines.length > 0 ? selectedLines : CIP_LINES;
    const linesToCompute = candidateLines.length < 3 ? CIP_LINES.slice(0, 3) : candidateLines;

    const rawItems = linesToCompute.map((line) => {
      let fc = 3;
      let nc = 1;
      let weight = 10;

      if (line === 'CIP 3') {
        weight = 60;
        fc = 3;
        nc = 1;
      } else if (line === 'CIP 2') {
        weight = 30;
        fc = 3;
        nc = 1;
      } else if (line === 'CIP 1') {
        weight = 10;
        fc = 3;
        nc = 1;
      } else if (line === 'CIP 4') {
        weight = 8;
        fc = 2;
        nc = 1;
      } else if (line === 'CIP 5') {
        weight = 6;
        fc = 2;
        nc = 1;
      }

      // If active block is selected, adapt weights dynamically while keeping worst-first
      if (activeBlock && activeBlock.lines && activeBlock.lines[line]) {
        const ld = activeBlock.lines[line];
        weight = Math.max(5, ld.totalRuns * 3 + ld.notCompleted * 10);
        fc = ld.fullyCompleted;
        nc = ld.notCompleted;
      }

      return {
        name: line,
        rawShare: weight,
        subtext: `${fc} on time | ${nc} late | 3 min lost`,
      };
    });

    // Sort descending by share (worst/highest share first)
    rawItems.sort((a, b) => b.rawShare - a.rawShare);

    return normalizeTo100Percent(rawItems);
  }, [activeBlock, selectedLines]);

  // 2. By Target: Dynamic rows summing strictly to 100% (CAN 02: 50%, MIX 01: 25%, SYRUP A: 25%)
  const targetRows: BreakdownRow[] = useMemo(() => {
    const rawItems = [
      {
        name: 'CAN 02',
        rawShare: activeBlock ? 45 + (activeBlock.offTimeRate % 15) : 50,
        subtext: '3 on time | 1 late | 3 min lost',
      },
      {
        name: 'MIX 01',
        rawShare: activeBlock ? 25 : 25,
        subtext: '3 on time | 1 late | 3 min lost',
      },
      {
        name: 'SYRUP A',
        rawShare: activeBlock ? 25 : 25,
        subtext: '3 on time | 1 late | 3 min lost',
      },
    ];

    rawItems.sort((a, b) => b.rawShare - a.rawShare);
    return normalizeTo100Percent(rawItems);
  }, [activeBlock]);

  // 3. By Context: Dynamic rows summing strictly to 100% (Caustic A: 75%, Caustic B: 15%, Sanitize: 10%)
  const contextRows: BreakdownRow[] = useMemo(() => {
    const rawItems = [
      {
        name: 'Caustic A',
        rawShare: activeBlock ? 70 + (activeBlock.offTimeRate % 10) : 75,
        subtext: '3 on time | 1 late | 3 min lost',
      },
      {
        name: 'Caustic B',
        rawShare: 15,
        subtext: '3 on time | 1 late | 3 min lost',
      },
      {
        name: 'Sanitize',
        rawShare: 10,
        subtext: '3 on time | 1 late | 3 min lost',
      },
    ];

    rawItems.sort((a, b) => b.rawShare - a.rawShare);
    return normalizeTo100Percent(rawItems);
  }, [activeBlock]);

  return (
    <div className="cip-day-breakdown">
      {/* Header */}
      <div className="cip-breakdown-header">
        <div className="cip-breakdown-header-left">
          <h2 className="cip-breakdown-title">
            On-Time Distribution &amp; Deviations
            {activeBlock && (
              <span className="cip-breakdown-selected-tag"> · {activeBlock.label}</span>
            )}
          </h2>
          <p className="cip-breakdown-subtitle">
            {activeBlock
              ? `Share of runs finished on time for ${activeBlock.label} — worst first`
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
          <ActualDeviationChart selectedBlock={activeBlock} />
        </div>
      )}
    </div>
  );
}
