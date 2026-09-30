'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CIPLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAnalysis = pathname?.includes('/analysis');
  const isSchedule = pathname?.includes('/schedule');
  const isRuns = pathname?.includes('/runs');
  const isOverview = pathname?.includes('/overview');

  return (
    <div className="cip-root">
      {/* CIP Sub-nav header */}
      <div className="cip-subnav">
        <h1 className="cip-subnav-title">Clean-In-Place Dashboard</h1>
        {/* Menu options matching Figma 28901:12789: Overview, Schedule, Analysis, Runs */}
        <div className="cip-subnav-switcher" role="tablist" aria-label="CIP Dashboard Views">
          <Link
            href="/cip/overview"
            className={`cip-subnav-switch-item ${isOverview ? 'is-active' : ''}`}
            role="tab"
            aria-selected={isOverview}
          >
            Overview
          </Link>
          <Link
            href="/cip/schedule"
            className={`cip-subnav-switch-item ${isSchedule ? 'is-active' : ''}`}
            role="tab"
            aria-selected={isSchedule}
          >
            Schedule
          </Link>
          <Link
            href="/cip/analysis"
            className={`cip-subnav-switch-item ${isAnalysis ? 'is-active' : ''}`}
            role="tab"
            aria-selected={isAnalysis}
          >
            Analysis
          </Link>
          <Link
            href="/cip/runs"
            className={`cip-subnav-switch-item ${isRuns ? 'is-active' : ''}`}
            role="tab"
            aria-selected={isRuns}
          >
            Runs
          </Link>
        </div>
      </div>

      {/* Page content */}
      <div className="cip-page-body">
        {children}
      </div>
    </div>
  );
}
