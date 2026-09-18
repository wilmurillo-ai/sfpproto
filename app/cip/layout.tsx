'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CIPLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAnalysis = pathname?.includes('/analysis');

  return (
    <div className="cip-root">
      {/* CIP Sub-nav header */}
      <div className="cip-subnav">
        <h1 className="cip-subnav-title">Clean-In-Place Dashboard</h1>
        <div className="cip-subnav-switcher" role="tablist" aria-label="CIP Dashboard Views">
          <Link
            href="/cip"
            className={`cip-subnav-switch-item ${!isAnalysis ? 'is-active' : ''}`}
            role="tab"
            aria-selected={!isAnalysis}
          >
            Overview
          </Link>
          <Link
            href="/cip/analysis"
            className={`cip-subnav-switch-item ${isAnalysis ? 'is-active' : ''}`}
            role="tab"
            aria-selected={isAnalysis}
          >
            Analysis
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
