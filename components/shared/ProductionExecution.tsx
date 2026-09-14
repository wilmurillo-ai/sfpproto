'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui';

export type ProductionOrderTab = 'processing' | 'packaging';

export interface ProductionExecutionProps {
  className?: string;
  initialTab?: ProductionOrderTab;
  onTabChange?: (tab: ProductionOrderTab) => void;
}

export default function ProductionExecution({
  className = '',
  initialTab = 'processing',
  onTabChange,
}: ProductionExecutionProps) {
  const [activeTab, setActiveTab] = useState<ProductionOrderTab>(initialTab);

  const handleTabClick = (tab: ProductionOrderTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <section className={`prod-exec-container ${className}`.trim()}>
      {/* Top Header Row with Title, Speeds, and Secondary Tabs */}
      <div className="prod-exec-header">
        <div className="prod-exec-header-left">
          <div className="prod-exec-icon">
            <Icon name="precision_manufacturing" size="medium" />
          </div>
          <h3 className="prod-exec-title">Production Execution</h3>

          <div className="prod-exec-speed-stats">
            <span className="prod-exec-speed-item">
              <span className="speed-label">Current Speed:</span>
              <strong className="speed-val">1,700 cans/hr</strong>
              <span className="speed-delta is-positive">(+30 cans/hr)</span>
            </span>
            <span className="prod-exec-speed-divider">|</span>
            <span className="prod-exec-speed-item">
              <span className="speed-label">Setpoint Speed:</span>
              <strong className="speed-val">1,800 cans/hr</strong>
            </span>
          </div>
        </div>

        {/* Secondary Tabs */}
        <div className="prod-exec-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'processing'}
            className={`prod-exec-tab-btn ${activeTab === 'processing' ? 'active' : ''}`}
            onClick={() => handleTabClick('processing')}
          >
            Processing Order
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'packaging'}
            className={`prod-exec-tab-btn ${activeTab === 'packaging' ? 'active' : ''}`}
            onClick={() => handleTabClick('packaging')}
          >
            Packaging Orders (2)
          </button>
        </div>
      </div>

      {/* =====================================================================
          PROCESSING ORDER TAB VIEW
          ===================================================================== */}
      {activeTab === 'processing' && (
        <div className="prod-exec-body processing-order-view">
          {/* Main Card */}
          <div className="processing-order-card">
            {/* Order Title with Arrow */}
            <div className="processing-order-title-row">
              <Link
                href="/schedule"
                className="processing-order-link"
                title="View order details"
              >
                <span className="processing-order-name">21-PEPSI MAX-330ML LATAS SLEEK</span>
                <Icon name="north_east" size="small" className="processing-order-arrow" />
              </Link>
            </div>

            {/* Progress Count & Running Ahead Status */}
            <div className="processing-order-metrics-row">
              <div className="processing-order-count">
                <span className="count-current">25,321</span>
                <span className="count-sep">/</span>
                <span className="count-total">36,000 cans</span>
              </div>
              <div className="processing-order-ahead-tag">
                <span>Running Ahead (+98...)</span>
              </div>
            </div>

            {/* Custom Progress Bar with Pointer Needle */}
            <div className="processing-progress-track">
              <div
                className="processing-progress-fill"
                style={{ width: '70.3%' }}
              />
              <div
                className="processing-progress-pointer"
                style={{ left: '70.3%' }}
                title="Current Progress: 70.3%"
              >
                <div className="pointer-needle" />
                <div className="pointer-head" />
              </div>
            </div>

            {/* Timing Row: Started & Est Remaining */}
            <div className="processing-order-timing-row">
              <span className="timing-item start-time">
                Started: <strong className="timing-val">04/11/25 09:16</strong>{' '}
                <span className="timing-late">(1min late)</span>
              </span>
              <span className="timing-item end-time">
                Est. Remaining Time:{' '}
                <strong className="timing-val">2hr 31min</strong>{' '}
                <span className="timing-eta">(04/11/25 12:30)</span>
              </span>
            </div>

            {/* Next Order Footer Banner */}
            <div className="processing-next-order-banner">
              <span className="next-order-badge">NEXT ORDER</span>
              <span className="next-order-timer">
                <Icon name="schedule" size="small" />
                In 50min
              </span>
              <span className="next-order-text">
                52-KAS NARANJA-330ML SLEEK <span className="next-order-sub">( 3 Packaging Order )</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PACKAGING ORDERS TAB VIEW
          ===================================================================== */}
      {activeTab === 'packaging' && (
        <div className="prod-exec-body packaging-orders-view">
          {/* Subheader: Active Orders from parent */}
          <div className="packaging-orders-subheader">
            <span className="active-orders-label">Active Orders (2) from</span>
            <Link href="/schedule" className="active-orders-parent-link">
              <span>21-PEPSI MAX-330ML LATAS SLEEK</span>
              <Icon name="north_east" size="small" />
            </Link>
          </div>

          {/* Dual Packaging Cards Grid */}
          <div className="packaging-cards-grid">
            {/* Card 1: Packer Kister */}
            <div className="packaging-card is-kister">
              {/* Header: Tag & Speed */}
              <div className="pkg-card-header">
                <span className="pkg-tag-badge">Packer Kister</span>
                <div className="pkg-speed-info">
                  <span className="pkg-speed-label">Current Speed:</span>
                  <span className="pkg-speed-val">123 cases/hr</span>
                  <span className="pkg-speed-delta is-positive">+400 cans/hr</span>
                </div>
              </div>

              {/* Product Title */}
              <h4 className="pkg-card-product-title">
                2591-PEPSI MAX SLEEK 330ML SIN HICO
              </h4>

              {/* Progress Count & Ahead Tag */}
              <div className="pkg-card-metrics-row">
                <div className="pkg-cases-count">
                  <strong>396</strong> / 405 cases
                </div>
                <div className="pkg-ahead-tag is-positive">
                  +79 Ahead
                </div>
              </div>

              {/* Progress Bar (Blue Fill, 97.7%) */}
              <div className="pkg-progress-track">
                <div
                  className="pkg-progress-fill is-blue"
                  style={{ width: '97.7%' }}
                />
                <div
                  className="pkg-progress-pointer"
                  style={{ left: '97.7%' }}
                  title="396 of 405 cases"
                >
                  <div className="pointer-needle" />
                  <div className="pointer-head" />
                </div>
              </div>

              {/* Timings */}
              <div className="pkg-card-timing-row">
                <span className="pkg-timing-started">
                  Started: <strong>04/11/25 09:32</strong> (2min late)
                </span>
                <span className="pkg-timing-remaining">
                  Est. Remaining Time: <strong>10min</strong> (04/11/25 11:00)
                </span>
              </div>
            </div>

            {/* Card 2: Packer Vega 01 */}
            <div className="packaging-card is-vega">
              {/* Header: Tag & Speed */}
              <div className="pkg-card-header">
                <span className="pkg-tag-badge">Packer Vega 01</span>
                <div className="pkg-speed-info">
                  <span className="pkg-speed-label">Current Speed:</span>
                  <span className="pkg-speed-val">235 cases/hr</span>
                  <span className="pkg-speed-delta is-negative">-51 cans/hr</span>
                </div>
              </div>

              {/* Product Title */}
              <h4 className="pkg-card-product-title">
                2592-PEPSI MAX SLEEK 330ML MP12
              </h4>

              {/* Progress Count & Behind Tag */}
              <div className="pkg-card-metrics-row">
                <div className="pkg-cases-count">
                  <strong>245</strong> / 432 cases
                </div>
                <div className="pkg-ahead-tag is-negative">
                  -87 Behind
                </div>
              </div>

              {/* Progress Bar (Orange / Striped Fill, 56.7%) */}
              <div className="pkg-progress-track">
                <div
                  className="pkg-progress-fill is-orange-striped"
                  style={{ width: '56.7%' }}
                />
                <div
                  className="pkg-progress-pointer"
                  style={{ left: '56.7%' }}
                  title="245 of 432 cases"
                >
                  <div className="pointer-needle" />
                  <div className="pointer-head" />
                </div>
              </div>

              {/* Timings */}
              <div className="pkg-card-timing-row">
                <span className="pkg-timing-started">
                  Started: <strong>04/11/25 10:02</strong> (2min late)
                </span>
                <span className="pkg-timing-remaining">
                  Est. Remaining Time: <strong>1hr 12min</strong> (04/11/25 12:02)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
