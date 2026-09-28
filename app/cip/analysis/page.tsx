'use client';

import React, { useState, useMemo } from 'react';
import {
  CIPDateRange,
  CIPLineSelector,
  CIPKPIStrip,
  CIPDaySelector,
  CIPDayBreakdown,
  CIPDateRangeValue,
  CIPKPIKey,
} from '@/components/cip';
import {
  CIPLine,
  getDaysForPreset,
  getAggregatedDays,
  getKPISummary,
  getChartBlocksForPreset,
} from '@/components/cip/mockData';

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const today = new Date(2026, 8, 18);

export default function CIPAnalysisPage() {
  // Date range (defaults to 30D matching Figma design)
  const [dateRange, setDateRange] = useState<CIPDateRangeValue>({
    preset: '30D',
    startDate: addDays(today, -29),
    endDate: today,
    label: 'Last 30D',
  });

  // Selected lines: Default to CIP 1 and CIP 3 matching Figma design
  const [selectedLines, setSelectedLines] = useState<CIPLine[]>(['CIP 1', 'CIP 3']);

  // Active KPI filter
  const [activeKPI, setActiveKPI] = useState<CIPKPIKey | null>(null);

  // Selected block index: Default to index 1 (matching Figma 28840:4724 & 28840:6295)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(1);

  // Compute visible days from preset
  const presetDays = useMemo(() => {
    if (dateRange.preset === 'Custom') {
      const diff = Math.round(
        (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      return getDaysForPreset('Custom', Math.min(diff, 40));
    }
    return getDaysForPreset(dateRange.preset as '1D' | '3D' | '7D' | '30D');
  }, [dateRange]);

  // Aggregate by selected lines
  const aggregatedDays = useMemo(
    () => getAggregatedDays(presetDays, selectedLines),
    [presetDays, selectedLines]
  );

  // KPI Summary
  const summary = useMemo(
    () => getKPISummary(presetDays, selectedLines),
    [presetDays, selectedLines]
  );

  // Compute chart blocks: 4 week blocks for 30D, full 7 days for 7D, 3 for 3D, 1 for 1D
  const chartBlocks = useMemo(
    () => getChartBlocksForPreset(dateRange.preset, aggregatedDays, selectedLines),
    [dateRange.preset, aggregatedDays, selectedLines]
  );

  const handleDateChange = (val: CIPDateRangeValue) => {
    setDateRange(val);
    setSelectedBlockIndex(1); // Default select second block matching Figma
  };

  return (
    <div className="cip-analysis-page">
      <div className="cip-dashboard-card">
        {/* ── Controls row ── */}
        <div className="cip-analysis-controls">
          <div className="cip-analysis-controls-left">
            <CIPDateRange value={dateRange} onChange={handleDateChange} />
          </div>
          <div className="cip-analysis-controls-right">
            <CIPLineSelector selectedLines={selectedLines} onChange={setSelectedLines} />
          </div>
        </div>

        {/* ── KPI Strip (4 cards) ── */}
        <CIPKPIStrip summary={summary} activeKPI={activeKPI} onSelectKPI={setActiveKPI} />

        {/* ── Day / Week Selector with Trend Line ── */}
        <CIPDaySelector
          blocks={chartBlocks}
          selectedBlockIndex={selectedBlockIndex}
          onSelectBlock={(i) => setSelectedBlockIndex(i === selectedBlockIndex ? null : i)}
          activeKPI={activeKPI}
        />

        {/* ── Day / Week Breakdown (Distribution & Deviations) ── */}
        <CIPDayBreakdown
          blocks={chartBlocks}
          selectedBlockIndex={selectedBlockIndex}
          selectedLines={selectedLines}
          activeKPI={activeKPI}
        />
      </div>
    </div>
  );
}
