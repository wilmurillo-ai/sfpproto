'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';
import TankKPICard from '@/components/shared/TankKPICard';
import CIPAccordion, { type CIPLineData } from '@/components/shared/CIPAccordion';
import CIPDetailModal from '@/components/shared/CIPDetailModal';

// Initial Mock Data for CIP Lines
const INITIAL_CIP_LINES: CIPLineData[] = [
  {
    id: 'line-1',
    lineName: 'CIP Line 1',
    status: 'running',
    statusLabel: 'Running',
    recipeTarget: 'Type 2 → G4 Filler',
    activeCIPId: 'CIP-123456790',
    activeCIPProducts: 'Mirinda → KAS Naranja',
    overallProgress: {
      minutes: '11/12 min',
      percent: 92,
      started: '14:09',
      estCompletion: '14:21 (in 12 min)',
    },
    currentStage: {
      name: 'Alkali Cleaning',
      status: 'Running',
      minutes: '8/11 min',
      percent: 88,
      started: '14:09',
      estCompletion: '14:21',
    },
    telemetry: {
      temperature: {
        current: 82,
        unit: '°C',
        min: '75 °C min',
        max: '90 °C max',
        target: '80 – 85 °C',
        percentFill: 47,
      },
      flowRate: {
        current: 123,
        unit: 'L/min',
        min: '100 L/min min',
        max: '150 L/min max',
        target: '115 – 130 L/min',
        percentFill: 46,
      },
      conductivity: {
        current: 81,
        unit: 'µ S/cm',
        min: '70 µ S/cm min',
        max: '95 µ S/cm max',
        target: '78 – 85 µ S/cm',
        percentFill: 44,
      },
    },
  },
  {
    id: 'line-2',
    lineName: 'CIP Line 2',
    status: 'attention',
    statusLabel: 'Attention',
    recipeTarget: 'Type 1 → G2 Filler',
    activeCIPId: 'CIP-123456791',
    activeCIPProducts: 'Pepsi → Pepsi Max',
    overallProgress: {
      minutes: '6/15 min',
      percent: 40,
      started: '14:15',
      estCompletion: '14:30 (in 15 min)',
    },
    currentStage: {
      name: 'Pre Rinsing',
      status: 'Attention',
      minutes: '6/8 min',
      percent: 75,
      started: '14:15',
      estCompletion: '14:23',
    },
    telemetry: {
      temperature: {
        current: 76,
        unit: '°C',
        min: '75 °C min',
        max: '90 °C max',
        target: '80 – 85 °C',
        percentFill: 25,
      },
      flowRate: {
        current: 118,
        unit: 'L/min',
        min: '100 L/min min',
        max: '150 L/min max',
        target: '115 – 130 L/min',
        percentFill: 36,
      },
      conductivity: {
        current: 74,
        unit: 'µ S/cm',
        min: '70 µ S/cm min',
        max: '95 µ S/cm max',
        target: '78 – 85 µ S/cm',
        percentFill: 28,
      },
    },
  },
  {
    id: 'line-3',
    lineName: 'CIP Line 3',
    status: 'running',
    statusLabel: 'Running',
    recipeTarget: 'Type 2 → Tank-02',
    activeCIPId: 'CIP-123456792',
    activeCIPProducts: '7UP → Mountain Dew',
    overallProgress: {
      minutes: '14/18 min',
      percent: 78,
      started: '14:02',
      estCompletion: '14:20 (in 6 min)',
    },
    currentStage: {
      name: 'Acid Cleaning',
      status: 'Running',
      minutes: '4/6 min',
      percent: 67,
      started: '14:12',
      estCompletion: '14:18',
    },
    telemetry: {
      temperature: {
        current: 84,
        unit: '°C',
        min: '75 °C min',
        max: '90 °C max',
        target: '80 – 85 °C',
        percentFill: 60,
      },
      flowRate: {
        current: 127,
        unit: 'L/min',
        min: '100 L/min min',
        max: '150 L/min max',
        target: '115 – 130 L/min',
        percentFill: 54,
      },
      conductivity: {
        current: 83,
        unit: 'µ S/cm',
        min: '70 µ S/cm min',
        max: '95 µ S/cm max',
        target: '78 – 85 µ S/cm',
        percentFill: 52,
      },
    },
  },
  {
    id: 'line-4',
    lineName: 'CIP Line 4',
    status: 'stopped',
    statusLabel: 'Stopped',
    recipeTarget: 'Type 0 → Standby',
    activeCIPId: 'CIP-123456788',
    activeCIPProducts: 'Inactive / Standby',
    overallProgress: {
      minutes: '0/0 min',
      percent: 0,
      started: '--:--',
      estCompletion: '--:--',
    },
    currentStage: {
      name: 'Standby',
      status: 'Stopped',
      minutes: '0/0 min',
      percent: 0,
      started: '--:--',
      estCompletion: '--:--',
    },
    telemetry: {
      temperature: {
        current: 22,
        unit: '°C',
        min: '20 °C min',
        max: '30 °C max',
        target: 'Ambient',
        percentFill: 10,
      },
      flowRate: {
        current: 0,
        unit: 'L/min',
        min: '0 L/min min',
        max: '50 L/min max',
        target: '0 L/min',
        percentFill: 0,
      },
      conductivity: {
        current: 0,
        unit: 'µ S/cm',
        min: '0 µ S/cm min',
        max: '20 µ S/cm max',
        target: '0 µ S/cm',
        percentFill: 0,
      },
    },
  },
];

