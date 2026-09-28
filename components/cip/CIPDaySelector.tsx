'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { CIPChartBlock } from './mockData';
import { CIPKPIKey } from './CIPKPIStrip';

interface CIPDaySelectorProps {
  blocks: CIPChartBlock[];
  selectedBlockIndex: number | null;
  onSelectBlock: (index: number) => void;
  activeKPI: CIPKPIKey | null;
}

// Requirement: green if >= 75%, orange if < 75% (and >= 30%), red if < 30%
export function getOnTimeColor(rate: number): string {
  if (rate >= 75) return 'var(--green-400, #3db97a)';
  if (rate >= 30) return 'var(--orange-400, #e78710)';
  return 'var(--red-400, #fa6443)';
}

function getOffTimeColor(offRate: number): string {
  if (offRate <= 25) return '#ffffff'; // On-time is >= 75%
  if (offRate <= 70) return 'var(--orange-400, #e78710)';
  return 'var(--red-400, #fa6443)';
}

function isBlockHighlightedForKPI(block: CIPChartBlock, kpi: CIPKPIKey | null): boolean {
  if (!kpi) return true;
  switch (kpi) {
    case 'fullyCompleted':
      return block.onTimeRate >= 75;
    case 'onTimeRate':
      return block.onTimeRate >= 75;
    case 'offTargetRate':
      return block.offTimeRate > 15;
    case 'totalOverrunTime':
      return block.offTimeRate > 20;
    default:
      return true;
  }
}

// Generate intra-day 24h checkpoints for a single day (1D timeframe)
function getIntraDayCheckpoints(block: CIPChartBlock) {
  const base = block.onTimeRate;
  const deltas = [6, -8, 5, -14, 4, -5];
  const times = ['04:00', '08:00', '12:00', '16:00', '20:00', '23:00'];
  return times.map((time, i) => {
    const rate = Math.min(99, Math.max(22, Math.round(base + deltas[i])));
    return { time, rate };
  });
}

