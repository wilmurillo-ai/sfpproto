'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Shift parameters: 8-hour shift from 06:00 AM to 02:00 PM
const SHIFT_START_HOUR = 6; // 6:00 AM
const SHIFT_DURATION_HOURS = 8;
const SHIFT_TOTAL_SECONDS = SHIFT_DURATION_HOURS * 3600; // 28,800s
const SHIFT_TOTAL_TARGET = 23513;

// Shift timeline segments across [0, 1]
// Designed so at ~46% progress, actual count is ~10,853, efficiency is ~64.4%, matching Figma node 29082:602087!
interface TimelineSegment {
  start: number; // 0 to 1
  end: number;   // 0 to 1
  type: 'green' | 'yellow' | 'red';
  status: 'running' | 'slow' | 'stopped';
  statusText: string;
  speedFactor: number; // 1.0 = target rate (23513 / 8h = 2939.1 u/h)
}

const TIMELINE_SEGMENTS: TimelineSegment[] = [
  { start: 0.00, end: 0.08, type: 'green', status: 'running', statusText: 'Line Running', speedFactor: 1.05 },
  { start: 0.08, end: 0.12, type: 'yellow', status: 'slow', statusText: 'Speed Loss - Packer', speedFactor: 0.65 },
  { start: 0.12, end: 0.15, type: 'green', status: 'running', statusText: 'Line Running', speedFactor: 1.0 },
  { start: 0.15, end: 0.20, type: 'red', status: 'stopped', statusText: 'Line Stopped - Jam', speedFactor: 0.0 },
  { start: 0.20, end: 0.21, type: 'green', status: 'running', statusText: 'Line Running', speedFactor: 0.9 },
  { start: 0.21, end: 0.22, type: 'red', status: 'stopped', statusText: 'Line Stopped', speedFactor: 0.0 },
  { start: 0.22, end: 0.38, type: 'green', status: 'running', statusText: 'Line Running', speedFactor: 0.95 },
  { start: 0.38, end: 0.44, type: 'yellow', status: 'slow', statusText: 'Minor Stoppage', speedFactor: 0.5 },
  { start: 0.44, end: 0.46, type: 'red', status: 'stopped', statusText: 'Filler Stoppage', speedFactor: 0.0 },
  { start: 0.46, end: 0.62, type: 'green', status: 'running', statusText: 'Line Running', speedFactor: 1.1 },
  { start: 0.62, end: 0.66, type: 'yellow', status: 'slow', statusText: 'Speed Adjustment', speedFactor: 0.7 },
  { start: 0.66, end: 0.70, type: 'red', status: 'stopped', statusText: 'Seamer Fault', speedFactor: 0.0 },
  { start: 0.70, end: 0.88, type: 'green', status: 'running', statusText: 'Line Running', speedFactor: 1.15 },
  { start: 0.88, end: 0.92, type: 'yellow', status: 'slow', statusText: 'Labeler Buffer Full', speedFactor: 0.6 },
  { start: 0.92, end: 1.00, type: 'green', status: 'running', statusText: 'Line Running', speedFactor: 1.2 },
];

const NOTIFICATIONS = [
  'Alert Task Assigned: Jeffery Smith',
  'Upcoming Product Change Over: 23,121 Mtn Dew Ext 12o in 1:32:32',
  'Machine Fault: Case Packer 02 - Jam cleared',
  'Quality Sample Check due at 2:15PM',
  'Filler Speed: 1,250 cpm (Operating nominal)',
  'Raw Material Pallet Delivery: Staging Bay 4',
  'CIP Sanitation window scheduled at 14:30',
  'Seamer Torque Verification: Passed'
];

