'use client';

import React from 'react';
import { Icon } from '@/components/ui';
import { CIPKPISummary } from './mockData';

export type CIPKPIKey = 'fullyCompleted' | 'onTimeRate' | 'offTargetRate' | 'totalOverrunTime' | 'shiftSpreadDelta';

interface CIPKPIStripProps {
  summary: CIPKPISummary;
  activeKPI: CIPKPIKey | null;
  onSelectKPI: (key: CIPKPIKey | null) => void;
}

export default function CIPKPIStrip({ summary, activeKPI, onSelectKPI }: CIPKPIStripProps) {
  const cards: Array<{
    key: CIPKPIKey;
    title: string;
    value: string;
    badge?: { text: string; type: 'green' | 'orange' | 'icon-orange' };
    footer: string;
    hasAccent?: boolean;
  }> = [
    {
      key: 'fullyCompleted',
      title: 'Fully Completed',
      value: `${summary.fullyCompleted || 32} Runs`,
      badge: { text: '▲ 2% vs Target', type: 'green' },
      footer: 'Strictly Completed (aborts excluded)',
    },
    {
      key: 'onTimeRate',
      title: 'On-Time Rate',
      value: `${summary.onTimeRate || 87.5}%`,
      badge: { text: 'Behind Target', type: 'orange' },
      footer: 'Fixed Standard: 90%',
      hasAccent: true,
    },
    {
      key: 'offTargetRate',
      title: 'Off-Target Rate',
      value: `${summary.offTimeRate || 22.5}%`,
      badge: { text: 'Out of Target', type: 'icon-orange' },
      footer: 'Target:18%',
    },
    {
      key: 'totalOverrunTime',
      title: 'Total Overrun Time',
      value: '2h 20m',
      badge: { text: 'Behind', type: 'orange' },
      footer: 'Line Availability Slip',
      hasAccent: true,
    },
    {
      key: 'shiftSpreadDelta',
      title: 'Shift Spread Delta',
      value: '25.0 pts',
      footer: 'Best: Shift 1 | Worst: Shift 3',
    },
  ];

  return (
    <div className="cip-kpi-strip" role="group" aria-label="CIP KPI Summary">
      {cards.map((card) => {
        const isActive = activeKPI === card.key;
        const isDimmed = activeKPI !== null && !isActive;

        return (
          <button
            key={card.key}
            type="button"
            className={`cip-kpi-card ${isActive ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''} ${card.hasAccent ? 'has-orange-accent' : ''}`}
            onClick={() => onSelectKPI(isActive ? null : card.key)}
            aria-pressed={isActive}
          >
            <div className="cip-kpi-card-header">
              <span className="cip-kpi-card-label">{card.title}</span>
              {isActive && (
                <span
                  className="cip-kpi-card-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectKPI(null);
                  }}
                  title="Clear filter"
                >
                  <Icon name="close" size="small" />
                </span>
              )}
            </div>

            <div className="cip-kpi-card-value">{card.value}</div>

            <div className="cip-kpi-card-meta">
              {card.badge && (
                <div className={`cip-kpi-badge cip-kpi-badge-${card.badge.type}`}>
                  {card.badge.type === 'icon-orange' && (
                    <Icon name="warning" size="small" className="cip-kpi-badge-icon" />
                  )}
                  {card.badge.text}
                </div>
              )}
            </div>

            <div className="cip-kpi-card-subtext">{card.footer}</div>
          </button>
        );
      })}
    </div>
  );
}