export default function CIPDaySelector({
  blocks,
  selectedBlockIndex,
  onSelectBlock,
  activeKPI,
}: CIPDaySelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1100);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const svgW = containerWidth;
  const svgH = 150;
  const padX = 0;
  const padY = 32;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padY * 2;

  // Compute trend path and dot points depending on whether it is 1D or multi-block
  interface TrendPoint {
    x: number;
    y: number;
    rate: number;
    color: string;
    isSelected: boolean;
    timeLabel?: string;
  }

  const { trendPath, trendPoints } = useMemo<{ trendPath: string; trendPoints: TrendPoint[] }>(() => {
    if (blocks.length === 0) {
      return { trendPath: '', trendPoints: [] };
    }

    if (blocks.length === 1) {
      // 1D: Generate intra-day 24h trend across 100% width
      const checkpoints = getIntraDayCheckpoints(blocks[0]);
      const n = checkpoints.length;
      const rates = checkpoints.map((c) => c.rate);
      const minRate = Math.min(...rates, 20);
      const maxRate = Math.max(...rates, 100);
      const range = maxRate - minRate || 1;
      const colW = chartW / n;

      const pts: TrendPoint[] = checkpoints.map((cp, i) => {
        const x = padX + colW * i + colW / 2;
        const y = padY + chartH - ((cp.rate - minRate) / range) * chartH;
        return {
          x,
          y,
          rate: cp.rate,
          color: getOnTimeColor(cp.rate),
          timeLabel: cp.time,
          isSelected: false,
        };
      });

      const path = pts.reduce((acc, point, i) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const prev = pts[i - 1];
        const cpX = (prev.x + point.x) / 2;
        return `${acc} C ${cpX},${prev.y} ${cpX},${point.y} ${point.x},${point.y}`;
      }, '');

      return { trendPath: path, trendPoints: pts };
    }

    // Multi-block (3D, 7D, 30D weeks): Point per block column
    const rates = blocks.map((b) => b.onTimeRate);
    const minRate = Math.min(...rates, 20);
    const maxRate = Math.max(...rates, 100);
    const range = maxRate - minRate || 1;
    const colW = chartW / blocks.length;

    const pts: TrendPoint[] = blocks.map((block, i) => {
      const rate = block.onTimeRate;
      const x = padX + colW * i + colW / 2;
      const y = padY + chartH - ((rate - minRate) / range) * chartH;
      return {
        x,
        y,
        rate,
        color: getOnTimeColor(rate),
        isSelected: selectedBlockIndex === i,
      };
    });

    const path = pts.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = pts[i - 1];
      const cpX = (prev.x + point.x) / 2;
      return `${acc} C ${cpX},${prev.y} ${cpX},${point.y} ${point.x},${point.y}`;
    }, '');

    return { trendPath: path, trendPoints: pts };
  }, [blocks, chartW, chartH, selectedBlockIndex]);

  return (
    <div className="cip-day-selector" ref={containerRef}>
      {/* Block columns with fluid width: 1 col for 1D, 3 cols for 3D, 7 cols for 7D, 4 cols for 30D */}
      <div
        className="cip-day-columns"
        style={{
          gridTemplateColumns: `repeat(${blocks.length}, minmax(0, 1fr))`,
        }}
      >
        {blocks.map((block, i) => {
          const isSelected = selectedBlockIndex === i;
          const isHighlighted = isBlockHighlightedForKPI(block, activeKPI);
          const isDimmed = activeKPI !== null && !isHighlighted;
          const offRate = block.offTimeRate;

          return (
            <button
              key={block.key}
              type="button"
              className={`cip-day-block ${isSelected ? 'is-selected' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
              onClick={() => onSelectBlock(i)}
            >
              {/* Day / Week label */}
              <div className="cip-day-label">
                {block.label}
                {block.subtag && <span className="cip-day-subtag">{block.subtag}</span>}
              </div>

              {/* Spacer for SVG trend chart */}
              <div className="cip-day-chart-spacer" />

              {/* Bottom stats */}
              <div className="cip-day-stats">
                <div className="cip-day-stat">
                  <span className="cip-day-stat-label">{block.statLabel}</span>
                  <span className="cip-day-stat-value">{block.statRuns} Runs</span>
                </div>
                <div className="cip-day-stat">
                  <span className="cip-day-stat-label">Off-Time Rate</span>
                  <span
                    className="cip-day-stat-value"
                    style={{ color: getOffTimeColor(offRate) }}
                  >
                    {offRate}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Trend Line overlay */}
      <div className="cip-day-trend-overlay" aria-hidden="true">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="cip-trend-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4484f4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4484f4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fill under curve */}
          {trendPath && (
            <path
              d={`${trendPath} L ${padX + chartW},${padY + chartH} L ${padX},${padY + chartH} Z`}
              fill="url(#trendGradient)"
            />
          )}

          {/* Trend line */}
          {trendPath && (
            <path
              d={trendPath}
              fill="none"
              stroke="#4484f4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots + ON-TIME labels */}
          {trendPoints.map((pt, i) => (
            <g key={i}>
              {/* Outer halo when selected */}
              {pt.isSelected && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={11}
                  fill="none"
                  stroke={pt.color}
                  strokeWidth="2"
                  strokeOpacity="0.5"
                />
              )}
              {/* Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pt.isSelected ? 7 : 6}
                fill={pt.color}
              />
              {/* On-time percentage label */}
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={pt.color}
                fontFamily="Inter, sans-serif"
              >
                {pt.rate}%
              </text>
              {/* Time tag for 1D intra-day checkpoints */}
              {pt.timeLabel && (
                <text
                  x={pt.x}
                  y={padY + chartH + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="500"
                  fill="#8E8E93"
                  fontFamily="Inter, sans-serif"
                >
                  {pt.timeLabel}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
