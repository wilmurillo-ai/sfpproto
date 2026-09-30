'use client';

import React, { useState, useMemo } from 'react';
import { Icon } from '@/components/ui';
import { CIPChartBlock, CIPLine } from './mockData';
import { CIPKPIKey } from './CIPKPIStrip';

interface CIPDayBreakdownProps {
  blocks: CIPChartBlock[];
  selectedBlockIndex: number | null;
  selectedLines: CIPLine[];
  activeKPI: CIPKPIKey | null;
}

export type DrilldownLevel = 'line' | 'target' | 'context';

interface DrilldownItem {
  id: string;
  name: string;
  pct: number;
  subtext: string;
}

export default function CIPDayBreakdown({
  blocks,
  selectedBlockIndex,
}: CIPDayBreakdownProps) {
  // Drilldown selection state
  const [selectedLine, setSelectedLine] = useState<string>('All');
  const [selectedTarget, setSelectedTarget] = useState<string>('All');
  const [selectedContext, setSelectedContext] = useState<string>('All');

  // Currently open dropdown menu level ('line' | 'target' | 'context' | null)
  // Default to null or 'line' if clicked
  const [openMenu, setOpenMenu] = useState<DrilldownLevel | null>(null);

  // Currently active trend chart block (day or week)
  const activeBlock: CIPChartBlock | null = useMemo(() => {
    if (selectedBlockIndex !== null && blocks[selectedBlockIndex]) {
      return blocks[selectedBlockIndex];
    }
    return null;
  }, [blocks, selectedBlockIndex]);

  // ── Drilldown Items Generator ──
  // Level 1: By CIP Line
  const lineItems: DrilldownItem[] = useMemo(() => {
    return [
      { id: 'L3', name: 'CIP L3', pct: 60, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'L2', name: 'CIP L2', pct: 30, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'L1', name: 'CIP L1', pct: 10, subtext: '3 on time | 1 late | 3 min lost' },
    ];
  }, []);

  // Level 2: By Target (filtered by selectedLine)
  const targetItems: DrilldownItem[] = useMemo(() => {
    if (selectedLine === 'L3') {
      return [
        { id: 'CAN 02', name: 'CAN 02', pct: 55, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'MIX 01', name: 'MIX 01', pct: 25, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'SYRUP A', name: 'SYRUP A', pct: 20, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    if (selectedLine === 'L2') {
      return [
        { id: 'MIX 01', name: 'MIX 01', pct: 50, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'CAN 02', name: 'CAN 02', pct: 30, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'SYRUP A', name: 'SYRUP A', pct: 20, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    return [
      { id: 'CAN 02', name: 'CAN 02', pct: 50, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'MIX 01', name: 'MIX 01', pct: 25, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'SYRUP A', name: 'SYRUP A', pct: 25, subtext: '3 on time | 1 late | 3 min lost' },
    ];
  }, [selectedLine]);

  // Level 3: By Context (filtered by selectedTarget and selectedLine)
  const contextItems: DrilldownItem[] = useMemo(() => {
    if (selectedTarget === 'CAN 02') {
      return [
        { id: 'Caustic A', name: 'Caustic A', pct: 75, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Caustic B', name: 'Caustic B', pct: 15, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Sanitize', name: 'Sanitize', pct: 10, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    if (selectedTarget === 'MIX 01') {
      return [
        { id: 'Caustic B', name: 'Caustic B', pct: 60, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Caustic A', name: 'Caustic A', pct: 25, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Sanitize', name: 'Sanitize', pct: 15, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    return [
      { id: 'Caustic A', name: 'Caustic A', pct: 70, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'Caustic B', name: 'Caustic B', pct: 20, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'Sanitize', name: 'Sanitize', pct: 10, subtext: '3 on time | 1 late | 3 min lost' },
    ];
  }, [selectedTarget]);

  // Current items and title for the drilldown panel
  const currentDrilldown = useMemo(() => {
    if (openMenu === 'line') {
      return {
        title: 'By CIP Line',
        items: lineItems,
        selectedId: selectedLine,
        onSelect: (id: string) => {
          const next = selectedLine === id ? 'All' : id;
          setSelectedLine(next);
          // If selecting, advance to target menu or keep open
          if (next !== 'All') {
            setSelectedTarget('All');
            setSelectedContext('All');
          }
        },
      };
    }
    if (openMenu === 'target') {
      return {
        title: 'By Target',
        items: targetItems,
        selectedId: selectedTarget,
        onSelect: (id: string) => {
          const next = selectedTarget === id ? 'All' : id;
          setSelectedTarget(next);
          if (next !== 'All') {
            setSelectedContext('All');
          }
        },
      };
    }
    if (openMenu === 'context') {
      return {
        title: 'By Context',
        items: contextItems,
        selectedId: selectedContext,
        onSelect: (id: string) => {
          setSelectedContext(selectedContext === id ? 'All' : id);
        },
      };
    }
    return null;
  }, [openMenu, lineItems, targetItems, contextItems, selectedLine, selectedTarget, selectedContext]);

  // ── Deviation Chart Data: dynamically adjusted by funnel filters & selected day/week ──
  const chartData = useMemo(() => {
    // Scaling by active day/week
    const dayFactor = activeBlock ? Math.max(0.7, Math.min(1.3, activeBlock.offTimeRate / 15)) : 1.0;

    // Filter-specific configurations matching Figma design 28930:57205
    if (selectedLine === 'L3') {
      return {
        refLineLabel: '75% lost time',
        refMinutes: 20,
        bars: [
          { name: 'Water Q', lostMinutes: Math.round(22 * dayFactor) },
          { name: 'Chemicals', lostMinutes: Math.round(16 * dayFactor) },
          { name: 'Elbow 12', lostMinutes: Math.round(5 * dayFactor) },
          { name: 'Temp Ramp', lostMinutes: Math.round(10 * dayFactor) },
          { name: 'Elbow 14', lostMinutes: Math.round(11 * dayFactor) },
        ],
      };
    }

    if (selectedLine === 'L2') {
      return {
        refLineLabel: '80% lost time',
        refMinutes: 22,
        bars: [
          { name: 'Water Q', lostMinutes: Math.round(14 * dayFactor) },
          { name: 'Chemicals', lostMinutes: Math.round(24 * dayFactor) },
          { name: 'Elbow 12', lostMinutes: Math.round(12 * dayFactor) },
          { name: 'Temp Ramp', lostMinutes: Math.round(8 * dayFactor) },
          { name: 'Elbow 14', lostMinutes: Math.round(6 * dayFactor) },
        ],
      };
    }

    if (selectedTarget === 'CAN 02') {
      return {
        refLineLabel: '80% lost time',
        refMinutes: 24,
        bars: [
          { name: 'Water Q', lostMinutes: Math.round(26 * dayFactor) },
          { name: 'Chemicals', lostMinutes: Math.round(10 * dayFactor) },
          { name: 'Elbow 12', lostMinutes: Math.round(7 * dayFactor) },
          { name: 'Temp Ramp', lostMinutes: Math.round(15 * dayFactor) },
          { name: 'Elbow 14', lostMinutes: Math.round(9 * dayFactor) },
        ],
      };
    }

    // Default (All / All / All matching Figma 28930:57207)
    return {
      refLineLabel: '80% lost time',
      refMinutes: 24,
      bars: [
        { name: 'Water Q', lostMinutes: Math.round(28 * dayFactor) },
        { name: 'Chemicals', lostMinutes: Math.round(8 * dayFactor) },
        { name: 'Elbow 12', lostMinutes: Math.round(10 * dayFactor) },
        { name: 'Temp Ramp', lostMinutes: Math.round(13 * dayFactor) },
        { name: 'Elbow 14', lostMinutes: Math.round(10 * dayFactor) },
      ],
    };
  }, [selectedLine, selectedTarget, activeBlock]);

  // SVG Chart Geometry
  const isPanelOpen = currentDrilldown !== null;
  const svgWidth = isPanelOpen ? 800 : 1100;
  const svgHeight = 310;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 50;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;
  const maxMinutes = 32;

  const yRefLine = padTop + chartH - (chartData.refMinutes / maxMinutes) * chartH;
  const yBaseline = padTop + chartH;

  const numBars = chartData.bars.length;
  const barWidth = isPanelOpen ? 88 : 110;
  const stepX = chartW / numBars;

  const totalMin = chartData.bars.reduce((s, b) => s + b.lostMinutes, 0);
  let cumMin = 0;

  const renderedBars = chartData.bars.map((item, idx) => {
    cumMin += item.lostMinutes;
    const cumPct = totalMin > 0 ? cumMin / totalMin : 0;

    const centerX = padLeft + stepX * idx + stepX / 2;
    const barHeight = Math.max(8, (item.lostMinutes / maxMinutes) * chartH);
    const barY = yBaseline - barHeight;
    const barX = centerX - barWidth / 2;

    const cumY = padTop + chartH - (0.50 + cumPct * 0.42) * chartH;

    return {
      ...item,
      barX,
      barY,
      barHeight,
      centerX,
      cumY,
    };
  });

  const cumPath = renderedBars.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.centerX},${pt.cumY}`;
    return `${acc} L ${pt.centerX},${pt.cumY}`;
  }, '');

  return (
    <div className="cip-day-breakdown cip-deviations-distribution">
      {/* ── Section Header ── */}
      <div className="cip-breakdown-header">
        <div className="cip-breakdown-header-left">
          <h2 className="cip-breakdown-title">
            Deviations Distribution
            {activeBlock && (
              <span className="cip-breakdown-selected-tag"> · {activeBlock.label}</span>
            )}
          </h2>
          <p className="cip-breakdown-subtitle">
            Share of deviations by line, target and context
          </p>
        </div>

        {/* ── Unified 3-Part Breadcrumb/Dropdown Component (Figma 28930:57208) ── */}
        <div className="cip-funnel-dropdown-bar" role="toolbar" aria-label="Funnel Filters">
          {/* Segment 1: CIP Line */}
          <div
            className={`cip-funnel-segment is-first ${selectedLine !== 'All' ? 'is-filtered' : ''} ${openMenu === 'line' ? 'is-open' : ''}`}
            onClick={() => setOpenMenu(openMenu === 'line' ? null : 'line')}
          >
            <span className="cip-funnel-seg-label">CIP Line</span>
            <span className="cip-funnel-seg-val">{selectedLine}</span>
            {selectedLine !== 'All' ? (
              <button
                type="button"
                className="cip-funnel-clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLine('All');
                  setSelectedTarget('All');
                  setSelectedContext('All');
                }}
                title="Clear Line filter"
                aria-label="Clear Line filter"
              >
                <Icon name="close" size="small" />
              </button>
            ) : (
              <Icon name="arrow_drop_down" size="small" className="cip-funnel-caret" />
            )}
          </div>

          {/* Segment 2: Target */}
          <div
            className={`cip-funnel-segment is-middle ${selectedTarget !== 'All' ? 'is-filtered' : ''} ${openMenu === 'target' ? 'is-open' : ''}`}
            onClick={() => setOpenMenu(openMenu === 'target' ? null : 'target')}
          >
            <span className="cip-funnel-seg-label">Target</span>
            <span className="cip-funnel-seg-val">{selectedTarget}</span>
            {selectedTarget !== 'All' ? (
              <button
                type="button"
                className="cip-funnel-clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTarget('All');
                  setSelectedContext('All');
                }}
                title="Clear Target filter"
                aria-label="Clear Target filter"
              >
                <Icon name="close" size="small" />
              </button>
            ) : (
              <Icon name="arrow_drop_down" size="small" className="cip-funnel-caret" />
            )}
          </div>

          {/* Segment 3: Context */}
          <div
            className={`cip-funnel-segment is-last ${selectedContext !== 'All' ? 'is-filtered' : ''} ${openMenu === 'context' ? 'is-open' : ''}`}
            onClick={() => setOpenMenu(openMenu === 'context' ? null : 'context')}
          >
            <span className="cip-funnel-seg-label">Context</span>
            <span className="cip-funnel-seg-val">{selectedContext}</span>
            {selectedContext !== 'All' ? (
              <button
                type="button"
                className="cip-funnel-clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContext('All');
                }}
                title="Clear Context filter"
                aria-label="Clear Context filter"
              >
                <Icon name="close" size="small" />
              </button>
            ) : (
              <Icon name="arrow_drop_down" size="small" className="cip-funnel-caret" />
            )}
          </div>
        </div>
      </div>

      {/* ── Content: Side-by-Side Deviation Chart + Drilldown Panel ── */}
      <div className={`cip-deviations-body-layout ${isPanelOpen ? 'has-panel-open' : ''}`}>
        {/* Left / Main: Deviation Pareto Chart */}
        <div className="cip-actual-deviation-chart">
          <div className="cip-actual-deviation-svg-container">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="cip-actual-deviation-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Y-Axis Labels */}
              <text
                x={padLeft - 14}
                y={padTop + 14}
                textAnchor="end"
                fontSize="12"
                fill="#8e8e93"
                fontFamily="Inter, sans-serif"
              >
                30m
              </text>
              <text
                x={padLeft - 14}
                y={padTop + chartH / 2 + 4}
                textAnchor="end"
                fontSize="12"
                fill="#8e8e93"
                fontFamily="Inter, sans-serif"
              >
                15m
              </text>
              <text
                x={padLeft - 14}
                y={yBaseline + 4}
                textAnchor="end"
                fontSize="12"
                fill="#8e8e93"
                fontFamily="Inter, sans-serif"
              >
                0m
              </text>

              {/* Baseline */}
              <line
                x1={padLeft - 10}
                y1={yBaseline}
                x2={svgWidth - padRight}
                y2={yBaseline}
                stroke="#2a2a2e"
                strokeWidth="1"
              />

              {/* Reference Dotted Line (80% or 75% lost time) */}
              <line
                x1={padLeft}
                y1={yRefLine}
                x2={svgWidth - padRight}
                y2={yRefLine}
                stroke="var(--red-400, #fa6443)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft + 10}
                y={yRefLine - 8}
                fontSize="12"
                fontWeight="500"
                fill="var(--red-400, #fa6443)"
                fontFamily="Inter, sans-serif"
              >
                {chartData.refLineLabel}
              </text>

              {/* 5 Vertical Purple Bars */}
              {renderedBars.map((b) => (
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

              {/* Cumulative Yellow Line */}
              <path
                d={cumPath}
                fill="none"
                stroke="var(--yellow-400, #f5c842)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Cumulative Points (Yellow Dots) */}
              {renderedBars.map((b, i) => (
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

          {/* Centered Legend */}
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

        {/* Right: Drilldown Panel with Pink Progress Bars (Matching Figma 28930:57206) */}
        {currentDrilldown && (
          <div className="cip-drilldown-panel">
            <div className="cip-drilldown-panel-header">
              <h3 className="cip-drilldown-panel-title">{currentDrilldown.title}</h3>
              <button
                type="button"
                className="cip-drilldown-close-panel"
                onClick={() => setOpenMenu(null)}
                aria-label="Close drilldown panel"
              >
                <Icon name="close" size="small" />
              </button>
            </div>

            <div className="cip-drilldown-items-list">
              {currentDrilldown.items.map((item) => {
                const isSelected = currentDrilldown.selectedId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`cip-drilldown-item-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => currentDrilldown.onSelect(item.id)}
                  >
                    <div className="cip-drilldown-item-top">
                      <span className="cip-drilldown-item-name">{item.name}</span>
                      <span className="cip-drilldown-item-pct">{item.pct}%</span>
                    </div>

                    {/* Pink Progress Bar matching Figma */}
                    <div className="cip-drilldown-progress-track">
                      <div
                        className="cip-drilldown-progress-fill"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>

                    <div className="cip-drilldown-item-subtext">{item.subtext}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
