'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui';

export type RootCauseTab = 'summary' | 'locations' | 'actions';

export interface RootCauseSummaryMetrics {
  timeLost: string;
  occurrences: string;
  runsAffected: string;
  worstTime: string;
  shift: string;
}

export interface RootCauseLocationItem {
  id: string;
  title: string;
  subtitle: string;
  line: string;
  lostTime: string;
}

export interface RootCauseActionItem {
  id: string;
  timeframe: string;
  category: string;
  description: string;
}

export interface RootCauseDetailData {
  displayTitle: string;
  subtitle: string;
  summary: RootCauseSummaryMetrics;
  locations: RootCauseLocationItem[];
  actions: RootCauseActionItem[];
}

export const ROOT_CAUSE_DETAILS: Record<string, RootCauseDetailData> = {
  'Water Q': {
    displayTitle: 'Water-Q',
    subtitle: 'Root Cause Details',
    summary: {
      timeLost: '23m',
      occurrences: '3',
      runsAffected: '3',
      worstTime: 'CIP 1',
      shift: 'S3',
    },
    locations: [
      {
        id: 'loc-1',
        title: 'Return Line Purge (1x)',
        subtitle: 'Pre Rinse',
        line: 'CIP1, CIP 2',
        lostTime: '10m Lost',
      },
      {
        id: 'loc-2',
        title: 'Drain Check (2x)',
        subtitle: 'Pre Rinse',
        line: 'CIP 2',
        lostTime: '10m Lost',
      },
      {
        id: 'loc-3',
        title: 'Conductivity Check (2x)',
        subtitle: 'Pre Rinse',
        line: 'CIP1',
        lostTime: '10m Lost',
      },
      {
        id: 'loc-4',
        title: 'Return Line Purge (1x)',
        subtitle: 'Pre Rinse',
        line: 'CIP1, CIP 2',
        lostTime: '10m Lost',
      },
      {
        id: 'loc-5',
        title: 'Drain Check (2x)',
        subtitle: 'Pre Rinse',
        line: 'CIP 2',
        lostTime: '10m Lost',
      },
      {
        id: 'loc-6',
        title: 'Conductivity Check (2x)',
        subtitle: 'Pre Rinse',
        line: 'CIP1',
        lostTime: '10m Lost',
      },
    ],
    actions: [
      {
        id: 'act-1',
        timeframe: 'NOW',
        category: 'Utilities',
        description: 'Check Incoming water conductivity and hardnedd at the CIP skid inlet',
      },
      {
        id: 'act-2',
        timeframe: 'This Week',
        category: 'Maintainance',
        description: 'Check Incoming water conductivity and hardnedd at the CIP skid inlet',
      },
    ],
  },
  'Chemicals': {
    displayTitle: 'Chemicals',
    subtitle: 'Root Cause Details',
    summary: {
      timeLost: '30m',
      occurrences: '4',
      runsAffected: '4',
      worstTime: 'CIP 2',
      shift: 'S2',
    },
    locations: [
      {
        id: 'chem-loc-1',
        title: 'Dosing Manifold Delivery (2x)',
        subtitle: 'Caustic Wash',
        line: 'CIP 2, CIP 3',
        lostTime: '14m Lost',
      },
      {
        id: 'chem-loc-2',
        title: 'Conductivity Titration Check',
        subtitle: 'Caustic Wash',
        line: 'CIP 1',
        lostTime: '8m Lost',
      },
      {
        id: 'chem-loc-3',
        title: 'Acid Neutralization Skid',
        subtitle: 'Acid Wash',
        line: 'CIP 2',
        lostTime: '8m Lost',
      },
      {
        id: 'chem-loc-4',
        title: 'Bulk Day Tank Metering Pump',
        subtitle: 'Pre Rinse / Caustic',
        line: 'CIP 1, CIP 3',
        lostTime: '6m Lost',
      },
    ],
    actions: [
      {
        id: 'chem-act-1',
        timeframe: 'NOW',
        category: 'Chemical Skid',
        description: 'Calibrate caustic concentrate dosing metering stroke and flow transmitter',
      },
      {
        id: 'chem-act-2',
        timeframe: 'This Week',
        category: 'Maintainance',
        description: 'Inspect chemical dosing diaphragm pumps and suction line check valves',
      },
    ],
  },
  'Temp Ramp': {
    displayTitle: 'Temp Ramp',
    subtitle: 'Root Cause Details',
    summary: {
      timeLost: '22m',
      occurrences: '3',
      runsAffected: '2',
      worstTime: 'CIP 3',
      shift: 'S1',
    },
    locations: [
      {
        id: 'temp-loc-1',
        title: 'Plate Heat Exchanger PHE-01',
        subtitle: 'Caustic Wash',
        line: 'CIP 3',
        lostTime: '12m Lost',
      },
      {
        id: 'temp-loc-2',
        title: 'Steam Control Regulating Loop',
        subtitle: 'Pre-Heat',
        line: 'CIP 1, CIP 2',
        lostTime: '10m Lost',
      },
      {
        id: 'temp-loc-3',
        title: 'Condensate Return Scavenge Loop',
        subtitle: 'Hot Rinse',
        line: 'CIP 2',
        lostTime: '6m Lost',
      },
    ],
    actions: [
      {
        id: 'temp-act-1',
        timeframe: 'NOW',
        category: 'Steam Plant',
        description: 'Verify boiler header supply pressure and purge condensate steam trap',
      },
      {
        id: 'temp-act-2',
        timeframe: 'This Week',
        category: 'Maintainance',
        description: 'Descaling inspection on secondary loop PHE plates',
      },
    ],
  },
  'Elbow 12': {
    displayTitle: 'Elbow 12',
    subtitle: 'Root Cause Details',
    summary: {
      timeLost: '13m',
      occurrences: '2',
      runsAffected: '2',
      worstTime: 'CIP 2',
      shift: 'S2',
    },
    locations: [
      {
        id: 'el12-loc-1',
        title: 'Process Header Bend EL-12',
        subtitle: 'Pre Rinse',
        line: 'CIP 2',
        lostTime: '8m Lost',
      },
      {
        id: 'el12-loc-2',
        title: 'Flow Scouring Restriction Zone',
        subtitle: 'Pre Rinse',
        line: 'CIP 1',
        lostTime: '5m Lost',
      },
    ],
    actions: [
      {
        id: 'el12-act-1',
        timeframe: 'NOW',
        category: 'Operations',
        description: 'Inspect pipeline line clamp and differential pressure transducer across EL-12',
      },
      {
        id: 'el12-act-2',
        timeframe: 'This Week',
        category: 'Maintainance',
        description: 'Borescope internal surface inspection on 90-degree sweep elbow',
      },
    ],
  },
  'Elbow 14': {
    displayTitle: 'Elbow 14',
    subtitle: 'Root Cause Details',
    summary: {
      timeLost: '9m',
      occurrences: '2',
      runsAffected: '1',
      worstTime: 'CIP 1',
      shift: 'S3',
    },
    locations: [
      {
        id: 'el14-loc-1',
        title: 'Return Loop Drainage Bend EL-14',
        subtitle: 'Intermediate Rinse',
        line: 'CIP 1',
        lostTime: '5m Lost',
      },
      {
        id: 'el14-loc-2',
        title: 'Sump Recovery Riser',
        subtitle: 'Final Rinse',
        line: 'CIP 1, CIP 2',
        lostTime: '4m Lost',
      },
    ],
    actions: [
      {
        id: 'el14-act-1',
        timeframe: 'NOW',
        category: 'Sanitation',
        description: 'Check scavenge return pump flow velocity and drain slope alignment',
      },
      {
        id: 'el14-act-2',
        timeframe: 'This Week',
        category: 'Maintainance',
        description: 'Replace hygienic silicone clamp gaskets at elbow flanged connection',
      },
    ],
  },
};