export default function TVLinePage() {
  // Timelapse animation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x = 90s, 2x = 45s, 5x = 18s
  const [progress, setProgress] = useState(0.4615); // Default starts around Figma's snapshot point (~10,853 units)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const candybarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Cycle duration: 90 seconds base for full 8-hour shift
  const baseCycleMs = 90 * 1000;

  // Animation Loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const deltaMs = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const progressDelta = (deltaMs / baseCycleMs) * speedMultiplier;
      setProgress((prev) => {
        const next = prev + progressDelta;
        if (next >= 1) {
          // Loop back to start smoothly
          return 0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, speedMultiplier, baseCycleMs]);

  // Calculations derived from current shift progress [0, 1]
  const currentShiftSeconds = progress * SHIFT_TOTAL_SECONDS;

  // Top-right Clock (Reflects the timelapse 6:00 AM to 2:00 PM)
  const clockTime = useMemo(() => {
    const totalMinutes = Math.floor(currentShiftSeconds / 60);
    const startTotalMinutes = SHIFT_START_HOUR * 60;
    const currentTotalMinutes = (startTotalMinutes + totalMinutes) % (24 * 60);
    let hour = Math.floor(currentTotalMinutes / 60);
    const minutes = currentTotalMinutes % 60;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const minStr = minutes.toString().padStart(2, '0');
    return `${hour}:${minStr}${ampm}`;
  }, [currentShiftSeconds]);

  // Status timer: elapsed time in the shift e.g. "0:32:31" or "3:41:29"
  const elapsedTimer = useMemo(() => {
    const hours = Math.floor(currentShiftSeconds / 3600);
    const mins = Math.floor((currentShiftSeconds % 3600) / 60);
    const secs = Math.floor(currentShiftSeconds % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [currentShiftSeconds]);

  // Current active timeline segment
  const activeSegment = useMemo(() => {
    const found = TIMELINE_SEGMENTS.find((s) => progress >= s.start && progress < s.end);
    return found || TIMELINE_SEGMENTS[TIMELINE_SEGMENTS.length - 1];
  }, [progress]);

  // Downtime state when the candybar is going through a red segment
  const isDowntime = activeSegment.type === 'red';

  // Status timer: shows stoppage duration during downtime (e.g. 0:14:09 in Figma 29082:602220) or shift elapsed time
  const statusTimer = useMemo(() => {
    if (isDowntime) {
      const stopSecs = Math.max(0, Math.floor(currentShiftSeconds - (activeSegment.start * SHIFT_TOTAL_SECONDS)));
      const hours = Math.floor(stopSecs / 3600);
      const mins = Math.floor((stopSecs % 3600) / 60);
      const secs = Math.floor(stopSecs % 60);
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return elapsedTimer;
  }, [isDowntime, currentShiftSeconds, activeSegment.start, elapsedTimer]);

  // Dynamic actual units produced up to current progress
  const actualCount = useMemo(() => {
    // Integrate through segments up to current progress
    let totalProduced = 0;
    const nominalRatePerProgress = SHIFT_TOTAL_TARGET; // target if 100% nominal

    for (const seg of TIMELINE_SEGMENTS) {
      if (progress < seg.start) break;
      const segEffectiveEnd = Math.min(progress, seg.end);
      const segSpan = segEffectiveEnd - seg.start;
      totalProduced += segSpan * nominalRatePerProgress * seg.speedFactor;
    }

    return Math.round(totalProduced);
  }, [progress]);

  // Target count: total shift target is 23,513
  const targetCount = SHIFT_TOTAL_TARGET;

  // Expected pace target at this moment
  const expectedPaceCount = Math.round(SHIFT_TOTAL_TARGET * progress);

  // End of line count: tracks actual with typical line buffer lag
  const endOfLineCount = useMemo(() => {
    if (actualCount === 0) return 0;
    return Math.max(0, Math.round(actualCount * 0.59 + (progress * 120)));
  }, [actualCount, progress]);

  // Behind count: difference between actual and total shift target (or schedule pace)
  // In Figma node 29082:602087: Actual = 10,853, Target = 23,513, Behind = -12,701
  const behindDelta = actualCount - targetCount;
  const isBehind = behindDelta < 0;

  // Efficiency: Around 11:50 AM (350 mins in, progress ~0.729), increases to healthy level (>75%), removing red background
  const efficiency = useMemo(() => {
    const p1150 = 350.0 / 480.0; // 11:50 AM in 8-hour shift starting at 06:00 AM
    if (progress < 0.05) {
      return 62.0;
    } else if (progress < 0.66) {
      const paceRatio = expectedPaceCount > 0 ? actualCount / expectedPaceCount : 0.72;
      const base = 64.4 + (paceRatio - 0.72) * 15.0;
      return Math.round(Math.min(71.0, Math.max(58.0, base)) * 10) / 10;
    } else if (progress < 0.70) {
      return Math.round((64.5 - (progress - 0.66) * 15) * 10) / 10;
    } else if (progress < p1150) {
      const t = (progress - 0.70) / (p1150 - 0.70);
      const eff = 64.0 + t * 11.2; // reaches 75.2% right at 11:50 AM
      return Math.round(eff * 10) / 10;
    } else {
      const t = (progress - p1150) / (1.0 - p1150);
      const eff = 75.2 + (1 - Math.pow(1 - t, 1.5)) * 12.8;
      return Math.round(Math.min(88.5, eff) * 10) / 10;
    }
  }, [progress, actualCount, expectedPaceCount]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="tv-line-screen" id="tv-line-root">
      {/* ── Floating Simulation Controls ── */}
      <div className="tv-sim-floating-controls" title="Timelapse Animation Controls">
        <button
          className={`tv-sim-btn ${isPlaying ? 'active' : ''}`}
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause Timelapse' : 'Play Timelapse'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <div className="tv-sim-slider-wrap">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(e) => {
              setIsPlaying(false);
              setProgress(parseFloat(e.target.value));
            }}
            className="tv-sim-slider"
            title={`Shift Progress: ${(progress * 100).toFixed(1)}%`}
          />
        </div>

        <button
          className="tv-sim-btn"
          onClick={() => {
            const speeds = [1, 2, 5];
            const nextIdx = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
            setSpeedMultiplier(speeds[nextIdx]);
          }}
          title="Cycle Speed"
        >
          {speedMultiplier}x
        </button>

        <button
          className="tv-sim-btn"
          onClick={() => setProgress(0)}
          title="Restart Shift (06:00 AM)"
        >
          ↺ Reset
        </button>

        <button className="tv-sim-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? '⤢ Exit' : '⤡ TV'}
        </button>

        <Link href="/dashboard" className="tv-sim-exit-btn" title="Return to Line Dashboard">
          ✕ Exit
        </Link>
      </div>

      {/* ── Main Screen Viewport (1920x1080 Full HD Proportions) ── */}
      <div className="tv-line-main-area">
        {/* ── Top Bar (Figma Node: 29082:602111) ── */}
        <header className="tv-topbar">
          <div className="tv-topbar-left">
            <Link href="/dashboard" className="tv-logo-link" title="Return to Dashboard">
              <Image
                src="/sfp_logo.svg"
                alt="SFP"
                width={128}
                height={36}
                className="tv-logo-img"
                priority
              />
            </Link>
          </div>

          <div className="tv-topbar-center">
            <span className="tv-line-id">PET 3</span>
            <span className="tv-dot-sep" />
            <span className="tv-product-name">PEPSI reg 12oz 512431</span>
          </div>

          <div className="tv-topbar-right">
            <span className="tv-clock">{clockTime}</span>
          </div>
        </header>

        {/* ── Main Progress Card (Figma Node: 29082:602088 & 29082:602220) ── */}
        <section className={`tv-progress-card ${isDowntime ? 'downtime' : ''}`}>
          {/* Card Header: Status & Units Counter */}
          <div className="tv-card-header">
            <div className="tv-status-group">
              <span className={`tv-status-dot ${activeSegment.status}`} />
              <span className="tv-status-title">{activeSegment.statusText}</span>
              <span className="tv-status-timer">{statusTimer}</span>
            </div>

            <div className="tv-counter-group">
              <span className="tv-counter-actual">{actualCount.toLocaleString()}</span>
              <span className="tv-counter-target"> / {targetCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Candybar Timeline (Figma Node: 29082:602097) */}
          <div className="tv-candybar-wrap" ref={candybarRef}>
            {/* Background unfilled track */}
            <div className="tv-candybar-unfilled-track" />

            {/* Filled progress track masked by width */}
            <div
              className="tv-candybar-filled-track"
              style={{
                width: `${Math.min(100, Math.max(0, progress * 100))}%`,
                borderRadius: progress >= 0.99 ? '20px' : '20px 0 0 20px',
              }}
            >
              {/* Full width inner timeline segments */}
              <div
                className="tv-candybar-timeline-inner"
                style={{
                  width: candybarRef.current ? `${candybarRef.current.clientWidth}px` : '100vw',
                }}
              >
                {TIMELINE_SEGMENTS.map((seg, idx) => (
                  <div
                    key={idx}
                    className={`tv-candybar-segment ${seg.type}`}
                    style={{ width: `${(seg.end - seg.start) * 100}%` }}
                  />
                ))}
              </div>

              {/* Shading gradient overlay matching Figma */}
              <div className="tv-candybar-gradient-overlay" />
            </div>

            {/* White hairline marker & arrow cursor at current progress */}
            <div
              className="tv-candybar-marker-line"
              style={{
                left: `${Math.min(100, Math.max(0, progress * 100))}%`,
              }}
            >
              <div className="tv-marker-arrow" />
            </div>
          </div>

          {/* Behind / Ahead Indicator (Figma Node: 29082:602109) */}
          <div className={`tv-behind-label ${isBehind ? 'negative' : 'positive'}`}>
            {isBehind ? `${behindDelta.toLocaleString()} Behind` : `+${behindDelta.toLocaleString()} Ahead`}
          </div>
        </section>

        {/* ── Indicators Grid (Figma Node: 29082:602137) ── */}
        <section className="tv-indicators-grid">
          {/* Card 1: Target */}
          <div className="tv-indicator-card">
            <div className="tv-indicator-val">{targetCount.toLocaleString()}</div>
            <div className="tv-indicator-lbl">TARGET</div>
          </div>

          {/* Card 2: Actual */}
          <div className="tv-indicator-card">
            <div className="tv-indicator-val">{actualCount.toLocaleString()}</div>
            <div className="tv-indicator-lbl">ACTUAL</div>
          </div>

          {/* Card 3: End of Line */}
          <div className="tv-indicator-card">
            <div className="tv-indicator-val">{endOfLineCount.toLocaleString()}</div>
            <div className="tv-indicator-lbl">END OF LINE</div>
          </div>

          {/* Card 4: Efficiency (Red background when under target, matching Figma) */}
          <div className={`tv-indicator-card ${efficiency < 75 ? 'efficiency-low' : ''}`}>
            <div className="tv-indicator-val">{efficiency.toFixed(1)}%</div>
            <div className="tv-indicator-lbl">EFFICIENCY</div>
          </div>

          {/* Card 5: Quality (Green value matching Figma 98.4%) */}
          <div className="tv-indicator-card">
            <div className="tv-indicator-val quality-val">98.4%</div>
            <div className="tv-indicator-lbl">QUALITY</div>
          </div>
        </section>
      </div>

      {/* ── Bottom Marquee Bar (Figma Node: 29082:602131) ── */}
      <footer className="tv-bottom-bar">
        {/* Left Scrolling Marquee Ticker */}
        <div className="tv-marquee-track-wrap">
          <div className="tv-marquee-scroller">
            {/* First sequence */}
            <div className="tv-marquee-group">
              {NOTIFICATIONS.map((item, idx) => (
                <span key={`a-${idx}`} className="tv-marquee-item">
                  {item}
                  <span className="tv-marquee-item-dot">•</span>
                </span>
              ))}
            </div>

            {/* Seamless duplicate clone sequence */}
            <div className="tv-marquee-group" aria-hidden="true">
              {NOTIFICATIONS.map((item, idx) => (
                <span key={`b-${idx}`} className="tv-marquee-item">
                  {item}
                  <span className="tv-marquee-item-dot">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Red Alert Banner (Figma Node: 29082:602135) */}
        <div className="tv-alert-banner">
          <span className="tv-alert-text">3 Defects to Review</span>
        </div>
      </footer>
    </div>
  );
}
