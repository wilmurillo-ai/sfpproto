'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LineData {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  efficiency: number;
  trend: 'up' | 'down';
  segments: { width: string; type: 'green' | 'yellow' | 'red' | 'empty' }[];
}

const PLANT_LINES: LineData[] = [
  {
    id: 'can01',
    name: 'CAN01',
    status: 'running',
    efficiency: 92,
    trend: 'up',
    segments: [
      { width: '6%', type: 'green' },
      { width: '1.5%', type: 'red' },
      { width: '1.5%', type: 'green' },
      { width: '1.5%', type: 'red' },
      { width: '1.5%', type: 'green' },
      { width: '0.5%', type: 'red' },
      { width: '1.5%', type: 'green' },
      { width: '6%', type: 'red' },
      { width: '13%', type: 'green' },
      { width: '3%', type: 'red' },
      { width: '64%', type: 'green' },
    ],
  },
  {
    id: 'can02',
    name: 'CAN02',
    status: 'running',
    efficiency: 89,
    trend: 'up',
    segments: [
      { width: '4%', type: 'green' },
      { width: '2%', type: 'red' },
      { width: '5%', type: 'green' },
      { width: '3.5%', type: 'red' },
      { width: '8%', type: 'green' },
      { width: '2%', type: 'red' },
      { width: '11%', type: 'green' },
      { width: '64.5%', type: 'green' },
    ],
  },
  {
    id: 'can03',
    name: 'CAN03',
    status: 'running',
    efficiency: 90,
    trend: 'up',
    segments: [
      { width: '3%', type: 'green' },
      { width: '2%', type: 'red' },
      { width: '3%', type: 'green' },
      { width: '2%', type: 'red' },
      { width: '6%', type: 'green' },
      { width: '4%', type: 'red' },
      { width: '12%', type: 'green' },
      { width: '2%', type: 'red' },
      { width: '66%', type: 'green' },
    ],
  },
  {
    id: 'pet01',
    name: 'PET01',
    status: 'running',
    efficiency: 85,
    trend: 'up',
    segments: [
      { width: '8%', type: 'green' },
      { width: '4%', type: 'red' },
      { width: '5%', type: 'green' },
      { width: '3%', type: 'red' },
      { width: '6%', type: 'green' },
      { width: '12%', type: 'red' },
      { width: '62%', type: 'green' },
    ],
  },
  {
    id: 'can04',
    name: 'CAN04',
    status: 'running',
    efficiency: 94,
    trend: 'up',
    segments: [
      { width: '15%', type: 'green' },
      { width: '1%', type: 'yellow' },
      { width: '2%', type: 'red' },
      { width: '22%', type: 'green' },
      { width: '60%', type: 'green' },
    ],
  },
  {
    id: 'pet02',
    name: 'PET02',
    status: 'stopped',
    efficiency: 68,
    trend: 'down',
    segments: [
      { width: '12%', type: 'green' },
      { width: '5%', type: 'yellow' },
      { width: '18%', type: 'red' },
      { width: '10%', type: 'green' },
      { width: '35%', type: 'red' },
      { width: '20%', type: 'empty' },
    ],
  },
  {
    id: 'pet03',
    name: 'PET03',
    status: 'running',
    efficiency: 91,
    trend: 'up',
    segments: [
      { width: '7%', type: 'green' },
      { width: '3%', type: 'red' },
      { width: '14%', type: 'green' },
      { width: '2%', type: 'yellow' },
      { width: '74%', type: 'green' },
    ],
  },
  {
    id: 'snk01',
    name: 'SNK01',
    status: 'running',
    efficiency: 88,
    trend: 'up',
    segments: [
      { width: '10%', type: 'green' },
      { width: '4%', type: 'red' },
      { width: '6%', type: 'green' },
      { width: '5%', type: 'red' },
      { width: '75%', type: 'green' },
    ],
  },
  {
    id: 'snk02',
    name: 'SNK02',
    status: 'running',
    efficiency: 93,
    trend: 'up',
    segments: [
      { width: '18%', type: 'green' },
      { width: '2%', type: 'red' },
      { width: '80%', type: 'green' },
    ],
  },
  {
    id: 'pkg01',
    name: 'PKG01',
    status: 'running',
    efficiency: 87,
    trend: 'up',
    segments: [
      { width: '9%', type: 'green' },
      { width: '6%', type: 'red' },
      { width: '15%', type: 'green' },
      { width: '4%', type: 'yellow' },
      { width: '66%', type: 'green' },
    ],
  },
];

