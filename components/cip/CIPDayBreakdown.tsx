'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui';
import { CIPChartBlock, CIPLine } from './mockData';
import { CIPKPIKey } from './CIPKPIStrip';
import { ROOT_CAUSE_DETAILS, RootCauseTab, RootCauseDetailData } from './CIPRootCauseModal';

interface CIPDayBreakdownProps {
  blocks: CIPChartBlock[];
  selectedBlockIndex: number | null;
  selectedLines: CIPLine[];
  activeKPI: CIPKPIKey | null;
}

export type StatusFilterType = 'completed' | 'on-time' | 'off-target';
export type MacroCategory = 'line' | 'target' | 'context' | 'phase';

interface MacroFilterItem {
  id: string;
  name: string;
  pct: number;
  barColor?: string;
}

interface CauseItem {
  name: string;
  lostMinutes: number;
  pct: number;
  subtext: string;
}

export default function CIPDayBreakdown({
  blocks,
  selectedBlockIndex,
}: CIPDayBreakdownProps) {
  // ── Level 2: Status Filter Tabs (Fully Completed, On-Time, Off-Target) ──
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('completed');

  // ── Filter Macro Level A: Active Category Tab ──
  const [activeCategory, setActiveCategory] = useState<MacroCategory>('line');

  // ── Selected Filter Values for each category ──
  const [selectedLine, setSelectedLine] = useState<string>('All');
  const [selectedTarget, setSelectedTarget] = useState<string>('All');
  const [selectedContext, setSelectedContext] = useState<string>('All');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');

  // ── Level 4: Cause Breakdown & Side Panel States ──
  const [selectedCause, setSelectedCause] = useState<string>('Temp Ramp');
  const [activeTab, setActiveTab] = useState<RootCauseTab>('summary');

  // Horizontal Scroll and Drag State for Level B
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Active block from trend selector
  const activeBlock: CIPChartBlock | null = useMemo(() => {
    if (selectedBlockIndex !== null && blocks[selectedBlockIndex]) {
      return blocks[selectedBlockIndex];
    }
    return null;
  }, [blocks, selectedBlockIndex]);

  // Dynamic Day Header Date
  const headerDateStr = useMemo(() => {
    if (activeBlock) {
      if (activeBlock.label.includes(' ')) return activeBlock.label;
      return `Thursday ${activeBlock.label}`;
    }
    return 'Thursday 6/10';
  }, [activeBlock]);

  // Dynamic Total Overrun based on statusFilter and active filters
  const totalOverrunStr = useMemo(() => {
    if (statusFilter === 'on-time') return '35m';
    if (statusFilter === 'off-target') return '3h 45m';
    if (selectedLine === 'CIP 3') return '2h 45m';
    if (selectedLine === 'CIP 2') return '1h 50m';
    return '2h 20m';
  }, [statusFilter, selectedLine]);

  // ── Macro Filter Data Definitions ──
  // Lines (Level 1)
  const lineOptions: MacroFilterItem[] = useMemo(() => [
    { id: 'CIP 3', name: 'CIP 3', pct: 55, barColor: '#e34119' },
    { id: 'CIP 2', name: 'CIP 2', pct: 55, barColor: '#e34119' },
    { id: 'CIP 1', name: 'CIP 1', pct: 85, barColor: '#0662c4' },
    { id: 'CIP 4', name: 'CIP 4', pct: 85, barColor: '#0662c4' },
    { id: 'CIP 5', name: 'CIP 5', pct: 85, barColor: '#0662c4' },
  ], []);

  // Targets (Level 2)
  const targetOptions: MacroFilterItem[] = useMemo(() => {
    if (selectedLine === 'CIP 2') {
      return [
        { id: 'MIX 01', name: 'MIX 01', pct: 75, barColor: '#e34119' },
        { id: 'CAN 02', name: 'CAN 02', pct: 45, barColor: '#0662c4' },
        { id: 'SYRUP B', name: 'SYRUP B', pct: 30, barColor: '#0662c4' },
        { id: 'MIX 02', name: 'MIX 02', pct: 25, barColor: '#0662c4' },
      ];
    }
    if (selectedLine === 'CIP 1') {
      return [
        { id: 'CAN 01', name: 'CAN 01', pct: 85, barColor: '#0662c4' },
        { id: 'MIX 03', name: 'MIX 03', pct: 60, barColor: '#e34119' },
        { id: 'SYRUP A', name: 'SYRUP A', pct: 40, barColor: '#0662c4' },
      ];
    }
    return [
      { id: 'CAN 02', name: 'CAN 02', pct: 55, barColor: '#e34119' },
      { id: 'MIX 01', name: 'MIX 01', pct: 85, barColor: '#0662c4' },
      { id: 'SYRUP A', name: 'SYRUP A', pct: 85, barColor: '#0662c4' },
      { id: 'CAN 01', name: 'CAN 01', pct: 45, barColor: '#0662c4' },
      { id: 'MIX 02', name: 'MIX 02', pct: 40, barColor: '#0662c4' },
    ];
  }, [selectedLine]);

  // Contexts (Level 3)
  const contextOptions: MacroFilterItem[] = useMemo(() => {
    if (selectedTarget === 'MIX 01') {
      return [
        { id: 'Caustic B', name: 'Caustic B', pct: 70, barColor: '#e34119' },
        { id: 'Caustic A', name: 'Caustic A', pct: 50, barColor: '#0662c4' },
        { id: 'Sanitize', name: 'Sanitize', pct: 25, barColor: '#0662c4' },
      ];
    }
    return [
      { id: 'Caustic A', name: 'Caustic A', pct: 85, barColor: '#0662c4' },
      { id: 'Caustic B', name: 'Caustic B', pct: 55, barColor: '#e34119' },
      { id: 'Sanitize', name: 'Sanitize', pct: 85, barColor: '#0662c4' },
      { id: 'Acid Wash A', name: 'Acid Wash A', pct: 50, barColor: '#e34119' },
    ];
  }, [selectedTarget]);

  // Phases (Level 4)
  const phaseOptions: MacroFilterItem[] = useMemo(() => [
    { id: 'Pre Rinse', name: 'Pre Rinse', pct: 85, barColor: '#0662c4' },
    { id: 'Caustic Recirculation', name: 'Caustic Recirculation', pct: 55, barColor: '#e34119' },
    { id: 'Final Rinse', name: 'Final Rinse', pct: 85, barColor: '#0662c4' },
    { id: 'Intermediate Rinse', name: 'Intermediate Rinse', pct: 70, barColor: '#0662c4' },
  ], []);

  // Check scroll position to show/hide scroll arrows
  const checkScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [checkScrollState, activeCategory]);

  const handleScrollClick = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkScrollState, 350);
  };

  // Drag-and-scroll handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScrollState();
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  // ── Color coding based on selected status tab (Blue High, Green Medium, Red) ──
  const chartColor = useMemo(() => {
    if (statusFilter === 'completed') return '#0662c4'; // Blue High (Fully Completed)
    if (statusFilter === 'on-time') return '#30b06b';   // Green Medium (On-Time)
    return '#e34119';                                   // Red (Off-Target)
  }, [statusFilter]);

  // ── Dynamic Causes List & Reference Line (Responds to status tabs & child filters with increasing variance) ──
  const { causeList, refLineLabel, refLinePct } = useMemo(() => {
    // Collect all actively selected child filters (ignoring parent 'All')
    const activeFilters: { key: string; val: string }[] = [];
    if (selectedLine !== 'All') activeFilters.push({ key: 'line', val: selectedLine });
    if (selectedTarget !== 'All') activeFilters.push({ key: 'target', val: selectedTarget });
    if (selectedContext !== 'All') activeFilters.push({ key: 'context', val: selectedContext });
    if (selectedPhase !== 'All') activeFilters.push({ key: 'phase', val: selectedPhase });

    const filterCount = activeFilters.length;

    // RULE 1: If NO child element is selected, display baseline Pareto for the current status tab!
    if (filterCount === 0) {
      if (statusFilter === 'completed') {
        return {
          refLineLabel: '80% Loss Time',
          refLinePct: 80,
          causeList: [
            { name: 'Water Q', lostMinutes: 30, pct: 50, subtext: '30m (50%)' },
            { name: 'Temp Ramp', lostMinutes: 23, pct: 38, subtext: '23m (38%)' },
            { name: 'Elbow 12', lostMinutes: 10, pct: 16, subtext: '10m (16%)' },
            { name: 'Chemicals', lostMinutes: 10, pct: 16, subtext: '10m (16%)' },
          ],
        };
      }
      if (statusFilter === 'on-time') {
        return {
          refLineLabel: '85% Loss Time',
          refLinePct: 85,
          causeList: [
            { name: 'Valve Switch', lostMinutes: 14, pct: 42, subtext: '14m (42%)' },
            { name: 'Flow Rate', lostMinutes: 10, pct: 30, subtext: '10m (30%)' },
            { name: 'Pre-Rinse', lostMinutes: 6, pct: 18, subtext: '6m (18%)' },
            { name: 'Sensor Check', lostMinutes: 4, pct: 12, subtext: '4m (12%)' },
          ],
        };
      }
      // statusFilter === 'off-target'
      return {
        refLineLabel: '70% Loss Time',
        refLinePct: 70,
        causeList: [
          { name: 'Heat Exchanger Fouling', lostMinutes: 48, pct: 52, subtext: '48m (52%)' },
          { name: 'Acid Dosing Fault', lostMinutes: 34, pct: 36, subtext: '34m (36%)' },
          { name: 'Pressure Drop L3', lostMinutes: 18, pct: 20, subtext: '18m (20%)' },
          { name: 'Drain Blockage', lostMinutes: 12, pct: 14, subtext: '12m (14%)' },
        ],
      };
    }

    // RULE 2: Child element(s) are selected!
    // Determine 4 distinct causes and primary ranking based on status tab & filters
    const hasChemicals =
      selectedLine === 'CIP 2' ||
      selectedContext === 'Caustic B' ||
      selectedPhase === 'Detergent Wash';
    const hasElbow =
      selectedTarget === 'MIX 01' ||
      selectedTarget === 'CAN 02' ||
      selectedContext === 'Acid Wash A';
    const hasTempRamp =
      selectedLine === 'CIP 1' ||
      selectedTarget === 'CAN 01' ||
      selectedContext === 'Caustic A';
    const hasWaterQ =
      selectedPhase === 'Pre Rinse' ||
      selectedLine === 'CIP 3' ||
      selectedLine === 'CIP 4' ||
      selectedTarget === 'MIX 02';

    const allCauses =
      statusFilter === 'on-time'
        ? ['Valve Switch', 'Flow Rate', 'Pre-Rinse', 'Sensor Check']
        : statusFilter === 'off-target'
        ? ['Heat Exchanger Fouling', 'Acid Dosing Fault', 'Pressure Drop L3', 'Drain Blockage']
        : ['Water Q', 'Temp Ramp', 'Elbow 12', 'Chemicals'];

    let primary = allCauses[0];

    if (statusFilter === 'completed') {
      if (hasChemicals) primary = 'Chemicals';
      else if (hasElbow) primary = 'Elbow 12';
      else if (hasTempRamp) primary = 'Temp Ramp';
      else primary = 'Water Q';
    } else if (statusFilter === 'on-time') {
      if (hasChemicals) primary = 'Flow Rate';
      else if (hasElbow) primary = 'Sensor Check';
      else if (hasWaterQ) primary = 'Pre-Rinse';
      else primary = 'Valve Switch';
    } else {
      if (hasChemicals) primary = 'Acid Dosing Fault';
      else if (hasElbow) primary = 'Pressure Drop L3';
      else if (hasWaterQ) primary = 'Drain Blockage';
      else primary = 'Heat Exchanger Fouling';
    }

    // Ensure all 4 items are strictly unique and primary is ordered first
    const remaining = allCauses.filter((c) => c !== primary);
    const secondary = remaining[0];
    const tertiary = remaining[1];
    const quaternary = remaining[2];

    // RULE 3: Scaling Variance!
    // As MORE filters are selected, variance increases dramatically:
    // - 1 filter: Moderate variance (pPct ~68%, sPct ~22%, tPct ~10%, qPct ~6%)
    // - 2 filters: High variance (pPct ~82%, sPct ~14%, tPct ~6%, qPct ~3%)
    // - 3+ filters: Extreme variance (pPct ~94%, sPct ~5%, tPct ~2%, qPct ~1%)
    let pPct = 68;
    let sPct = 22;
    let tPct = 10;
    let qPct = 6;
    let pMin = statusFilter === 'off-target' ? 55 : statusFilter === 'on-time' ? 18 : 30;
    let sMin = statusFilter === 'off-target' ? 20 : statusFilter === 'on-time' ? 7 : 12;
    let tMin = statusFilter === 'off-target' ? 8 : statusFilter === 'on-time' ? 3 : 6;
    let qMin = statusFilter === 'off-target' ? 4 : statusFilter === 'on-time' ? 2 : 4;
    let refPct = statusFilter === 'off-target' ? 76 : 84;

    if (filterCount === 1) {
      pPct = 68;
      sPct = 22;
      tPct = 10;
      qPct = 6;
      refPct = statusFilter === 'off-target' ? 74 : 82;
    } else if (filterCount === 2) {
      pPct = 82;
      sPct = 14;
      tPct = 6;
      qPct = 3;
      pMin = Math.round(pMin * 1.2);
      sMin = Math.round(sMin * 0.7);
      tMin = Math.round(tMin * 0.6);
      qMin = Math.round(qMin * 0.5);
      refPct = statusFilter === 'off-target' ? 80 : 88;
    } else {
      pPct = 94;
      sPct = 5;
      tPct = 2;
      qPct = 1;
      pMin = Math.round(pMin * 1.35);
      sMin = Math.round(sMin * 0.4);
      tMin = Math.round(tMin * 0.3);
      qMin = Math.round(qMin * 0.25);
      refPct = statusFilter === 'off-target' ? 86 : 92;
    }

    return {
      refLineLabel: `${refPct}% Loss Time`,
      refLinePct: refPct,
      causeList: [
        { name: primary, lostMinutes: pMin, pct: pPct, subtext: `${pMin}m (${pPct}%)` },
        { name: secondary, lostMinutes: sMin, pct: sPct, subtext: `${sMin}m (${sPct}%)` },
        { name: tertiary, lostMinutes: tMin, pct: tPct, subtext: `${tMin}m (${tPct}%)` },
        { name: quaternary, lostMinutes: qMin, pct: qPct, subtext: `${qMin}m (${qPct}%)` },
      ],
    };
  }, [statusFilter, selectedLine, selectedTarget, selectedContext, selectedPhase]);

  // Synchronize selectedCause if it is not present in the current status tab's causes
  useEffect(() => {
    if (causeList.length > 0 && !causeList.some((c) => c.name === selectedCause)) {
      setSelectedCause(causeList[0].name);
    }
  }, [causeList, selectedCause]);

  // Root cause detail data for selected cause
  const currentCauseData: RootCauseDetailData = useMemo(() => {
    const key = selectedCause;
    if (ROOT_CAUSE_DETAILS[key]) return ROOT_CAUSE_DETAILS[key];
    if (ROOT_CAUSE_DETAILS[key.replace('-', ' ')]) return ROOT_CAUSE_DETAILS[key.replace('-', ' ')];

    // Rich fallback data for On-Time and Off-Target status tab causes
    const isOffTarget = statusFilter === 'off-target';
    const isOnTime = statusFilter === 'on-time';

    return {
      displayTitle: key,
      subtitle: 'Root Cause Details',
      summary: {
        timeLost: isOffTarget ? '48m' : isOnTime ? '14m' : '26m',
        occurrences: isOffTarget ? '5' : isOnTime ? '2' : '3',
        runsAffected: isOffTarget ? '4' : isOnTime ? '2' : '3',
        worstTime: selectedLine !== 'All' ? selectedLine : 'CIP 2',
        shift: isOffTarget ? 'S2' : isOnTime ? 'S1' : 'S3',
      },
      locations: [
        {
          id: 'gen-loc-1',
          title: `${key} Diagnostic Analysis`,
          subtitle: selectedPhase !== 'All' ? selectedPhase : 'Caustic Wash',
          line: selectedLine !== 'All' ? selectedLine : 'CIP 1, CIP 2',
          lostTime: isOffTarget ? '28m Lost' : isOnTime ? '8m Lost' : '14m Lost',
        },
        {
          id: 'gen-loc-2',
          title: `Field Sensor & Actuator Loop`,
          subtitle: selectedPhase !== 'All' ? selectedPhase : 'Pre Rinse',
          line: selectedLine !== 'All' ? selectedLine : 'CIP 3',
          lostTime: isOffTarget ? '20m Lost' : isOnTime ? '6m Lost' : '12m Lost',
        },
      ],
      actions: [
        {
          id: 'gen-act-1',
          timeframe: 'NOW',
          category: isOffTarget ? 'Critical Skid Alert' : 'Operations',
          description: `Inspect ${key} manifold valves, verify flow transmitters and clear inline restrictions`,
        },
        {
          id: 'gen-act-2',
          timeframe: 'This Week',
          category: 'Maintenance',
          description: `Calibrate pressure transducer loop and verify scheduled descaling protocols for ${key}`,
        },
      ],
    };
  }, [selectedCause, statusFilter, selectedLine, selectedPhase]);

  // ── Handler for Reset All button (Level A) ──
  const handleResetAll = () => {
    setSelectedLine('All');
    setSelectedTarget('All');
    setSelectedContext('All');
    setSelectedPhase('All');
    setActiveCategory('line');
  };

  // ── Handler for selecting options in Level B ──
  const handleSelectOption = (name: string) => {
    if (activeCategory === 'line') {
      setSelectedLine(name);
    } else if (activeCategory === 'target') {
      setSelectedTarget(name);
    } else if (activeCategory === 'context') {
      setSelectedContext(name);
    } else if (activeCategory === 'phase') {
      setSelectedPhase(name);
    }
  };

  return (
    <div className="cip-day-breakdown-v2" data-node-id="29232:37966">
      {/* ── 1. DAY BREAKDOWN HEADER (Date & Status Filter Tabs) ── */}
      <div className="cip-v2-header-row" data-node-id="29232:37976">
        {/* Date and Total Overrun */}
        <div className="cip-v2-header-date-group" data-node-id="29232:37977">
          <h2 className="cip-v2-date-title">{headerDateStr}</h2>
          <div className="cip-v2-overrun-line">
            <span className="cip-v2-overrun-label">Total Overrun</span>
            <span className="cip-v2-overrun-val">{totalOverrunStr}</span>
          </div>
        </div>

        {/* 3 Status Filter Tabs (Figma 29439:7278) */}
        <div className="cip-v2-status-tabs" data-node-id="29439:7278">
          {/* Tab 1: Fully Completed */}
          <button
            type="button"
            className={`cip-v2-status-tab-btn ${statusFilter === 'completed' ? 'is-active' : ''}`}
            onClick={() => setStatusFilter('completed')}
            data-node-id="29439:7279"
          >
            <div className="cip-v2-tab-label">Fully Completed</div>
            <div className="cip-v2-tab-metric">32 Runs</div>
          </button>

          {/* Tab 2: On-Time (with warning attention icon on metric row) */}
          <button
            type="button"
            className={`cip-v2-status-tab-btn ${statusFilter === 'on-time' ? 'is-active' : ''}`}
            onClick={() => setStatusFilter('on-time')}
            data-node-id="29439:7283"
          >
            <div className="cip-v2-tab-label">On-Time</div>
            <div className="cip-v2-tab-metric-row">
              <span className="cip-v2-tab-metric">87.5%</span>
              <Icon name="warning" size="small" className="cip-v2-warn-icon" />
            </div>
          </button>

          {/* Tab 3: Off-Target */}
          <button
            type="button"
            className={`cip-v2-status-tab-btn ${statusFilter === 'off-target' ? 'is-active' : ''}`}
            onClick={() => setStatusFilter('off-target')}
            data-node-id="29439:7287"
          >
            <div className="cip-v2-tab-label">Off-Target</div>
            <div className="cip-v2-tab-metric">22.5%</div>
          </button>
        </div>
      </div>

      {/* ── 2. MACRO FILTER COMPONENT (Level A & Level B - Figma 29416:7281) ── */}
      <div className="cip-v2-macro-filter-container" data-node-id="29416:7281">
        {/* Filter Macro Level A (Category Tabs + Reset All - Figma 29416:7302) */}
        <div className="cip-v2-macro-level-a" data-node-id="29416:7302">
          {/* Segmented Category Tabs */}
          <div className="cip-v2-macro-a-tabs" data-node-id="29416:7257">
            {/* Tab 1: CIP Line */}
            <button
              type="button"
              className={`cip-v2-macro-a-tab is-first ${activeCategory === 'line' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('line')}
              data-node-id="29416:7258"
            >
              <span className="cip-v2-macro-a-label">CIP Line:</span>
              <span className="cip-v2-macro-a-val">{selectedLine}</span>
              <Icon name="arrow_drop_down" size="medium" className="cip-v2-macro-a-chevron" />
            </button>

            {/* Tab 2: Target */}
            <button
              type="button"
              className={`cip-v2-macro-a-tab ${activeCategory === 'target' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('target')}
              data-node-id="29416:7261"
            >
              <span className="cip-v2-macro-a-label">Target:</span>
              <span className="cip-v2-macro-a-val">{selectedTarget}</span>
              <Icon name="arrow_drop_down" size="medium" className="cip-v2-macro-a-chevron" />
            </button>

            {/* Tab 3: Context */}
            <button
              type="button"
              className={`cip-v2-macro-a-tab ${activeCategory === 'context' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('context')}
              data-node-id="29416:7266"
            >
              <span className="cip-v2-macro-a-label">Context:</span>
              <span className="cip-v2-macro-a-val">{selectedContext}</span>
              <Icon name="arrow_drop_down" size="medium" className="cip-v2-macro-a-chevron" />
            </button>

            {/* Tab 4: Phase */}
            <button
              type="button"
              className={`cip-v2-macro-a-tab is-last ${activeCategory === 'phase' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('phase')}
              data-node-id="29416:7271"
            >
              <span className="cip-v2-macro-a-label">Phase:</span>
              <span className="cip-v2-macro-a-val">{selectedPhase}</span>
              <Icon name="arrow_drop_down" size="medium" className="cip-v2-macro-a-chevron" />
            </button>
          </div>

          {/* Reset All Button */}
          <button
            type="button"
            className="cip-v2-macro-reset-all-btn"
            onClick={handleResetAll}
            data-node-id="29416:7303"
          >
            Reset All
          </button>
        </div>

        {/* Filter Macro Level B (Drilldown Options + Horizontal Drag/Scroll + Arrows - Figma 29232:38141) */}
        <div className="cip-v2-macro-level-b-wrapper" data-node-id="29232:38141">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              type="button"
              className="cip-v2-macro-scroll-arrow is-left"
              onClick={() => handleScrollClick('left')}
              aria-label="Scroll left"
            >
              <Icon name="chevron_left" size="medium" />
            </button>
          )}

          {/* Horizontally scrollable & draggable container */}
          <div
            ref={scrollRef}
            className="cip-v2-macro-level-b-scroll"
            onScroll={checkScrollState}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Category: Line Options */}
            {activeCategory === 'line' && (
              <>
                <button
                  type="button"
                  className={`cip-v2-macro-b-all-btn ${selectedLine === 'All' ? 'is-active' : ''}`}
                  onClick={() => handleSelectOption('All')}
                  data-node-id="29232:38142"
                >
                  All CIP Lines
                </button>

                {lineOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`cip-v2-macro-b-card ${selectedLine === opt.name ? 'is-selected' : ''}`}
                    onClick={() => handleSelectOption(opt.name)}
                  >
                    <div className="cip-v2-macro-b-card-top">
                      <span className="cip-v2-macro-b-card-title">{opt.name}</span>
                      <span className="cip-v2-macro-b-card-pct">{opt.pct}%</span>
                    </div>
                    <div className="cip-v2-macro-b-card-track">
                      <div
                        className="cip-v2-macro-b-card-fill"
                        style={{
                          width: `${opt.pct}%`,
                          background: opt.barColor || '#e34119',
                        }}
                      />
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Category: Target Options */}
            {activeCategory === 'target' && (
              <>
                <button
                  type="button"
                  className={`cip-v2-macro-b-all-btn ${selectedTarget === 'All' ? 'is-active' : ''}`}
                  onClick={() => handleSelectOption('All')}
                >
                  All Targets
                </button>

                {targetOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`cip-v2-macro-b-card ${selectedTarget === opt.name ? 'is-selected' : ''}`}
                    onClick={() => handleSelectOption(opt.name)}
                  >
                    <div className="cip-v2-macro-b-card-top">
                      <span className="cip-v2-macro-b-card-title">{opt.name}</span>
                      <span className="cip-v2-macro-b-card-pct">{opt.pct}%</span>
                    </div>
                    <div className="cip-v2-macro-b-card-track">
                      <div
                        className="cip-v2-macro-b-card-fill"
                        style={{
                          width: `${opt.pct}%`,
                          background: opt.barColor || '#e34119',
                        }}
                      />
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Category: Context Options */}
            {activeCategory === 'context' && (
              <>
                <button
                  type="button"
                  className={`cip-v2-macro-b-all-btn ${selectedContext === 'All' ? 'is-active' : ''}`}
                  onClick={() => handleSelectOption('All')}
                >
                  All Contexts
                </button>

                {contextOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`cip-v2-macro-b-card ${selectedContext === opt.name ? 'is-selected' : ''}`}
                    onClick={() => handleSelectOption(opt.name)}
                  >
                    <div className="cip-v2-macro-b-card-top">
                      <span className="cip-v2-macro-b-card-title">{opt.name}</span>
                      <span className="cip-v2-macro-b-card-pct">{opt.pct}%</span>
                    </div>
                    <div className="cip-v2-macro-b-card-track">
                      <div
                        className="cip-v2-macro-b-card-fill"
                        style={{
                          width: `${opt.pct}%`,
                          background: opt.barColor || '#e34119',
                        }}
                      />
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Category: Phase Options */}
            {activeCategory === 'phase' && (
              <>
                <button
                  type="button"
                  className={`cip-v2-macro-b-all-btn ${selectedPhase === 'All' ? 'is-active' : ''}`}
                  onClick={() => handleSelectOption('All')}
                >
                  All Phases
                </button>

                {phaseOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`cip-v2-macro-b-card ${selectedPhase === opt.name ? 'is-selected' : ''}`}
                    onClick={() => handleSelectOption(opt.name)}
                  >
                    <div className="cip-v2-macro-b-card-top">
                      <span className="cip-v2-macro-b-card-title">{opt.name}</span>
                      <span className="cip-v2-macro-b-card-pct">{opt.pct}%</span>
                    </div>
                    <div className="cip-v2-macro-b-card-track">
                      <div
                        className="cip-v2-macro-b-card-fill"
                        style={{
                          width: `${opt.pct}%`,
                          background: opt.barColor || '#e34119',
                        }}
                      />
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              type="button"
              className="cip-v2-macro-scroll-arrow is-right"
              onClick={() => handleScrollClick('right')}
              aria-label="Scroll right"
              data-node-id="29416:7297"
            >
              <Icon name="chevron_right" size="medium" />
            </button>
          )}
        </div>
      </div>

      {/* ── 3. CAUSE BREAKDOWN & SIDE-PANEL (Figma 29327:41727) ── */}
      <div className="cip-v2-causebreakdown-box" data-node-id="29327:41727">
        {/* Left Column: Vertical Chart (Time Loss by Cause) */}
        <div className="cip-v2-causes-col">
          <div className="cip-v2-causes-header">
            <h3 className="cip-v2-causes-title">Time Loss by Cause</h3>
          </div>

          <div className="cip-v2-causes-list-container">
            {/* Vertical Reference Line across the bars */}
            <div
              className="cip-v2-ref-line-overlay"
              style={{ left: `calc(143px + 12px + (100% - 143px - 44px) * ${refLinePct / 100})` }}
            >
              <div className="cip-v2-ref-label" style={{ color: chartColor }}>{refLineLabel}</div>
              <div className="cip-v2-ref-line" style={{ background: chartColor }} />
            </div>

            {/* Vertical Stack of Cause rows */}
            <div className="cip-v2-causes-stack">
              {causeList.map((cause, index) => {
                const isSelected = selectedCause === cause.name;

                return (
                  <div
                    key={`${cause.name}-${index}`}
                    className={`cip-v2-cause-row ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedCause(cause.name)}
                    style={isSelected ? { borderColor: chartColor } : undefined}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${cause.name} root cause`}
                  >
                    {/* Cause Title & Subtitle */}
                    <div className="cip-v2-cause-label-box">
                      <span className="cip-v2-cause-name">{cause.name}</span>
                      <span className="cip-v2-cause-subtext">{cause.subtext}</span>
                    </div>

                    {/* Horizontal Bar Track & Fill */}
                    <div className="cip-v2-cause-bar-track">
                      <div
                        className="cip-v2-cause-bar-fill"
                        style={{
                          width: `${cause.pct}%`,
                          background: chartColor,
                        }}
                      />
                    </div>

                    {/* Chevron Arrow */}
                    <div className="cip-v2-cause-chevron">
                      <Icon name="chevron_right" size="medium" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Side-Panel (Root Cause Details) */}
        <div className="cip-v2-sidepanel-col">
          {/* Header */}
          <div className="cip-v2-panel-header">
            <h2 className="cip-v2-panel-title">{currentCauseData.displayTitle}</h2>
            <h3 className="cip-v2-panel-subtitle">Root Cause Details</h3>
          </div>

          {/* Secondary Tabs */}
          <div className="cip-v2-panel-tabs">
            <button
              type="button"
              className={`cip-v2-panel-tab-item ${activeTab === 'summary' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              type="button"
              className={`cip-v2-panel-tab-item ${activeTab === 'locations' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              Locations
            </button>
            <button
              type="button"
              className={`cip-v2-panel-tab-item ${activeTab === 'actions' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              Actions
            </button>
          </div>

          {/* Tab 1: Summary */}
          {activeTab === 'summary' && (
            <div className="cip-v2-panel-summary-grid">
              <div className="cip-v2-panel-metric-card">
                <span className="cip-v2-panel-metric-label">Time Lost</span>
                <span className="cip-v2-panel-metric-val">{currentCauseData.summary.timeLost}</span>
              </div>
              <div className="cip-v2-panel-metric-card">
                <span className="cip-v2-panel-metric-label">Occurrencies</span>
                <span className="cip-v2-panel-metric-val">{currentCauseData.summary.occurrences}</span>
              </div>
              <div className="cip-v2-panel-metric-card">
                <span className="cip-v2-panel-metric-label">Runs Affected</span>
                <span className="cip-v2-panel-metric-val">{currentCauseData.summary.runsAffected}</span>
              </div>
              <div className="cip-v2-panel-metric-card">
                <span className="cip-v2-panel-metric-label">Worst Time</span>
                <span className="cip-v2-panel-metric-val">{currentCauseData.summary.worstTime}</span>
              </div>
              <div className="cip-v2-panel-metric-card">
                <span className="cip-v2-panel-metric-label">Shift</span>
                <span className="cip-v2-panel-metric-val">{currentCauseData.summary.shift}</span>
              </div>
            </div>
          )}

          {/* Tab 2: Locations */}
          {activeTab === 'locations' && (
            <div className="cip-v2-panel-locations-list">
              {currentCauseData.locations.map((loc) => (
                <div key={loc.id} className="cip-v2-panel-loc-row">
                  <div className="cip-v2-panel-loc-left">
                    <div className="cip-v2-panel-loc-title">{loc.title}</div>
                    <div className="cip-v2-panel-loc-sub">{loc.subtitle}</div>
                  </div>
                  <div className="cip-v2-panel-loc-right">
                    <span className="cip-v2-panel-loc-line">{loc.line}</span>
                    <span className="cip-v2-panel-loc-time">{loc.lostTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Actions */}
          {activeTab === 'actions' && (
            <div className="cip-v2-panel-actions-list">
              {currentCauseData.actions.map((act) => (
                <div key={act.id} className="cip-v2-panel-act-row">
                  <div className="cip-v2-panel-act-timeframe">{act.timeframe}</div>
                  <div className="cip-v2-panel-act-content">
                    <div className="cip-v2-panel-act-category">{act.category}</div>
                    <div className="cip-v2-panel-act-desc">{act.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
