'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui';
import { CIPChartBlock, CIPLine } from './mockData';
import { CIPKPIKey } from './CIPKPIStrip';
import CIPRootCauseModal, {
  AlertBreakdownData,
  getAlertsForCause,
} from './CIPRootCauseModal';

interface CIPDayBreakdownProps {
  blocks: CIPChartBlock[];
  selectedBlockIndex: number | null;
  selectedLines: CIPLine[];
  activeKPI: CIPKPIKey | null;
}

export type StatusFilterType = 'completed' | 'on-time' | 'off-target';
export type MacroCategory = 'line' | 'target' | 'context';
export type DeviationMode = 'totals' | 'ramp-up' | 'skipped';

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
  rampMinutes?: number;
  skipCount?: number;
}

const CAUSE_DESCRIPTIONS: Record<string, string> = {
  'Temp Ramp': 'Thermal ramp rate failed to reach the required thermal target within expected timeframe across multiple wash cycles, causing cycle extension.',
  'Water Q': 'Water conductivity and rinse turbidity exceeded baseline tolerances, requiring extended pre-rinse purges to reach required specification.',
  'Elbow 12': 'Hydraulic flow turbulence and differential pressure drop detected across elbow EL-12, reducing scouring velocity.',
  'Chemicals': 'Chemical concentration titration delayed due to dosing pump slip and valve lag during chemical recirculation phases.',
  'Valve Switch': 'Actuator transition latency detected on manifold block diverter valves, extending phase change intervals.',
  'Flow Rate': 'Delivery flow rate fell below turbulence scouring threshold, extending run time to achieve equivalent cleaning action.',
  'Pre-Rinse': 'Initial turbidity purge cycle exceeded target duration due to residual heavy soil load.',
  'Sensor Check': 'Conductivity and optical sensor signal verification handshake delayed loop start.',
  'Heat Exchanger Fouling': 'Thermal transfer coefficient degradation across plate pack causing severe ramp delays.',
  'Acid Dosing Fault': 'Concentration titration failed to stabilize within tolerance, requiring automated corrective pulses.',
  'Pressure Drop L3': 'Excess hydraulic line resistance across line segment 3 triggering protective flow back-off.',
  'Drain Blockage': 'Gravity scavenge return line drainage velocity restricted, extending sump clearing interval.',
};

