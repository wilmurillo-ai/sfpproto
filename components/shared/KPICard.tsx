'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui';

export type KPICardSize = 'Regular' | 'Large';
export type KPICardType = 'Simple' | 'Compound';
export type KPICardDelta = 'Positive' | 'Negative' | 'Neutral';
export type KPICardState = 'Default' | 'Empty' | 'Error';

export interface KPISubMetric {
  value: string | number;
  unit?: string;
  label: string;
}

export interface KPICardProps {
  className?: string;
  title: string;
  value?: string | number;
  unit?: string;
  size?: KPICardSize;
  type?: KPICardType;
  delta?: KPICardDelta;
  state?: KPICardState;
  clickable?: boolean;
  href?: string;
  onClick?: () => void;
  // Target delta tag (e.g. "2% vs Target", "▲ 0.2% vs Target")
  targetDelta?: string;
  targetDeltaType?: 'positive' | 'negative' | 'neutral';
  // Secondary comparison line (e.g. "+2.4% vs. last hr")
  secondaryDelta?: string;
  secondaryDeltaIcon?: string;
  // Sub-metrics for Compound variant (up to 3 items)
  subMetrics?: KPISubMetric[];
  // Sparkline/trend icon next to main value
  showTrendIcon?: boolean;
  trendIconName?: string;
  // Messages for Empty or Error states
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  id?: string;
}

export default function KPICard({
  className = '',
  title,
  value,
  unit,
  size = 'Regular',
  type = 'Simple',
  delta = 'Positive',
  state = 'Default',
  clickable = true,
  href,
  onClick,
  targetDelta,
  targetDeltaType,
  secondaryDelta,
  secondaryDeltaIcon,
  subMetrics = [],
  showTrendIcon = true,
  trendIconName,
  emptyMessage = 'Try again later',
  errorMessage = 'Refresh Page',
  onRetry,
  id,
}: KPICardProps) {
  const isPositive = delta === 'Positive';
  const isNegative = delta === 'Negative';
  const isNeutral = delta === 'Neutral';

  const isCompound = type === 'Compound';
  const isLarge = size === 'Large';
  const isClickable = clickable || !!href || !!onClick;

  // Resolve target delta pill style
  const resolvedTargetType = targetDeltaType || (isPositive ? 'positive' : isNegative ? 'negative' : 'neutral');

  // Trend icon next to main value
  const defaultTrendIcon = trendIconName || (isPositive ? 'trending_up' : isNegative ? 'trending_down' : 'trending_flat');

  // Values depending on state
  const displayValue =
    state === 'Error'
      ? 'Error'
      : state === 'Empty'
      ? 'N/A'
      : value !== undefined
      ? `${value}${unit ? unit : ''}`
      : '—';

  const cardContent = (
    <div
      id={id}
      className={`kpi-card ${isLarge ? 'kpi-card-large' : 'kpi-card-regular'} ${
        isCompound ? 'kpi-card-compound' : 'kpi-card-simple'
      } delta-${delta.toLowerCase()} state-${state.toLowerCase()} ${
        isClickable ? 'is-clickable' : ''
      } ${className}`.trim()}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* 4px Colored Accent Bar on the Left Edge */}
      <div className="kpi-card-accent-bar" aria-hidden="true" />

      {/* Main Body */}
      <div className="kpi-card-body">
        {/* Left Column (Primary Metric) */}
        <div className="kpi-card-main-col">
          {/* Header Row: Title & Clickable Arrow (if simple) */}
          <div className="kpi-card-header-row">
            <span className="kpi-card-title">{title}</span>
            {!isCompound && isClickable && (
              <div className="kpi-card-nav-icon" title="View details">
                <Icon name="north_east" size="small" />
              </div>
            )}
          </div>

          {/* Value Block */}
          <div className="kpi-card-value-block">
            <div className="kpi-card-value-row">
              <span className="kpi-card-value">{displayValue}</span>
              {state === 'Default' && showTrendIcon && (
                <div className={`kpi-card-trend-icon trend-${delta.toLowerCase()}`}>
                  <Icon name={defaultTrendIcon} size="medium" />
                </div>
              )}
            </div>

            {/* Subtext: Tag Badge or Empty/Error Message */}
            <div className="kpi-card-meta-row">
              {state === 'Default' && targetDelta && (
                <div className={`kpi-tag-pill tag-${resolvedTargetType}`}>
                  <Icon
                    name={resolvedTargetType === 'positive' ? 'arrow_drop_up' : resolvedTargetType === 'negative' ? 'arrow_drop_down' : 'remove'}
                    size="small"
                  />
                  <span className="kpi-tag-text">{targetDelta}</span>
                </div>
              )}

              {state === 'Empty' && (
                <span className="kpi-card-empty-msg">{emptyMessage}</span>
              )}

              {state === 'Error' && (
                <span
                  className="kpi-card-error-msg"
                  onClick={(e) => {
                    if (onRetry) {
                      e.stopPropagation();
                      onRetry();
                    }
                  }}
                >
                  {errorMessage}
                </span>
              )}

              {/* Secondary comparison line (e.g. "+2.4% vs. last hr") */}
              {state === 'Default' && secondaryDelta && (
                <div className="kpi-card-secondary-delta">
                  <Icon
                    name={secondaryDeltaIcon || defaultTrendIcon}
                    size="small"
                    className="kpi-sec-icon"
                  />
                  <span>{secondaryDelta}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Compound Sub-Metrics) */}
        {isCompound && (
          <div className="kpi-card-submetrics-col">
            {/* Clickable arrow at the top right of compound card */}
            {isClickable && (
              <div className="kpi-card-nav-icon compound-nav" title="View details">
                <Icon name="north_east" size="small" />
              </div>
            )}

            <div className="kpi-card-submetrics-list">
              {state === 'Default' ? (
                subMetrics.map((sub, index) => (
                  <div key={index} className="kpi-submetric-item">
                    <div className="kpi-submetric-val-wrap">
                      <span className="kpi-submetric-val">{sub.value}</span>
                      {sub.unit && <span className="kpi-submetric-unit">{sub.unit}</span>}
                    </div>
                    <span className="kpi-submetric-label">{sub.label}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="kpi-submetric-item">
                    <span className="kpi-submetric-val">-</span>
                    <span className="kpi-submetric-label">Major Events</span>
                  </div>
                  <div className="kpi-submetric-item">
                    <span className="kpi-submetric-val">--</span>
                    <span className="kpi-submetric-label">MTBF</span>
                  </div>
                  <div className="kpi-submetric-item">
                    <span className="kpi-submetric-val">--</span>
                    <span className="kpi-submetric-label">MTTR</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (href && isClickable) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