export default function CIPDashboardPage() {
  const [topTab, setTopTab] = useState<'overview' | 'analysis'>('overview');
  const [isTankStripCollapsed, setIsTankStripCollapsed] = useState(false);

  // Accordion open/collapse states (default: Line 1 open, others collapsed)
  const [openLineIds, setOpenLineIds] = useState<Record<string, boolean>>({
    'line-1': true,
    'line-2': false,
    'line-3': false,
    'line-4': false,
  });

  // Modal detail trigger state
  const [selectedDetailLineId, setSelectedDetailLineId] = useState<string | null>(null);

  const toggleLineAccordion = (id: string) => {
    setOpenLineIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenDetailModal = (lineId: string) => {
    setSelectedDetailLineId(lineId);
  };

  const handleCloseDetailModal = () => {
    setSelectedDetailLineId(null);
  };

  const activeLineData = INITIAL_CIP_LINES.find((l) => l.id === selectedDetailLineId) || INITIAL_CIP_LINES[0];

  return (
    <div className="cip-dashboard-page-root">
      {/* ================= TOP HEADER & SWITCHER ================= */}
      <div className="cip-page-header-row">
        <div className="cip-page-title-group">
          <h1 className="cip-page-title">Clean-In-Place Dashboard</h1>
        </div>

        {/* Overview vs Analysis Switcher */}
        <div className="cip-header-center-switcher">
          <div className="cip-view-pill-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={topTab === 'overview'}
              className={`cip-view-pill-btn ${topTab === 'overview' ? 'active' : ''}`}
              onClick={() => setTopTab('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={topTab === 'analysis'}
              className={`cip-view-pill-btn ${topTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setTopTab('analysis')}
            >
              Analysis
            </button>
          </div>
        </div>

        {/* Shift / Time Badge */}
        <div className="cip-header-meta-group">
          <span className="cip-meta-shift">12:45pm Shift 1</span>
          <span className="cip-meta-dot">·</span>
          <span className="cip-meta-updated">Last updated: 4 mins ago</span>
        </div>
      </div>

      {/* ================= TANK STATUS STRIP (COLLAPSIBLE) ================= */}
      <section className="cip-tank-section" aria-label="Tank Status Section">
        <div className="cip-tank-header-row">
          <h2 className="cip-section-heading">Tank Status</h2>
        </div>

        {!isTankStripCollapsed && (
          <div className="cip-tank-grid">
            <TankKPICard
              id="cip-tank-1"
              tankId="Tank-01"
              title="Hot Water"
              level={81}
              variant="green"
              temperature="80°C"
              minTemp="75ºC min"
              maxTemp="81ºC max"
              conductivity="78.53m S/Cm"
              minConductivity="min: 78.53m S/Cm"
            />
            <TankKPICard
              id="cip-tank-2"
              tankId="Tank-02"
              title="Rinse"
              level={81}
              variant="green"
              temperature="80°C"
              minTemp="75ºC min"
              maxTemp="81ºC max"
              conductivity="78.53m S/Cm"
              minConductivity="min: 78.53m S/Cm"
            />
            <TankKPICard
              id="cip-tank-3"
              tankId="Tank-03"
              title="Acid"
              level={77}
              variant="yellow"
              temperature="86°C"
              minTemp="75ºC min"
              maxTemp="81ºC max"
              conductivity="78.53m S/Cm"
              minConductivity="min: 78.53m S/Cm"
            />
            <TankKPICard
              id="cip-tank-4"
              tankId="Tank-04"
              title="Caustic"
              level={15}
              variant="red"
              temperature="86°C"
              minTemp="75ºC min"
              maxTemp="81ºC max"
              conductivity="78.76m S/Cm"
              minConductivity="min: 78.53m S/Cm"
              alertMessage="Conductivity: 78.76m S/Cm"
            />
          </div>
        )}

        {/* 100% Width Divider with Collapse Button */}
        <div className="cip-collapse-divider">
          <div className="cip-collapse-line" />
          <button
            type="button"
            className="cip-collapse-btn"
            onClick={() => setIsTankStripCollapsed(!isTankStripCollapsed)}
            aria-label={isTankStripCollapsed ? 'Expand Tank Status' : 'Collapse Tank Status'}
            aria-expanded={!isTankStripCollapsed}
          >
            <Icon
              name={isTankStripCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
              size="medium"
            />
          </button>
          <div className="cip-collapse-line" />
        </div>
      </section>

      {/* ================= CIP MONITORING SECTION ================= */}
      <section className="cip-monitoring-section" aria-label="CIP Monitoring Section">
        <div className="cip-monitoring-header">
          <h2 className="cip-section-heading">CIP Monitoring</h2>

          <button
            type="button"
            className="cip-pending-requests-btn"
            onClick={() => {}}
            title="View 3 Pending CIP Requests"
          >
            <span>Pending CIP Requests (3)</span>
            <Icon name="arrow_forward" size="small" />
          </button>
        </div>

        {/* Stacked Line Accordions */}
        <div className="cip-accordions-list">
          {INITIAL_CIP_LINES.map((line) => (
            <CIPAccordion
              key={line.id}
              line={line}
              isOpen={!!openLineIds[line.id]}
              onToggle={() => toggleLineAccordion(line.id)}
              onViewDetail={handleOpenDetailModal}
            />
          ))}
        </div>
      </section>

      {/* ================= CIP DETAIL MODAL ================= */}
      <CIPDetailModal
        isOpen={selectedDetailLineId !== null}
        onClose={handleCloseDetailModal}
        cipId={activeLineData.activeCIPId}
        lineName={activeLineData.lineName}
        productTransition={activeLineData.activeCIPProducts}
      />
    </div>
  );
}