export default function CIPDayBreakdown({
  blocks,
  selectedBlockIndex,
}: CIPDayBreakdownProps) {
  // ── Level 2: Status Filter Tabs (Fully Completed, On-Time, Off-Target) ──
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('completed');

  // ── Filter Macro Level A: Active Category Tab (Context is now last) ──
  const [activeCategory, setActiveCategory] = useState<MacroCategory>('line');

  // ── Selected Filter Values for each category ──
  const [selectedLine, setSelectedLine] = useState<string>('All');
  const [selectedTarget, setSelectedTarget] = useState<string>('All');
  const [selectedContext, setSelectedContext] = useState<string>('All');

  // ── Phase Deviation Mode (Totals, Ramp-up, Skipped) ──
  const [deviationMode, setDeviationMode] = useState<DeviationMode>('totals');

  // ── Selected Cause / Deviation ──
  const [selectedCause, setSelectedCause] = useState<string>('Temp Ramp');

  // ── Modal State for Alert Breakdown ──
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<AlertBreakdownData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Contexts (Level 3 - now last category)
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

  // ── SFP Color Tokens for Phase Deviation: Red for totals, Orange for ramp-up, Yellow for skipped ──
  const phaseDeviationChartColor = useMemo(() => {
    if (deviationMode === 'ramp-up') return 'var(--orange-400, #e78710)';
    if (deviationMode === 'skipped') return 'var(--primitive-yellow-350, #d7ac01)';
    return 'var(--color-feedback-error-high-contrast, #fe7c5f)';
  }, [deviationMode]);

  // ── Dynamic Causes Calculation across the 3 Deviation Modes (Totals, Ramp-up, Skipped) ──
  const { causeList, refLineLabel, refLinePct } = useMemo(() => {
    // Determine base causes based on statusFilter
    let items: CauseItem[] = [];

    if (statusFilter === 'completed') {
      items = [
        { name: 'Water Q', lostMinutes: 30, pct: 50, subtext: '', rampMinutes: 6, skipCount: 3 },
        { name: 'Temp Ramp', lostMinutes: 23, pct: 38, subtext: '', rampMinutes: 18, skipCount: 1 },
        { name: 'Elbow 12', lostMinutes: 10, pct: 16, subtext: '', rampMinutes: 3, skipCount: 5 },
        { name: 'Chemicals', lostMinutes: 10, pct: 16, subtext: '', rampMinutes: 9, skipCount: 2 },
      ];
    } else if (statusFilter === 'on-time') {
      items = [
        { name: 'Valve Switch', lostMinutes: 14, pct: 42, subtext: '', rampMinutes: 4, skipCount: 2 },
        { name: 'Flow Rate', lostMinutes: 10, pct: 30, subtext: '', rampMinutes: 8, skipCount: 1 },
        { name: 'Pre-Rinse', lostMinutes: 6, pct: 18, subtext: '', rampMinutes: 5, skipCount: 3 },
        { name: 'Sensor Check', lostMinutes: 4, pct: 12, subtext: '', rampMinutes: 2, skipCount: 1 },
      ];
    } else {
      // off-target
      items = [
        { name: 'Heat Exchanger Fouling', lostMinutes: 48, pct: 52, subtext: '', rampMinutes: 24, skipCount: 4 },
        { name: 'Acid Dosing Fault', lostMinutes: 34, pct: 36, subtext: '', rampMinutes: 14, skipCount: 2 },
        { name: 'Pressure Drop L3', lostMinutes: 18, pct: 20, subtext: '', rampMinutes: 7, skipCount: 6 },
        { name: 'Drain Blockage', lostMinutes: 12, pct: 14, subtext: '', rampMinutes: 3, skipCount: 3 },
      ];
    }

    // Dynamic multipliers and ranking shifts based on selectedLine
    if (selectedLine !== 'All') {
      if (selectedLine === 'CIP 1') {
        // Line 1 has high heating / steam valve issues
        items = items.map((c) => {
          if (c.name === 'Temp Ramp' || c.name === 'Heat Exchanger Fouling' || c.name === 'Flow Rate') {
            return { ...c, lostMinutes: Math.round(c.lostMinutes * 1.55), rampMinutes: Math.round((c.rampMinutes || 5) * 1.6) };
          }
          if (c.name === 'Water Q' || c.name === 'Drain Blockage') {
            return { ...c, lostMinutes: Math.round(c.lostMinutes * 0.7), skipCount: Math.max(1, (c.skipCount || 2) - 1) };
          }
          return { ...c, lostMinutes: Math.round(c.lostMinutes * 0.85) };
        });
      } else if (selectedLine === 'CIP 2') {
        // Line 2 has heavy chemical and elbow friction issues
        items = items.map((c) => {
          if (c.name === 'Chemicals' || c.name === 'Acid Dosing Fault') {
            return { ...c, lostMinutes: Math.round(c.lostMinutes * 1.8), rampMinutes: Math.round((c.rampMinutes || 4) * 1.5) };
          }
          if (c.name === 'Elbow 12' || c.name === 'Pressure Drop L3') {
            return { ...c, lostMinutes: Math.round(c.lostMinutes * 1.7), skipCount: (c.skipCount || 2) + 2 };
          }
          return { ...c, lostMinutes: Math.max(3, Math.round(c.lostMinutes * 0.55)) };
        });
      } else if (selectedLine === 'CIP 3') {
        // Line 3 has high water quality / turbidity purge issues
        items = items.map((c) => {
          if (c.name === 'Water Q' || c.name === 'Drain Blockage' || c.name === 'Pre-Rinse') {
            return { ...c, lostMinutes: Math.round(c.lostMinutes * 1.65), skipCount: (c.skipCount || 2) + 2 };
          }
          if (c.name === 'Chemicals' || c.name === 'Acid Dosing Fault') {
            return { ...c, lostMinutes: Math.max(2, Math.round(c.lostMinutes * 0.5)) };
          }
          return c;
        });
      } else if (selectedLine === 'CIP 4') {
        // Line 4 has valve switch & elbow restrictions
        items = items.map((c) => {
          if (c.name === 'Elbow 12' || c.name === 'Valve Switch' || c.name === 'Pressure Drop L3') {
            return { ...c, lostMinutes: Math.round(c.lostMinutes * 1.75), skipCount: (c.skipCount || 2) + 3 };
          }
          return { ...c, lostMinutes: Math.max(3, Math.round(c.lostMinutes * 0.7)) };
        });
      } else if (selectedLine === 'CIP 5') {
        // Line 5 has temp ramp & flow rate issues
        items = items.map((c) => {
          if (c.name === 'Temp Ramp' || c.name === 'Flow Rate' || c.name === 'Heat Exchanger Fouling') {
            return { ...c, lostMinutes: Math.round(c.lostMinutes * 1.5), rampMinutes: Math.round((c.rampMinutes || 4) * 1.7) };
          }
          return { ...c, lostMinutes: Math.max(3, Math.round(c.lostMinutes * 0.75)) };
        });
      }
    }

    // Dynamic modulation based on selectedTarget
    if (selectedTarget !== 'All') {
      if (selectedTarget === 'MIX 01') {
        items = items.map((c) => {
          if (c.name === 'Elbow 12' || c.name === 'Pressure Drop L3') {
            return { ...c, lostMinutes: c.lostMinutes + 8, skipCount: (c.skipCount || 2) + 2 };
          }
          if (c.name === 'Temp Ramp' || c.name === 'Heat Exchanger Fouling') {
            return { ...c, lostMinutes: c.lostMinutes + 6, rampMinutes: (c.rampMinutes || 4) + 4 };
          }
          return c;
        });
      } else if (selectedTarget === 'CAN 02') {
        items = items.map((c) => {
          if (c.name === 'Chemicals' || c.name === 'Acid Dosing Fault') {
            return { ...c, lostMinutes: c.lostMinutes + 10, rampMinutes: (c.rampMinutes || 4) + 5 };
          }
          if (c.name === 'Water Q') {
            return { ...c, lostMinutes: c.lostMinutes + 6 };
          }
          return c;
        });
      } else if (selectedTarget === 'CAN 01') {
        items = items.map((c) => {
          if (c.name === 'Temp Ramp' || c.name === 'Heat Exchanger Fouling') {
            return { ...c, lostMinutes: c.lostMinutes + 12, rampMinutes: (c.rampMinutes || 4) + 6 };
          }
          return c;
        });
      } else if (selectedTarget === 'SYRUP A' || selectedTarget === 'SYRUP B') {
        items = items.map((c) => {
          if (c.name === 'Chemicals' || c.name === 'Acid Dosing Fault') {
            return { ...c, lostMinutes: c.lostMinutes + 14, rampMinutes: (c.rampMinutes || 4) + 6 };
          }
          return c;
        });
      } else if (selectedTarget === 'MIX 02' || selectedTarget === 'MIX 03') {
        items = items.map((c) => {
          if (c.name === 'Water Q' || c.name === 'Pre-Rinse' || c.name === 'Drain Blockage') {
            return { ...c, lostMinutes: c.lostMinutes + 10, skipCount: (c.skipCount || 2) + 2 };
          }
          return c;
        });
      }
    }

    // Dynamic modulation based on selectedContext
    if (selectedContext !== 'All') {
      if (selectedContext === 'Caustic B') {
        items = items.map((c) => {
          if (c.name === 'Chemicals' || c.name === 'Acid Dosing Fault') {
            return { ...c, lostMinutes: c.lostMinutes + 12, rampMinutes: (c.rampMinutes || 4) + 5 };
          }
          if (c.name === 'Temp Ramp' || c.name === 'Heat Exchanger Fouling') {
            return { ...c, lostMinutes: c.lostMinutes + 6, rampMinutes: (c.rampMinutes || 4) + 3 };
          }
          return c;
        });
      } else if (selectedContext === 'Caustic A') {
        items = items.map((c) => {
          if (c.name === 'Temp Ramp' || c.name === 'Heat Exchanger Fouling') {
            return { ...c, lostMinutes: c.lostMinutes + 15, rampMinutes: (c.rampMinutes || 4) + 7 };
          }
          return c;
        });
      } else if (selectedContext === 'Sanitize') {
        items = items.map((c) => {
          if (c.name === 'Water Q' || c.name === 'Pre-Rinse' || c.name === 'Drain Blockage') {
            return { ...c, lostMinutes: c.lostMinutes + 14, skipCount: (c.skipCount || 2) + 2 };
          }
          return c;
        });
      } else if (selectedContext === 'Acid Wash A') {
        items = items.map((c) => {
          if (c.name === 'Elbow 12' || c.name === 'Pressure Drop L3') {
            return { ...c, lostMinutes: c.lostMinutes + 9, skipCount: (c.skipCount || 2) + 2 };
          }
          if (c.name === 'Chemicals' || c.name === 'Acid Dosing Fault') {
            return { ...c, lostMinutes: c.lostMinutes + 7 };
          }
          return c;
        });
      }
    }

    // Compute total minutes for percentages
    const totalMinutes = items.reduce((sum, i) => sum + i.lostMinutes, 0) || 1;
    items = items.map((i) => ({
      ...i,
      pct: Math.min(95, Math.round((i.lostMinutes / totalMinutes) * 100)),
    }));

    // Re-sort according to deviationMode:
    if (deviationMode === 'ramp-up') {
      const sorted = [...items].sort((a, b) => (b.rampMinutes || 0) - (a.rampMinutes || 0));
      const maxRamp = sorted[0]?.rampMinutes || 1;
      const rampList: CauseItem[] = sorted.map((item) => {
        const rampPct = Math.round(((item.rampMinutes || 1) / maxRamp) * 85);
        return {
          ...item,
          pct: rampPct,
        };
      });
      const topRamp = sorted[0]?.rampMinutes || 5;
      return {
        refLineLabel: `Target Ramp-up: 5m`,
        refLinePct: Math.min(85, Math.max(25, Math.round((5 / topRamp) * 85))),
        causeList: rampList,
      };
    }

    if (deviationMode === 'skipped') {
      const sorted = [...items].sort((a, b) => (b.skipCount || 0) - (a.skipCount || 0));
      const maxSkips = sorted[0]?.skipCount || 1;
      const skippedList: CauseItem[] = sorted.map((item) => {
        const skipPct = Math.round(((item.skipCount || 1) / maxSkips) * 85);
        return {
          ...item,
          pct: skipPct,
        };
      });
      const topSkips = sorted[0]?.skipCount || 2;
      return {
        refLineLabel: `Tolerance: 2 skips`,
        refLinePct: Math.min(85, Math.max(30, Math.round((2 / topSkips) * 85))),
        causeList: skippedList,
      };
    }

    // Default: 'totals'
    const sortedTotals = [...items].sort((a, b) => b.lostMinutes - a.lostMinutes);
    const topPct = sortedTotals[0]?.pct || 50;
    const refPct = Math.min(90, Math.max(65, Math.round(topPct * 1.4)));
    return {
      refLineLabel: `${refPct}% Loss Time`,
      refLinePct: refPct,
      causeList: sortedTotals,
    };
  }, [statusFilter, selectedLine, selectedTarget, selectedContext, deviationMode]);

  // Synchronize selectedCause if it is not present in the current status tab's causes
  useEffect(() => {
    if (causeList.length > 0 && !causeList.some((c) => c.name === selectedCause)) {
      setSelectedCause(causeList[0].name);
    }
  }, [causeList, selectedCause]);

  // Selected cause description (Block 1)
  const currentCauseDescription = useMemo(() => {
    return (
      CAUSE_DESCRIPTIONS[selectedCause] ||
      `${selectedCause} deviation detected across execution run cycles, resulting in cumulative time loss and phase step prolongation.`
    );
  }, [selectedCause]);

  // Selected cause alert metrics (Block 2 - shift removed)
  const currentMetrics = useMemo(() => {
    const isOffTarget = statusFilter === 'off-target';
    const isOnTime = statusFilter === 'on-time';
    const activeItem = causeList.find((c) => c.name === selectedCause);
    const lostTimeStr = activeItem ? `${activeItem.lostMinutes}m` : isOffTarget ? '48m' : isOnTime ? '14m' : '23m';

    const eventsCount = activeItem ? Math.max(1, Math.round(activeItem.lostMinutes / 6)) : isOffTarget ? 6 : 3;
    const runsCount = Math.max(1, Math.min(eventsCount, Math.round(eventsCount * 0.75)));

    return {
      timeLost: lostTimeStr,
      occurrences: `${eventsCount}`,
      runsAffected: `${runsCount}`,
      worstLine: selectedLine !== 'All' ? selectedLine : activeItem?.name === 'Temp Ramp' ? 'CIP 1' : activeItem?.name === 'Chemicals' ? 'CIP 2' : 'CIP 3',
    };
  }, [statusFilter, selectedCause, selectedLine, causeList]);

  // Selected cause alerts table (Block 3)
  const currentAlerts = useMemo(() => {
    const minutes = parseInt(currentMetrics.timeLost, 10) || 20;
    return getAlertsForCause(selectedCause, minutes, phaseDeviationChartColor);
  }, [selectedCause, currentMetrics.timeLost, phaseDeviationChartColor]);

  // ── Handler for Reset All button (Level A) ──
  const handleResetAll = () => {
    setSelectedLine('All');
    setSelectedTarget('All');
    setSelectedContext('All');
    setActiveCategory('line');
  };

  // ── Handler for selecting options in Level B (with toggle support) ──
  const handleSelectOption = (name: string) => {
    if (activeCategory === 'line') {
      setSelectedLine((prev) => (prev === name ? 'All' : name));
    } else if (activeCategory === 'target') {
      setSelectedTarget((prev) => (prev === name ? 'All' : name));
    } else if (activeCategory === 'context') {
      setSelectedContext((prev) => (prev === name ? 'All' : name));
    }
  };

  // ── Handler for opening alert modal ──
  const handleOpenAlertModal = (alert: AlertBreakdownData) => {
    setSelectedAlertForModal(alert);
    setIsModalOpen(true);
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

          {/* Tab 2: On-Time */}
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

      {/* ── 2. MACRO FILTER COMPONENT (Line, Target, Context - Phases removed, Context is last) ── */}
      <div className="cip-v2-macro-filter-container" data-node-id="29416:7281">
        {/* Filter Macro Level A (Category Tabs + Reset All) */}
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

            {/* Tab 3: Context (Last of list) */}
            <button
              type="button"
              className={`cip-v2-macro-a-tab is-last ${activeCategory === 'context' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('context')}
              data-node-id="29416:7266"
            >
              <span className="cip-v2-macro-a-label">Context:</span>
              <span className="cip-v2-macro-a-val">{selectedContext}</span>
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

        {/* Filter Macro Level B (Drilldown Options) */}
        <div className="cip-v2-macro-level-b-wrapper" data-node-id="29232:38141">
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

          <div
            ref={scrollRef}
            className="cip-v2-macro-level-b-scroll"
            onScroll={checkScrollState}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {activeCategory === 'line' && (
              <>
                <button
                  type="button"
                  className={`cip-v2-macro-b-all-btn ${selectedLine === 'All' ? 'is-active' : ''}`}
                  onClick={() => handleSelectOption('All')}
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
                        style={{ width: `${opt.pct}%`, background: opt.barColor || '#e34119' }}
                      />
                    </div>
                  </button>
                ))}
              </>
            )}

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
                        style={{ width: `${opt.pct}%`, background: opt.barColor || '#e34119' }}
                      />
                    </div>
                  </button>
                ))}
              </>
            )}

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
                        style={{ width: `${opt.pct}%`, background: opt.barColor || '#e34119' }}
                      />
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          {canScrollRight && (
            <button
              type="button"
              className="cip-v2-macro-scroll-arrow is-right"
              onClick={() => handleScrollClick('right')}
              aria-label="Scroll right"
            >
              <Icon name="chevron_right" size="medium" />
            </button>
          )}
        </div>
      </div>

      {/* ── 3. PHASE DEVIATION & CONSOLIDATED ALERTS BREAKDOWN PANEL (Figma 29602-7550 & 29670-47956) ── */}
      <div className="cip-v2-causebreakdown-box" data-node-id="29327:41727">
        {/* Left Column: Phase Deviation (around 40% width) */}
        <div className="cip-v2-causes-col">
          <div className="cip-v2-causes-header">
            <h3 className="cip-v2-causes-title">Phase Deviation</h3>

            {/* 3 Modes Switcher: Totals, Ramp-up, Skipped */}
            <div className="cip-v2-deviation-mode-toggle" role="tablist" aria-label="Phase deviation view mode">
              <button
                type="button"
                className={`cip-v2-mode-btn ${deviationMode === 'totals' ? 'is-active' : ''}`}
                onClick={() => setDeviationMode('totals')}
                role="tab"
                aria-selected={deviationMode === 'totals'}
              >
                Totals
              </button>
              <button
                type="button"
                className={`cip-v2-mode-btn ${deviationMode === 'ramp-up' ? 'is-active' : ''}`}
                onClick={() => setDeviationMode('ramp-up')}
                role="tab"
                aria-selected={deviationMode === 'ramp-up'}
              >
                Ramp-up
              </button>
              <button
                type="button"
                className={`cip-v2-mode-btn ${deviationMode === 'skipped' ? 'is-active' : ''}`}
                onClick={() => setDeviationMode('skipped')}
                role="tab"
                aria-selected={deviationMode === 'skipped'}
              >
                Skipped
              </button>
            </div>
          </div>

          <div className="cip-v2-causes-list-container">
            {/* Reference Line overlay */}
            <div
              className="cip-v2-ref-line-overlay"
              style={{ left: `calc(143px + 12px + (100% - 143px - 44px) * ${refLinePct / 100})` }}
            >
              <div className="cip-v2-ref-label" style={{ color: phaseDeviationChartColor }}>{refLineLabel}</div>
              <div className="cip-v2-ref-line" style={{ background: phaseDeviationChartColor }} />
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
                    style={isSelected ? { borderColor: phaseDeviationChartColor } : undefined}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${cause.name} deviation`}
                  >
                    <div className="cip-v2-cause-label-box">
                      <span className="cip-v2-cause-name">{cause.name}</span>
                      <span className="cip-v2-cause-subtext">
                        {deviationMode === 'totals' && (
                          <>
                            <strong>{cause.lostMinutes}m</strong> ({cause.pct}%)
                          </>
                        )}
                        {deviationMode === 'ramp-up' && (
                          <>
                            <strong>{cause.rampMinutes}m</strong> ramp-up • <strong>{cause.lostMinutes}m</strong> lost
                          </>
                        )}
                        {deviationMode === 'skipped' && (
                          <>
                            <strong>{cause.skipCount} {cause.skipCount === 1 ? 'skip' : 'skips'}</strong> • <strong>{cause.lostMinutes}m</strong> lost
                          </>
                        )}
                      </span>
                    </div>

                    <div className="cip-v2-cause-bar-track">
                      <div
                        className="cip-v2-cause-bar-fill"
                        style={{
                          width: `${cause.pct}%`,
                          background: phaseDeviationChartColor,
                        }}
                      />
                    </div>

                    <div className="cip-v2-cause-chevron">
                      <Icon name="chevron_right" size="medium" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Consolidated Alerts Breakdown Sidepanel (around 60% width) - 3 Simple Blocks (Figma 29670:47956) */}
        <div className="cip-v2-sidepanel-col">
          {/* BLOCK 1: Title and Description */}
          <div className="cip-v2-panel-block is-title-block">
            <div className="cip-v2-panel-title-row">
              <h2 className="cip-v2-panel-title">{selectedCause}</h2>
              <span className="cip-v2-panel-badge">Phase Deviation Alert</span>
            </div>
            <p className="cip-v2-panel-description">
              {currentCauseDescription}
            </p>
          </div>

          {/* BLOCK 2: Alert Metrics (Shift metric removed) */}
          <div className="cip-v2-panel-block is-metrics-block">
            <div className="cip-v2-panel-metric-card">
              <span className="cip-v2-panel-metric-label">Time Lost</span>
              <span className="cip-v2-panel-metric-val">{currentMetrics.timeLost}</span>
            </div>
            <div className="cip-v2-panel-metric-card">
              <span className="cip-v2-panel-metric-label">Occurrences</span>
              <span className="cip-v2-panel-metric-val">{currentMetrics.occurrences}</span>
            </div>
            <div className="cip-v2-panel-metric-card">
              <span className="cip-v2-panel-metric-label">Runs Affected</span>
              <span className="cip-v2-panel-metric-val">{currentMetrics.runsAffected}</span>
            </div>
            <div className="cip-v2-panel-metric-card">
              <span className="cip-v2-panel-metric-label">Worst Line</span>
              <span className="cip-v2-panel-metric-val">{currentMetrics.worstLine}</span>
            </div>
          </div>

          {/* BLOCK 3: Alerts by Time Table (with ellipsis & whole row clickable to open modal) */}
          <div className="cip-v2-panel-block is-table-block">
            <div className="cip-v2-alerts-table-header-row">
              <h4 className="cip-v2-alerts-table-title">Alerts by Time</h4>
              <span className="cip-v2-alerts-table-count">{currentAlerts.length} recorded</span>
            </div>

            <div className="cip-v2-alerts-table-container">
              <div className="cip-v2-alerts-table-head">
                <span className="cip-col-name">Alert Name</span>
                <span className="cip-col-events">Events</span>
                <span className="cip-col-lost">Time Lost</span>
                <span className="cip-col-pareto">Impact</span>
                <span className="cip-col-action"></span>
              </div>

              <div className="cip-v2-alerts-table-body">
                {currentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="cip-v2-alert-row"
                    onClick={() => handleOpenAlertModal(alert)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View full breakdown for ${alert.name}`}
                  >
                    <div className="cip-col-name">
                      <span className="cip-alert-row-name">{alert.name}</span>
                      <span className="cip-alert-row-sub">{alert.subtitle}</span>
                    </div>

                    <div className="cip-col-events">
                      <span className="cip-alert-events-badge">{alert.eventsCount}x</span>
                    </div>

                    <div className="cip-col-lost">
                      <span className="cip-alert-time-lost">{alert.lostTime}</span>
                    </div>

                    <div className="cip-col-pareto">
                      <div className="cip-mini-pareto-track">
                        <div
                          className="cip-mini-pareto-fill"
                          style={{ width: `${alert.paretoPct}%`, background: phaseDeviationChartColor }}
                        />
                      </div>
                      <span className="cip-mini-pareto-pct">{alert.paretoPct}%</span>
                    </div>

                    <div className="cip-col-action">
                      <button
                        type="button"
                        className="cip-alert-ellipsis-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAlertModal(alert);
                        }}
                        aria-label={`More details for ${alert.name}`}
                      >
                        <Icon name="more_vert" size="medium" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. FULL ALERT BREAKDOWN MODAL (Comments & Events tabs - Figma 29693:48809) ── */}
      <CIPRootCauseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alertData={selectedAlertForModal}
        levelColor={phaseDeviationChartColor}
      />
    </div>
  );
}