export default function TVPlantPage() {
  // Real-time clock state
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Dynamic carousel auto-advance state (every 4 seconds)
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState<boolean>(true);

  // Real-time plant telemetry subtle fluctuation simulation
  const [plantMetrics, setPlantMetrics] = useState({
    efficiency: 89.2,
    attainment: 64.4,
    waste: 1.2,
    rateLoss: 92,
    downtime: 16.8,
  });

  // Track reference for carousel width
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const [cardStepWidth, setCardStepWidth] = useState<number>(440);

  // 1. Real-time Clock (updates every second)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes}${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Dynamic Carousel: auto-refreshes every 4 seconds with smooth transition
  useEffect(() => {
    if (!isCarouselPlaying) return;

    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % PLANT_LINES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isCarouselPlaying]);

  // Update card step width when container resizes
  useEffect(() => {
    const handleResize = () => {
      if (trackWrapperRef.current) {
        const containerWidth = trackWrapperRef.current.clientWidth;
        // 4 cards with 16px gap => cardWidth = (containerWidth - 48) / 4
        const singleCardWidth = (containerWidth - 48) / 4;
        setCardStepWidth(singleCardWidth + 16);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Subtle real-time metric simulation (jittering every 6s)
  useEffect(() => {
    const metricTimer = setInterval(() => {
      setPlantMetrics((prev) => {
        const effDelta = (Math.random() - 0.5) * 0.2;
        const attDelta = (Math.random() - 0.45) * 0.1;
        const newEff = +(prev.efficiency + effDelta).toFixed(1);
        const newAtt = +(prev.attainment + attDelta).toFixed(1);
        return {
          ...prev,
          efficiency: Math.min(94, Math.max(86, newEff)),
          attainment: Math.min(80, Math.max(60, newAtt)),
        };
      });
    }, 6000);

    return () => clearInterval(metricTimer);
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Infinite display list by duplicating
  const displayLines = [...PLANT_LINES, ...PLANT_LINES, ...PLANT_LINES];

  return (
    <div className="tv-plant-screen">
      {/* ── 1. Top Bar (Figma Frame 2085665824) ── */}
      <header className="tv-plant-topbar">
        {/* Left: SFP Logo linking to dashboard */}
        <Link href="/dashboard" className="tv-logo-wrap" title="Exit to Dashboard">
          <Image
            src="/sfp_logo.svg"
            alt="SFP"
            width={128}
            height={36}
            priority
            style={{ width: 'auto', height: 'clamp(28px, 3.5vh, 36px)' }}
          />
        </Link>

        {/* Center: Echavarri Plant Monitor Title */}
        <h1 className="tv-plant-title">Echavarri Plant Monitor</h1>

        {/* Right: Live Current Time */}
        <div className="tv-topbar-right">
          <div className="tv-clock" title="Current Real-time Clock">
            {currentTime || '1:53PM'}
          </div>
        </div>
      </header>

      {/* ── 2. Line Carousel (Figma line-carousel 29084:603575) ── */}
      <section className="tv-carousel-section" aria-label="Plant Lines Carousel">
        <div className="tv-carousel-track-wrapper" ref={trackWrapperRef}>
          <div
            className="tv-carousel-track"
            style={{
              transform: `translateX(-${carouselIndex * cardStepWidth}px)`,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {displayLines.map((line, idx) => (
              <div key={`${line.id}-${idx}`} className="tv-carousel-card">
                {/* Header: Line Name + Status Tag */}
                <div className="tv-carousel-card-header">
                  <span className="tv-carousel-line-name">{line.name}</span>
                  <div className={`tv-carousel-tag ${line.status}`}>
                    {line.status === 'running' ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <polygon points="4,2 14,8 4,14" />
                        </svg>
                        <span>Running</span>
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="3" y="3" width="10" height="10" rx="1" />
                        </svg>
                        <span>Stopped</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Efficiency Stat + Trend */}
                <div className="tv-carousel-stat-row">
                  <span className="tv-carousel-eff-value">{line.efficiency}%</span>
                  <span className="tv-carousel-trend-icon">
                    {line.trend === 'up' ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7ADB74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EB780A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                        <polyline points="17 18 23 18 23 12" />
                      </svg>
                    )}
                  </span>
                </div>

                {/* Tiny Candybar */}
                <div className="tv-carousel-candybar">
                  {line.segments.map((seg, sIdx) => (
                    <div
                      key={sIdx}
                      className={`tv-carousel-seg ${seg.type}`}
                      style={{ width: seg.width }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Waterfall Efficiency Card (Figma Frame 2085665825) ── */}
      <section className="tv-waterfall-card">
        {/* Left Column: True Efficiency Metrics */}
        <div className="tv-waterfall-left">
          <h2 className="tv-waterfall-title">True Efficiency</h2>
          <div className="tv-waterfall-bigval">{plantMetrics.efficiency}%</div>
          <div className="tv-waterfall-targets">
            <span className="val-target">Target: 90%</span>
            <span className="val-diff">Vs. Last: +2.4%</span>
          </div>
        </div>

        {/* Right Column: Waterfall Breakdown Chart */}
        <div className="tv-waterfall-right">
          <div className="tv-waterfall-chart-area">
            {/* Y-Axis Labels */}
            <div className="tv-waterfall-yaxis">
              <span>40%</span>
              <span>20%</span>
              <span>0</span>
            </div>

            {/* Gridlines */}
            <div className="tv-waterfall-gridline" style={{ top: '26px' }} />
            <div className="tv-waterfall-gridline" style={{ top: '191px' }} />
            <div className="tv-waterfall-gridline" style={{ top: '357px' }} />

            {/* Waterfall Bars Container */}
            <div className="tv-waterfall-bars-container">
              {/* 1. Planned (Baseline 0% up to 40%) */}
              <div
                className="tv-waterfall-bar"
                style={{
                  left: '6%',
                  top: '26px',
                  height: '331px',
                  backgroundColor: 'rgba(75, 75, 75, 0.35)',
                }}
                title="Planned Capacity: 40.0%"
              />

              {/* Connecting step line 1 */}
              <div
                className="tv-waterfall-step-line"
                style={{ left: 'calc(6% + 63px)', width: 'calc(17% - 63px)', top: '26px' }}
              />

              {/* 2. Planned Downtime (Drop from 26px to 82px) */}
              <div
                className="tv-waterfall-bar"
                style={{
                  left: '23%',
                  top: '26px',
                  height: '56px',
                  backgroundColor: '#C79B1B',
                }}
                title="Planned Downtime: -6.8%"
              />

              {/* Connecting step line 2 */}
              <div
                className="tv-waterfall-step-line"
                style={{ left: 'calc(23% + 63px)', width: 'calc(16% - 63px)', top: '82px' }}
              />

              {/* 3. Unplanned Downtime (Drop from 82px to 152px) */}
              <div
                className="tv-waterfall-bar"
                style={{
                  left: '39%',
                  top: '82px',
                  height: '70px',
                  backgroundColor: '#E78710',
                }}
                title="Unplanned Downtime: -8.5%"
              />

              {/* Connecting step line 3 */}
              <div
                className="tv-waterfall-step-line"
                style={{ left: 'calc(39% + 63px)', width: 'calc(16% - 63px)', top: '152px' }}
              />

              {/* 4. Rate Loss (Drop from 152px to 166px) */}
              <div
                className="tv-waterfall-bar"
                style={{
                  left: '55%',
                  top: '152px',
                  height: '14px',
                  backgroundColor: '#C12C01',
                }}
                title="Rate Loss: -1.7%"
              />

              {/* Connecting step line 4 */}
              <div
                className="tv-waterfall-step-line"
                style={{ left: 'calc(55% + 63px)', width: 'calc(16% - 63px)', top: '166px' }}
              />

              {/* 5. Waste (Drop from 166px to 176px) */}
              <div
                className="tv-waterfall-bar"
                style={{
                  left: '71%',
                  top: '166px',
                  height: '10px',
                  backgroundColor: '#701803',
                }}
                title="Waste: -1.2%"
              />

              {/* Connecting step line 5 */}
              <div
                className="tv-waterfall-step-line"
                style={{ left: 'calc(71% + 63px)', width: 'calc(15% - 63px)', top: '176px' }}
              />

              {/* 6. Good Production (From 176px down to baseline 357px = 181px height) */}
              <div
                className="tv-waterfall-bar"
                style={{
                  left: '86%',
                  top: '176px',
                  height: '181px',
                  backgroundColor: '#0662C4',
                }}
                title="Good Production: 21.8%"
              />
            </div>

            {/* X-Axis Labels (Centered directly under each column) */}
            <div className="tv-waterfall-xlabels">
              <span className="tv-waterfall-xlabel" style={{ left: 'calc(6% + 31.5px)' }}>Planned</span>
              <span className="tv-waterfall-xlabel" style={{ left: 'calc(23% + 31.5px)' }}>Planned Dow...</span>
              <span className="tv-waterfall-xlabel" style={{ left: 'calc(39% + 31.5px)' }}>Unplanned D...</span>
              <span className="tv-waterfall-xlabel" style={{ left: 'calc(55% + 31.5px)' }}>Rate</span>
              <span className="tv-waterfall-xlabel" style={{ left: 'calc(71% + 31.5px)' }}>Waste</span>
              <span className="tv-waterfall-xlabel" style={{ left: 'calc(86% + 31.5px)' }}>Good Prod.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Bottom Marquee Section (Figma marquee 29084:603416) ── */}
      <footer className="tv-plant-marquee">
        {/* Left Side: 4 Plant-wide Metrics */}
        <div className="tv-marquee-metrics-left">
          <div className="tv-marquee-metric-col">
            <span className="tv-marquee-metric-val">{plantMetrics.attainment}%</span>
            <span className="tv-marquee-metric-label">Attainment</span>
          </div>

          <div className="tv-marquee-metric-col">
            <span className="tv-marquee-metric-val">{plantMetrics.waste}%</span>
            <span className="tv-marquee-metric-label">Waste</span>
          </div>

          <div className="tv-marquee-metric-col">
            <span className="tv-marquee-metric-val">{plantMetrics.rateLoss}%</span>
            <span className="tv-marquee-metric-label">Rate Loss</span>
          </div>

          <div className="tv-marquee-metric-col">
            <span className="tv-marquee-metric-val">{plantMetrics.downtime}</span>
            <span className="tv-marquee-metric-label">Downtime</span>
          </div>
        </div>

        {/* Right Side: MTBF & MTTR Red High-Contrast Block */}
        <div className="tv-marquee-red-block">
          <div>MTBF: +3m</div>
          <div>MTTR: +1m</div>
        </div>
      </footer>

      {/* Floating Ambient Controls (discrete hover HUD for TV interaction) */}
      <div className="tv-sim-floating-controls">
        <button
          className={`tv-sim-btn ${isCarouselPlaying ? 'active' : ''}`}
          onClick={() => setIsCarouselPlaying((p) => !p)}
          title={isCarouselPlaying ? 'Pause Carousel Rotation' : 'Resume Carousel Rotation (every 4s)'}
        >
          {isCarouselPlaying ? '❚❚ Auto (4s)' : '▶ Play'}
        </button>

        <button
          className="tv-sim-btn"
          onClick={() => setCarouselIndex((p) => (p + 1) % PLANT_LINES.length)}
          title="Advance to next lines"
        >
          Next ❯
        </button>

        <button
          className="tv-sim-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? '⤢ Exit Full' : '⤢ Fullscreen'}
        </button>

        <Link href="/tv/line" className="tv-sim-exit-btn" title="Switch to Line TV View">
          Line View
        </Link>

        <Link href="/dashboard" className="tv-sim-exit-btn" title="Back to Dashboard">
          Exit TV
        </Link>
      </div>
    </div>
  );
}
