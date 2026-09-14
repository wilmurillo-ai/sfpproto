'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Candybar,
  KPICard,
  SidebarEquipment,
  ProductionExecution,
} from '@/components';
import type { CandybarTimeframe } from '@/components/shared/Candybar';
import type { ProductionOrderTab } from '@/components/shared/ProductionExecution';
import { Icon } from '@/components/ui';
import { useBreakpoint } from '@/lib/breakpoints';
import { getEquipmentData, getEquipmentCandybarSegments } from '@/lib/equipmentData';

export default function DashboardPage() {
  const { isTablet, isHydrated } = useBreakpoint();

  // State management
  const [timeframe, setTimeframe] = useState<CandybarTimeframe>('1hr');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('line-main');
  const [orderTab, setOrderTab] = useState<ProductionOrderTab>('processing');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Derived current equipment data and timeframe-sensitive segments
  const currentEquipment = getEquipmentData(selectedEquipment);
  const currentSegments = getEquipmentCandybarSegments(selectedEquipment, timeframe);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Timeframe options
  const timeframes: { id: CandybarTimeframe; label: string }[] = [
    { id: '1hr', label: '1hr' },
    { id: '4hr', label: '4hr' },
    { id: 'shift', label: 'Shift' },
    { id: '24hr', label: '24hr' },
  ];

  return (
    <div className="page-content" style={{ padding: '24px 32px' }}>
      <div className="dashboard-layout-root">
        {/* ===================================================================
            DESKTOP SIDEBAR COLUMN (Visible on screens >= 1180px)
            =================================================================== */}
        <div className="dashboard-sidebar-col">
          <SidebarEquipment
            state="expanded"
            selectedId={selectedEquipment}
            onSelectEquipment={(item) => setSelectedEquipment(item.id)}
            onMonitorClick={() => console.log('Open Equipment Monitor')}
          />
        </div>

        {/* ===================================================================
            TABLET DRAWER OVERLAY (Figma Node 10535:92036)
            Portaled directly to document.body for top: 0, left: 0 edge
            =================================================================== */}
        {isDrawerOpen &&
          isHydrated &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              className="dashboard-tablet-drawer-backdrop"
              onClick={() => setIsDrawerOpen(false)}
              aria-hidden="true"
            >
              <div
                className="dashboard-tablet-drawer-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <SidebarEquipment
                  state="expanded"
                  showHeader={true}
                  headerTitle="Line Equipment Status"
                  onClose={() => setIsDrawerOpen(false)}
                  selectedId={selectedEquipment}
                  onSelectEquipment={(item) => {
                    setSelectedEquipment(item.id);
                    setIsDrawerOpen(false);
                  }}
                  onMonitorClick={() => {
                    console.log('Open Equipment Monitor');
                    setIsDrawerOpen(false);
                  }}
                />
              </div>
            </div>,
            document.body
          )}

        {/* ===================================================================
            MAIN CONTENT COLUMN
            =================================================================== */}
        <div className="dashboard-content-col">
          {/* Top Bar Row */}
          <div className="dashboard-top-bar">
            {/* Left side: On Desktop (>=1180px) shows Line title; On Tablet (<1180px) shows collapsed pill */}
            <div className="dashboard-top-bar-left">
              {/* Desktop Header Title */}
              <div className="hide-on-tablet-flex dashboard-top-bar-left">
                <div className="dashboard-machine-icon">
                  <Icon name="precision_manufacturing" size="large" />
                </div>
                <h2 className="dashboard-line-title">{currentEquipment.headerTitle}</h2>
              </div>

              {/* Tablet Collapsed Pill Trigger */}
              <div className="show-on-tablet">
                <SidebarEquipment
                  state="collapsed"
                  lineName={currentEquipment.name}
                  lineStatus={currentEquipment.status}
                  onToggleState={() => setIsDrawerOpen(true)}
                  allowManualToggle={true}
                />
              </div>
            </div>

            {/* Right side: Timeframe Selector */}
            <div className="dashboard-timeframe-selector" role="group" aria-label="Timeframe selector">
              {timeframes.map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  className={`dashboard-tf-btn ${timeframe === tf.id ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf.id)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards Grid (4 columns on Desktop, 2x2 on Tablet) */}
          <div className="dashboard-kpi-grid">
            {/* 1. Net Efficiency */}
            <KPICard
              id="kpi-efficiency"
              title="Net Efficiency"
              value={currentEquipment.kpis.efficiency.value}
              unit="%"
              size="Regular"
              type="Simple"
              delta={currentEquipment.kpis.efficiency.delta}
              clickable={true}
              href="/efficiency"
              targetDelta={currentEquipment.kpis.efficiency.targetDelta}
              targetDeltaType={
                currentEquipment.kpis.efficiency.delta === 'Positive'
                  ? 'positive'
                  : currentEquipment.kpis.efficiency.delta === 'Negative'
                  ? 'negative'
                  : 'neutral'
              }
              secondaryDelta={currentEquipment.kpis.efficiency.secondaryDelta}
            />

            {/* 2. Waste */}
            <KPICard
              id="kpi-waste"
              title="Waste"
              value={currentEquipment.kpis.waste.value}
              unit="%"
              size="Regular"
              type="Simple"
              delta={currentEquipment.kpis.waste.delta}
              clickable={true}
              href="/waste"
              targetDelta={currentEquipment.kpis.waste.targetDelta}
              targetDeltaType={
                currentEquipment.kpis.waste.delta === 'Positive'
                  ? 'positive'
                  : currentEquipment.kpis.waste.delta === 'Negative'
                  ? 'negative'
                  : 'neutral'
              }
              secondaryDelta={currentEquipment.kpis.waste.secondaryDelta}
            />

            {/* 3. Rate Loss */}
            <KPICard
              id="kpi-rate"
              title="Rate Loss"
              value={currentEquipment.kpis.rateLoss.value}
              unit="%"
              size="Regular"
              type="Simple"
              delta={currentEquipment.kpis.rateLoss.delta}
              clickable={true}
              href="/rateloss"
              targetDelta={currentEquipment.kpis.rateLoss.targetDelta}
              targetDeltaType={
                currentEquipment.kpis.rateLoss.delta === 'Positive'
                  ? 'positive'
                  : currentEquipment.kpis.rateLoss.delta === 'Negative'
                  ? 'negative'
                  : 'neutral'
              }
              secondaryDelta={currentEquipment.kpis.rateLoss.secondaryDelta}
            />

            {/* 4. Downtime (Compound Card) */}
            <KPICard
              id="kpi-downtime"
              title="Downtime"
              value={currentEquipment.kpis.downtime.value}
              unit="%"
              size="Regular"
              type="Compound"
              delta={currentEquipment.kpis.downtime.delta}
              clickable={true}
              href="/downtimes"
              targetDelta={currentEquipment.kpis.downtime.targetDelta}
              targetDeltaType={
                currentEquipment.kpis.downtime.delta === 'Positive'
                  ? 'positive'
                  : currentEquipment.kpis.downtime.delta === 'Negative'
                  ? 'negative'
                  : 'neutral'
              }
              secondaryDelta={currentEquipment.kpis.downtime.secondaryDelta}
              subMetrics={currentEquipment.kpis.downtime.subMetrics}
            />
          </div>

          {/* Candybar Timeline Section */}
          <div className="dashboard-candybar-wrapper">
            <Candybar
              size="large"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              showTimeframeSelector={false}
              showSizeToggle={false}
              showLegend={true}
              showNowNeedle={true}
              segments={currentSegments}
            />
          </div>

          {/* Production Execution Section (Processing Order vs Packaging Orders) */}
          <ProductionExecution
            initialTab={orderTab}
            onTabChange={setOrderTab}
          />
        </div>
      </div>
    </div>
  );
}