interface CIPRootCauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementName: string | null;
  activeLine?: string;
  activeTarget?: string;
  activeContext?: string;
  activePhase?: string;
  levelColor?: string;
}

export default function CIPRootCauseModal({
  isOpen,
  onClose,
  elementName,
}: CIPRootCauseModalProps) {
  const [activeTab, setActiveTab] = useState<RootCauseTab>('summary');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset tab to summary whenever opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab('summary');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') {
    return null;
  }

  const normalizedKey = elementName || 'Water Q';
  const data: RootCauseDetailData =
    ROOT_CAUSE_DETAILS[normalizedKey] ||
    ROOT_CAUSE_DETAILS[normalizedKey.replace('-', ' ')] ||
    ROOT_CAUSE_DETAILS['Water Q'];

  return createPortal(
    <div
      className="cip-root-cause-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="cip-root-cause-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${data.displayTitle} - Root Cause Details`}
        onClick={(e) => e.stopPropagation()}
        data-node-id="29354:1294240"
      >
        {/* Top Header */}
        <div className="cip-rc-header" data-node-id="29354:1294026">
          <div className="cip-rc-header-title-box">
            <h2 className="cip-rc-header-title">{data.displayTitle}</h2>
            <h3 className="cip-rc-header-subtitle">{data.subtitle}</h3>
          </div>

          <button
            type="button"
            className="cip-rc-close-btn"
            onClick={onClose}
            aria-label="Close root cause details"
            data-node-id="29354:1294023"
          >
            <Icon name="close" size="large" />
          </button>
        </div>

        {/* Secondary Tabs */}
        <div className="cip-rc-tabs" data-node-id="29354:1292959">
          <button
            type="button"
            className={`cip-rc-tab-item ${activeTab === 'summary' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>

          <button
            type="button"
            className={`cip-rc-tab-item ${activeTab === 'locations' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            Locations
          </button>

          <button
            type="button"
            className={`cip-rc-tab-item ${activeTab === 'actions' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
        </div>

        {/* Tab 1: Summary */}
        {activeTab === 'summary' && (
          <div className="cip-rc-summary-grid" data-node-id="29354:1292960">
            <div className="cip-rc-metric-card">
              <span className="cip-rc-metric-label">Time Lost</span>
              <span className="cip-rc-metric-value">{data.summary.timeLost}</span>
            </div>

            <div className="cip-rc-metric-card">
              <span className="cip-rc-metric-label">Occurrencies</span>
              <span className="cip-rc-metric-value">{data.summary.occurrences}</span>
            </div>

            <div className="cip-rc-metric-card">
              <span className="cip-rc-metric-label">Runs Affected</span>
              <span className="cip-rc-metric-value">{data.summary.runsAffected}</span>
            </div>

            <div className="cip-rc-metric-card">
              <span className="cip-rc-metric-label">Worst Time</span>
              <span className="cip-rc-metric-value">{data.summary.worstTime}</span>
            </div>

            <div className="cip-rc-metric-card">
              <span className="cip-rc-metric-label">Shift</span>
              <span className="cip-rc-metric-value">{data.summary.shift}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Locations */}
        {activeTab === 'locations' && (
          <div className="cip-rc-locations-list" data-node-id="29354:1294036">
            {data.locations.map((loc) => (
              <div key={loc.id} className="cip-rc-location-row">
                <div className="cip-rc-loc-left">
                  <div className="cip-rc-loc-title">{loc.title}</div>
                  <div className="cip-rc-loc-subtitle">{loc.subtitle}</div>
                </div>

                <div className="cip-rc-loc-right">
                  <span className="cip-rc-loc-line">{loc.line}</span>
                  <span className="cip-rc-loc-lost">{loc.lostTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Actions */}
        {activeTab === 'actions' && (
          <div className="cip-rc-actions-list" data-node-id="29354:1294173">
            {data.actions.map((act) => (
              <div key={act.id} className="cip-rc-action-row">
                <div className="cip-rc-act-timeframe">{act.timeframe}</div>

                <div className="cip-rc-act-content">
                  <div className="cip-rc-act-category">{act.category}</div>
                  <div className="cip-rc-act-desc">{act.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
