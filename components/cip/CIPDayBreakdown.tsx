'use client';

import React, { useState, useMemo } from 'react';
import { Icon } from '@/components/ui';
import { CIPChartBlock, CIPLine } from './mockData';
import { CIPKPIKey } from './CIPKPIStrip';
import CIPRootCauseModal from './CIPRootCauseModal';

interface CIPDayBreakdownProps {
  blocks: CIPChartBlock[];
  selectedBlockIndex: number | null;
  selectedLines: CIPLine[];
  activeKPI: CIPKPIKey | null;
}

export type DrilldownLevel = 'line' | 'target' | 'context' | 'phase';

export const LEVEL_CONFIG: Record<
  DrilldownLevel,
  {
    title: string;
    color: string;
    cssVar: string;
    name: string;
  }
> = {
  line: {
    title: 'By CIP Line',
    color: '#ea397a',
    cssVar: 'var(--pink-400, #ea397a)',
    name: 'Pink 400',
  },
  target: {
    title: 'By Target',
    color: '#00a396',
    cssVar: 'var(--teal-350, #00a396)',
    name: 'Teal 350',
  },
  context: {
    title: 'By Context',
    color: '#9f75e8',
    cssVar: 'var(--purple-400, #9f75e8)',
    name: 'Purple 400',
  },
  phase: {
    title: 'By Phases',
    color: '#e78710',
    cssVar: 'var(--orange-400, #e78710)',
    name: 'Orange 400',
  },
};

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
  // Drilldown selection states (4 nested levels)
  const [selectedLine, setSelectedLine] = useState<string>('All');
  const [selectedTarget, setSelectedTarget] = useState<string>('All');
  const [selectedContext, setSelectedContext] = useState<string>('All');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');

  // Active tab in the filter component ('line' | 'target' | 'context' | 'phase')
  const [activeTab, setActiveTab] = useState<DrilldownLevel>('line');

  // Root cause details modal state (Figma 29354:1294240)
  const [selectedRootCause, setSelectedRootCause] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenRootCause = (elementName: string) => {
    setSelectedRootCause(elementName);
    setIsModalOpen(true);
  };

  // Currently active trend chart block (day or week)
  const activeBlock: CIPChartBlock | null = useMemo(() => {
    if (selectedBlockIndex !== null && blocks[selectedBlockIndex]) {
      return blocks[selectedBlockIndex];
    }
    return null;
  }, [blocks, selectedBlockIndex]);

  // Active level color config (Pink 400 for CIP Line, Teal 350 for target, etc.)
  const activeLevelConfig = LEVEL_CONFIG[activeTab];

  // ── Drilldown Nested Items Generator ──
  // Level 1: CIP Line (Pink 400)
  const lineItems: DrilldownItem[] = useMemo(() => {
    return [
      { id: 'CIP L3', name: 'CIP L3', pct: 60, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'CIP L2', name: 'CIP L2', pct: 30, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'CIP L1', name: 'CIP L1', pct: 10, subtext: '3 on time | 1 late | 3 min lost' },
    ];
  }, []);

  // Level 2: Target (nested inside selectedLine, Teal 350)
  const targetItems: DrilldownItem[] = useMemo(() => {
    if (selectedLine === 'CIP L3') {
      return [
        { id: 'MIX 02', name: 'MIX 02', pct: 45, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'CAN 02', name: 'CAN 02', pct: 35, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'SYRUP A', name: 'SYRUP A', pct: 20, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    if (selectedLine === 'CIP L2') {
      return [
        { id: 'MIX 01', name: 'MIX 01', pct: 50, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'CAN 02', name: 'CAN 02', pct: 30, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'SYRUP A', name: 'SYRUP A', pct: 20, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    if (selectedLine === 'CIP L1') {
      return [
        { id: 'CAN 01', name: 'CAN 01', pct: 45, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'MIX 03', name: 'MIX 03', pct: 35, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'SYRUP B', name: 'SYRUP B', pct: 20, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    return [
      { id: 'MIX 02', name: 'MIX 02', pct: 40, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'CAN 02', name: 'CAN 02', pct: 35, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'MIX 01', name: 'MIX 01', pct: 15, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'SYRUP A', name: 'SYRUP A', pct: 10, subtext: '3 on time | 1 late | 3 min lost' },
    ];
  }, [selectedLine]);

  // Level 3: Context (nested inside selectedTarget, Purple 400)
  const contextItems: DrilldownItem[] = useMemo(() => {
    if (selectedTarget === 'MIX 02') {
      return [
        { id: 'Caustic A', name: 'Caustic A', pct: 55, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Caustic B', name: 'Caustic B', pct: 30, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Sanitize', name: 'Sanitize', pct: 15, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    if (selectedTarget === 'CAN 02') {
      return [
        { id: 'Caustic A', name: 'Caustic A', pct: 70, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Caustic B', name: 'Caustic B', pct: 20, subtext: '3 on time | 1 late | 3 min lost' },
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
    if (selectedTarget === 'SYRUP A' || selectedTarget === 'SYRUP B') {
      return [
        { id: 'Acid Wash A', name: 'Acid Wash A', pct: 50, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Caustic A', name: 'Caustic A', pct: 35, subtext: '3 on time | 1 late | 3 min lost' },
        { id: 'Sanitize', name: 'Sanitize', pct: 15, subtext: '3 on time | 1 late | 3 min lost' },
      ];
    }
    return [
      { id: 'Caustic A', name: 'Caustic A', pct: 65, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'Caustic B', name: 'Caustic B', pct: 25, subtext: '3 on time | 1 late | 3 min lost' },
      { id: 'Sanitize', name: 'Sanitize', pct: 10, subtext: '3 on time | 1 late | 3 min lost' },
    ];
  }, [selectedTarget]);

  // Level 4: Phases (nested inside selectedContext, Orange 400)
  const phaseItems: DrilldownItem[] = useMemo(() => {
    if (selectedContext === 'Caustic A') {
      return [
        { id: 'Pre-Rinse', name: 'Pre-Rinse', pct: 40, subtext: 'Water circulation & purge | 5 min lost' },
        { id: 'Caustic Wash', name: 'Caustic Wash', pct: 35, subtext: 'Hot lye detergent circulation | 12 min lost' },
        { id: 'Intermediate Rinse', name: 'Intermediate Rinse', pct: 15, subtext: 'Fresh water purge | 3 min lost' },
        { id: 'Final Rinse', name: 'Final Rinse', pct: 10, subtext: 'Cold sterile water flush | 2 min lost' },
      ];
    }
    if (selectedContext === 'Caustic B') {
      return [
        { id: 'Caustic Wash', name: 'Caustic Wash', pct: 45, subtext: 'Hot caustic detergent circulation | 14 min lost' },
        { id: 'Pre-Rinse', name: 'Pre-Rinse', pct: 30, subtext: 'Initial water flush | 4 min lost' },
        { id: 'Intermediate Rinse', name: 'Intermediate Rinse', pct: 15, subtext: 'Fresh water purge | 3 min lost' },
        { id: 'Final Rinse', name: 'Final Rinse', pct: 10, subtext: 'Sterile purge | 1 min lost' },
      ];
    }
    if (selectedContext === 'Sanitize') {
      return [
        { id: 'Chemical Sanitize', name: 'Chemical Sanitize', pct: 50, subtext: 'Peracetic acid purge | 8 min lost' },
        { id: 'Sterile Rinse', name: 'Sterile Rinse', pct: 30, subtext: 'RO water rinse | 3 min lost' },
        { id: 'Air Blowdown', name: 'Air Blowdown', pct: 20, subtext: 'Sterile air drainage | 2 min lost' },
      ];
    }
    if (selectedContext === 'Acid Wash A') {
      return [
        { id: 'Acid Circulation', name: 'Acid Circulation', pct: 55, subtext: 'Nitric acid descaling | 9 min lost' },
        { id: 'Intermediate Flush', name: 'Intermediate Flush', pct: 30, subtext: 'Fresh water rinse | 4 min lost' },
        { id: 'Final Disinfection', name: 'Final Disinfection', pct: 15, subtext: 'Cold chemical sanitize | 2 min lost' },
      ];
    }
    return [
      { id: 'Caustic Wash', name: 'Caustic Wash', pct: 40, subtext: 'Hot detergent wash | 12 min lost' },
      { id: 'Pre-Rinse', name: 'Pre-Rinse', pct: 35, subtext: 'Water circulation & purge | 6 min lost' },
      { id: 'Intermediate Rinse', name: 'Intermediate Rinse', pct: 15, subtext: 'Fresh water purge | 3 min lost' },
      { id: 'Final Rinse', name: 'Final Rinse', pct: 10, subtext: 'Sterile rinse | 2 min lost' },
    ];
  }, [selectedContext]);

  // Current items and active tab configuration
  const currentDrilldown = useMemo(() => {
    if (activeTab === 'line') {
      return {
        level: 'line' as DrilldownLevel,
        title: 'By CIP Line',
        items: lineItems,
        selectedId: selectedLine,
        onSelect: (id: string) => {
          if (selectedLine === id) {
            setSelectedLine('All');
            setSelectedTarget('All');
            setSelectedContext('All');
            setSelectedPhase('All');
          } else {
            setSelectedLine(id);
            setSelectedTarget('All');
            setSelectedContext('All');
            setSelectedPhase('All');
            setActiveTab('target');
          }
        },
      };
    }
    if (activeTab === 'target') {
      return {
        level: 'target' as DrilldownLevel,
        title: 'By Target',
        items: targetItems,
        selectedId: selectedTarget,
        onSelect: (id: string) => {
          if (selectedTarget === id) {
            setSelectedTarget('All');
            setSelectedContext('All');
            setSelectedPhase('All');
          } else {
            setSelectedTarget(id);
            setSelectedContext('All');
            setSelectedPhase('All');
            setActiveTab('context');
          }
        },
      };
    }
    if (activeTab === 'context') {
      return {
        level: 'context' as DrilldownLevel,
        title: 'By Context',
        items: contextItems,
        selectedId: selectedContext,
        onSelect: (id: string) => {
          if (selectedContext === id) {
            setSelectedContext('All');
            setSelectedPhase('All');
          } else {
            setSelectedContext(id);
            setSelectedPhase('All');
            setActiveTab('phase');
          }
        },
      };
    }
    // Phase tab
    return {
      level: 'phase' as DrilldownLevel,
      title: 'By Phases',
      items: phaseItems,
      selectedId: selectedPhase,
      onSelect: (id: string) => {
        if (selectedPhase === id) {
          setSelectedPhase('All');
        } else {
          setSelectedPhase(id);
        }
      },
    };
  }, [
    activeTab,
    lineItems,
    targetItems,
    contextItems,
    phaseItems,
    selectedLine,
    selectedTarget,
    selectedContext,
    selectedPhase,
  ]);

  // ── Dynamic Deviation Chart Data ──
  const chartData = useMemo(() => {
    const dayFactor = activeBlock
      ? Math.max(0.7, Math.min(1.3, activeBlock.offTimeRate / 15))
      : 1.0;

    let refLineLabel = '80% lost time';
    let refMinutes = 24;
    let rawBars: Array<{ name: string; minutes: number }> = [];

    if (selectedPhase === 'Caustic Wash') {
      refLineLabel = '88% lost time';
      refMinutes = 28;
      rawBars = [
        { name: 'Chemicals', minutes: 30 },
        { name: 'Temp Ramp', minutes: 22 },
        { name: 'Elbow 14', minutes: 7 },
        { name: 'Water Q', minutes: 5 },
        { name: 'Elbow 12', minutes: 2 },
      ];
    } else if (selectedPhase === 'Pre-Rinse') {
      refLineLabel = '85% lost time';
      refMinutes = 26;
      rawBars = [
        { name: 'Water Q', minutes: 31 },
        { name: 'Elbow 12', minutes: 13 },
        { name: 'Elbow 14', minutes: 9 },
        { name: 'Temp Ramp', minutes: 7 },
        { name: 'Chemicals', minutes: 4 },
      ];
    } else if (
      selectedPhase === 'Chemical Sanitize' ||
      selectedPhase === 'Intermediate Rinse' ||
      selectedPhase === 'Final Rinse' ||
      selectedPhase === 'Acid Circulation'
    ) {
      refLineLabel = '82% lost time';
      refMinutes = 25;
      rawBars = [
        { name: 'Chemicals', minutes: 26 },
        { name: 'Water Q', minutes: 16 },
        { name: 'Temp Ramp', minutes: 12 },
        { name: 'Elbow 14', minutes: 8 },
        { name: 'Elbow 12', minutes: 5 },
      ];
    } else if (selectedContext === 'Caustic A') {
      refLineLabel = '85% lost time';
      refMinutes = 26;
      rawBars = [
        { name: 'Chemicals', minutes: 27 },
        { name: 'Temp Ramp', minutes: 19 },
        { name: 'Water Q', minutes: 10 },
        { name: 'Elbow 14', minutes: 7 },
        { name: 'Elbow 12', minutes: 4 },
      ];
    } else if (selectedContext === 'Caustic B') {
      refLineLabel = '82% lost time';
      refMinutes = 24;
      rawBars = [
        { name: 'Chemicals', minutes: 25 },
        { name: 'Water Q', minutes: 17 },
        { name: 'Temp Ramp', minutes: 11 },
        { name: 'Elbow 12', minutes: 8 },
        { name: 'Elbow 14', minutes: 6 },
      ];
    } else if (selectedContext === 'Sanitize' || selectedContext === 'Acid Wash A') {
      refLineLabel = '78% lost time';
      refMinutes = 22;
      rawBars = [
        { name: 'Water Q', minutes: 21 },
        { name: 'Chemicals', minutes: 19 },
        { name: 'Temp Ramp', minutes: 12 },
        { name: 'Elbow 12', minutes: 9 },
        { name: 'Elbow 14', minutes: 6 },
      ];
    } else if (selectedTarget === 'MIX 02') {
      refLineLabel = '82% lost time';
      refMinutes = 25;
      rawBars = [
        { name: 'Chemicals', minutes: 24 },
        { name: 'Temp Ramp', minutes: 18 },
        { name: 'Water Q', minutes: 12 },
        { name: 'Elbow 14', minutes: 8 },
        { name: 'Elbow 12', minutes: 4 },
      ];
    } else if (selectedTarget === 'CAN 02') {
      refLineLabel = '80% lost time';
      refMinutes = 24;
      rawBars = [
        { name: 'Water Q', minutes: 26 },
        { name: 'Temp Ramp', minutes: 15 },
        { name: 'Chemicals', minutes: 10 },
        { name: 'Elbow 14', minutes: 9 },
        { name: 'Elbow 12', minutes: 7 },
      ];
    } else if (selectedTarget === 'MIX 01' || selectedTarget === 'SYRUP A') {
      refLineLabel = '78% lost time';
      refMinutes = 22;
      rawBars = [
        { name: 'Water Q', minutes: 22 },
        { name: 'Chemicals', minutes: 20 },
        { name: 'Temp Ramp', minutes: 10 },
        { name: 'Elbow 12', minutes: 9 },
        { name: 'Elbow 14', minutes: 6 },
      ];
    } else if (selectedLine === 'CIP L3') {
      refLineLabel = '75% lost time';
      refMinutes = 20;
      rawBars = [
        { name: 'Water Q', minutes: 22 },
        { name: 'Chemicals', minutes: 16 },
        { name: 'Elbow 14', minutes: 11 },
        { name: 'Temp Ramp', minutes: 10 },
        { name: 'Elbow 12', minutes: 5 },
      ];
    } else if (selectedLine === 'CIP L2') {
      refLineLabel = '80% lost time';
      refMinutes = 22;
      rawBars = [
        { name: 'Chemicals', minutes: 24 },
        { name: 'Water Q', minutes: 14 },
        { name: 'Elbow 12', minutes: 12 },
        { name: 'Temp Ramp', minutes: 8 },
        { name: 'Elbow 14', minutes: 6 },
      ];
    } else if (selectedLine === 'CIP L1') {
      refLineLabel = '75% lost time';
      refMinutes = 21;
      rawBars = [
        { name: 'Water Q', minutes: 18 },
        { name: 'Temp Ramp', minutes: 15 },
        { name: 'Elbow 14', minutes: 12 },
        { name: 'Chemicals', minutes: 10 },
        { name: 'Elbow 12', minutes: 8 },
      ];
    } else {
      // Default (All)
      refLineLabel = '80% lost time';
      refMinutes = 24;
      rawBars = [
        { name: 'Water Q', minutes: 28 },
        { name: 'Temp Ramp', minutes: 13 },
        { name: 'Elbow 12', minutes: 10 },
        { name: 'Elbow 14', minutes: 10 },
        { name: 'Chemicals', minutes: 8 },
      ];
    }

    const bars = rawBars.map((b) => ({
      name: b.name,
      lostMinutes: Math.max(2, Math.round(b.minutes * dayFactor)),
    }));

    return {
      refLineLabel,
      refMinutes: Math.round(refMinutes * dayFactor),
      bars,
    };
  }, [
    selectedLine,
    selectedTarget,
    selectedContext,
    selectedPhase,
    activeBlock,
  ]);

  // SVG Chart Geometry
  const svgWidth = 840;
  const svgHeight = 310;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 50;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;
  const maxMinutes = 34;

  const yRefLine = padTop + chartH - (chartData.refMinutes / maxMinutes) * chartH;
  const yBaseline = padTop + chartH;

  const numBars = chartData.bars.length;
  const barWidth = 84;
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
            Share of deviations by line, target, context and phase
          </p>
        </div>
      </div>

      {/* ── Content: Complete Filters Component (LEFT) + Pareto Chart (RIGHT) (Figma 28918:14272) ── */}
      <div className="cip-deviations-body-layout">
        {/* Left Column: Full Filters Component (Tabs Bar + Drilldown Cards Panel) */}
        <div className="cip-deviations-filters-column">
          {/* 4-Part Funnel / Tabs Component (CIP Line, Target, Context, Phases) */}
          <div
            className="cip-funnel-dropdown-bar cip-tabs-filter-bar"
            role="tablist"
            aria-label="Deviations filter tabs"
          >
            {/* Tab 1: CIP Line (Pink 400) */}
            <div
              role="tab"
              aria-selected={activeTab === 'line'}
              tabIndex={0}
              data-level="line"
              className={`cip-funnel-segment is-first ${activeTab === 'line' ? 'is-active-tab' : ''} ${selectedLine !== 'All' ? 'is-filtered' : ''}`}
              onClick={() => setActiveTab('line')}
            >
              <div className="cip-funnel-seg-text">
                <span className="cip-funnel-seg-label">CIP Line</span>
                <span className="cip-funnel-seg-val">{selectedLine}</span>
              </div>
              {selectedLine !== 'All' && (
                <button
                  type="button"
                  className="cip-funnel-clear-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLine('All');
                    setSelectedTarget('All');
                    setSelectedContext('All');
                    setSelectedPhase('All');
                    setActiveTab('line');
                  }}
                  title="Clear Line filter"
                  aria-label="Clear Line filter"
                >
                  <Icon name="close" size="small" />
                </button>
              )}
            </div>

            {/* Tab 2: Target (Teal 350) */}
            <div
              role="tab"
              aria-selected={activeTab === 'target'}
              tabIndex={0}
              data-level="target"
              className={`cip-funnel-segment is-middle ${activeTab === 'target' ? 'is-active-tab' : ''} ${selectedTarget !== 'All' ? 'is-filtered' : ''}`}
              onClick={() => setActiveTab('target')}
            >
              <div className="cip-funnel-seg-text">
                <span className="cip-funnel-seg-label">Target</span>
                <span className="cip-funnel-seg-val">{selectedTarget}</span>
              </div>
              {selectedTarget !== 'All' && (
                <button
                  type="button"
                  className="cip-funnel-clear-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTarget('All');
                    setSelectedContext('All');
                    setSelectedPhase('All');
                    setActiveTab('target');
                  }}
                  title="Clear Target filter"
                  aria-label="Clear Target filter"
                >
                  <Icon name="close" size="small" />
                </button>
              )}
            </div>

            {/* Tab 3: Context (Purple 400) */}
            <div
              role="tab"
              aria-selected={activeTab === 'context'}
              tabIndex={0}
              data-level="context"
              className={`cip-funnel-segment is-middle ${activeTab === 'context' ? 'is-active-tab' : ''} ${selectedContext !== 'All' ? 'is-filtered' : ''}`}
              onClick={() => setActiveTab('context')}
            >
              <div className="cip-funnel-seg-text">
                <span className="cip-funnel-seg-label">Context</span>
                <span className="cip-funnel-seg-val">{selectedContext}</span>
              </div>
              {selectedContext !== 'All' && (
                <button
                  type="button"
                  className="cip-funnel-clear-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedContext('All');
                    setSelectedPhase('All');
                    setActiveTab('context');
                  }}
                  title="Clear Context filter"
                  aria-label="Clear Context filter"
                >
                  <Icon name="close" size="small" />
                </button>
              )}
            </div>

            {/* Tab 4: Phases (Orange 400) */}
            <div
              role="tab"
              aria-selected={activeTab === 'phase'}
              tabIndex={0}
              data-level="phase"
              className={`cip-funnel-segment is-last ${activeTab === 'phase' ? 'is-active-tab' : ''} ${selectedPhase !== 'All' ? 'is-filtered' : ''}`}
              onClick={() => setActiveTab('phase')}
            >
              <div className="cip-funnel-seg-text">
                <span className="cip-funnel-seg-label">Phases</span>
                <span className="cip-funnel-seg-val">{selectedPhase}</span>
              </div>
              {selectedPhase !== 'All' && (
                <button
                  type="button"
                  className="cip-funnel-clear-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhase('All');
                    setActiveTab('phase');
                  }}
                  title="Clear Phase filter"
                  aria-label="Clear Phase filter"
                >
                  <Icon name="close" size="small" />
                </button>
              )}
            </div>
          </div>

          {/* Drilldown Cards Panel */}
          <div
            className="cip-drilldown-panel"
            role="tabpanel"
            aria-label={currentDrilldown.title}
          >
            <div className="cip-drilldown-panel-header">
              <h3 className="cip-drilldown-panel-title">{currentDrilldown.title}</h3>
            </div>

          {/* Options Cards List */}
          <div className="cip-drilldown-items-list">
            {currentDrilldown.items.map((item) => {
              const isSelected = currentDrilldown.selectedId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  data-level={activeTab}
                  className={`cip-drilldown-item-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => currentDrilldown.onSelect(item.id)}
                >
                  <div className="cip-drilldown-item-top">
                    <span className="cip-drilldown-item-name">{item.name}</span>
                    <span className="cip-drilldown-item-pct">{item.pct}%</span>
                  </div>

                  {/* Level-colored Progress Bar matching Figma */}
                  <div className="cip-drilldown-progress-track">
                    <div
                      className="cip-drilldown-progress-fill"
                      style={{
                        width: `${item.pct}%`,
                        background: activeLevelConfig.color,
                      }}
                    />
                  </div>

                  <div className="cip-drilldown-item-subtext">{item.subtext}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right / Main: Deviation Pareto Chart */}
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

              {/* Reference Dotted Line */}
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

              {/* Pareto Bars colored by active level (Pink 400 for Line, Teal 350 for Target, etc.) */}
              {renderedBars.map((b) => (
                <g
                  key={b.name}
                  className="cip-deviation-bar-group is-clickable"
                  onClick={() => handleOpenRootCause(b.name)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View root cause details for ${b.name}`}
                >
                  <title>{`Click to view root cause analysis for ${b.name}`}</title>
                  <rect
                    x={b.barX}
                    y={b.barY}
                    width={barWidth}
                    height={b.barHeight}
                    fill={activeLevelConfig.color}
                    rx="3"
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
                    className="cip-deviation-bar-label"
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
                style={{ background: activeLevelConfig.color }}
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
      </div>

      {/* ── Root Cause Details Modal (Figma 29354:1294240) ── */}
      <CIPRootCauseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        elementName={selectedRootCause}
        activeLine={selectedLine !== 'All' ? selectedLine : 'CIP L3'}
        activeTarget={selectedTarget !== 'All' ? selectedTarget : 'MIX 02'}
        activeContext={selectedContext !== 'All' ? selectedContext : 'Caustic A'}
        activePhase={selectedPhase !== 'All' ? selectedPhase : 'Caustic Wash'}
        levelColor={activeLevelConfig.color}
      />
    </div>
  );
}
