'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui';

export type AlertModalTab = 'comments' | 'events';

export interface AlertComment {
  id: string;
  author: string;
  role: string;
  avatarText: string;
  timestamp: string;
  content: string;
}

export interface AlertEventItem {
  id: string;
  time: string;
  line: string;
  runId: string;
  phase: string;
  duration: string;
  severity: 'critical' | 'warning' | 'info';
  details: string;
}

export interface AlertBreakdownData {
  id: string;
  name: string;
  subtitle: string;
  causeName: string;
  lostTime: string;
  eventsCount: number;
  paretoPct: number;
  worstLine?: string;
  comments: AlertComment[];
  events: AlertEventItem[];
}

// ── Curated alerts by deviation cause (Figma 29670:47956 & 29693:48809) ──
export const DEFAULT_ALERTS_BY_CAUSE: Record<string, AlertBreakdownData[]> = {
  'Temp Ramp': [
    {
      id: 'tr-alert-1',
      name: 'Plate Heat Exchanger PHE-01 Delta-T',
      subtitle: 'Caustic Recirculation • Skid Loop A',
      causeName: 'Temp Ramp',
      lostTime: '12m',
      eventsCount: 3,
      paretoPct: 52,
      worstLine: 'CIP 3',
      comments: [
        {
          id: 'c-1',
          author: 'Marcus Vance',
          role: 'Lead Operator',
          avatarText: 'MV',
          timestamp: 'Yesterday 09:15 AM',
          content: 'Secondary plate pack showing signs of scale buildup during third CIP run. Delta-T rate below 2°C/min. Requesting maintenance inspection before night shift.',
        },
        {
          id: 'c-2',
          author: 'Elena Rostova',
          role: 'Maintenance Tech',
          avatarText: 'ER',
          timestamp: 'Yesterday 14:20 PM',
          content: 'Flushed steam trap ST-02 and verified steam supply pressure at 4.2 bar. Delta-T improved slightly but still trending below spec.',
        },
      ],
      events: [
        {
          id: 'ev-1',
          time: '08:42 AM',
          line: 'CIP 3',
          runId: 'Run #1042 - CAN 02',
          phase: 'Caustic Wash Heating',
          duration: '+5m 12s',
          severity: 'critical',
          details: 'Steam valve position 100%, Delta-T 1.8°C/min (Target: 4.5°C/min). Heat transfer rate degraded.',
        },
        {
          id: 'ev-2',
          time: '11:15 AM',
          line: 'CIP 3',
          runId: 'Run #1043 - CAN 02',
          phase: 'Caustic Wash Heating',
          duration: '+4m 20s',
          severity: 'warning',
          details: 'Plate fouling detected on secondary loop heat transfer surface. Ramp delay +4m.',
        },
        {
          id: 'ev-3',
          time: '14:30 PM',
          line: 'CIP 3',
          runId: 'Run #1044 - MIX 01',
          phase: 'Sanitize Ramp',
          duration: '+2m 28s',
          severity: 'info',
          details: 'Condensate backpressure elevated during heat cycle ramp. Stabilized near setpoint.',
        },
      ],
    },
    {
      id: 'tr-alert-2',
      name: 'Steam Control Regulating Loop CV-102',
      subtitle: 'Pre-Heat • Boiler Header Loop',
      causeName: 'Temp Ramp',
      lostTime: '7m',
      eventsCount: 2,
      paretoPct: 30,
      worstLine: 'CIP 1',
      comments: [
        {
          id: 'c-3',
          author: 'Dave K.',
          role: 'Instrumentation',
          avatarText: 'DK',
          timestamp: 'Today 07:30 AM',
          content: 'Replaced positioner gasket on CV-102. Calibrated loop 4-20mA signal. Position hunting resolved.',
        },
      ],
      events: [
        {
          id: 'ev-4',
          time: '09:18 AM',
          line: 'CIP 1',
          runId: 'Run #1041 - CAN 01',
          phase: 'Pre-Heat',
          duration: '+4m 10s',
          severity: 'critical',
          details: 'Control valve CV-102 pneumatic actuator hunting +/- 12%, delayed temperature convergence.',
        },
        {
          id: 'ev-5',
          time: '13:05 PM',
          line: 'CIP 2',
          runId: 'Run #1045 - MIX 01',
          phase: 'Hot Rinse',
          duration: '+2m 50s',
          severity: 'warning',
          details: 'Steam flow PID loop response sluggish during setpoint change.',
        },
      ],
    },
    {
      id: 'tr-alert-3',
      name: 'Condensate Scavenge Valve Return Lag',
      subtitle: 'Hot Rinse • Sump Loop',
      causeName: 'Temp Ramp',
      lostTime: '4m',
      eventsCount: 1,
      paretoPct: 18,
      worstLine: 'CIP 2',
      comments: [
        {
          id: 'c-4',
          author: 'Elena Rostova',
          role: 'Maintenance Tech',
          avatarText: 'ER',
          timestamp: 'Today 06:10 AM',
          content: 'Check valve flap had slight calcium encrustation. Cleaned and tested free movement.',
        },
      ],
      events: [
        {
          id: 'ev-6',
          time: '10:40 AM',
          line: 'CIP 2',
          runId: 'Run #1043 - MIX 01',
          phase: 'Hot Rinse',
          duration: '+4m 00s',
          severity: 'warning',
          details: 'Condensate evacuation pump delayed startup due to liquid level sensor bounce.',
        },
      ],
    },
  ],

  'Water Q': [
    {
      id: 'wq-alert-1',
      name: 'Incoming Water Conductivity Drift',
      subtitle: 'Pre Rinse • City Water Feed',
      causeName: 'Water Q',
      lostTime: '16m',
      eventsCount: 3,
      paretoPct: 53,
      worstLine: 'CIP 1',
      comments: [
        {
          id: 'c-5',
          author: 'Marcus Vance',
          role: 'Lead Operator',
          avatarText: 'MV',
          timestamp: 'Yesterday 08:00 AM',
          content: 'City supply hardness spiked to 240 ppm after utility line maintenance. Extended rinse cycle triggered.',
        },
      ],
      events: [
        {
          id: 'ev-7',
          time: '07:50 AM',
          line: 'CIP 1',
          runId: 'Run #1039 - CAN 01',
          phase: 'Pre Rinse',
          duration: '+6m 40s',
          severity: 'critical',
          details: 'Inlet conductivity sensor reading 380 uS/cm vs 150 uS/cm baseline threshold.',
        },
        {
          id: 'ev-8',
          time: '10:20 AM',
          line: 'CIP 1',
          runId: 'Run #1042 - CAN 01',
          phase: 'Pre Rinse',
          duration: '+5m 20s',
          severity: 'warning',
          details: 'Purge cycle extended by 320 seconds until clear rinse clarity reached.',
        },
        {
          id: 'ev-9',
          time: '12:45 PM',
          line: 'CIP 3',
          runId: 'Run #1044 - MIX 01',
          phase: 'Final Rinse',
          duration: '+4m 00s',
          severity: 'info',
          details: 'Secondary flush required to satisfy quality release conductivity spec.',
        },
      ],
    },
    {
      id: 'wq-alert-2',
      name: 'Return Line Purge Cycle Timeout',
      subtitle: 'Intermediate Rinse • Skid Return',
      causeName: 'Water Q',
      lostTime: '10m',
      eventsCount: 2,
      paretoPct: 33,
      worstLine: 'CIP 2',
      comments: [
        {
          id: 'c-6',
          author: 'Sarah Jenkins',
          role: 'Quality Assurance',
          avatarText: 'SJ',
          timestamp: 'Yesterday 11:30 AM',
          content: 'Line purge timed out waiting for optical clarity threshold. Sample sent for swab test.',
        },
      ],
      events: [
        {
          id: 'ev-10',
          time: '09:05 AM',
          line: 'CIP 2',
          runId: 'Run #1040 - MIX 01',
          phase: 'Intermediate Rinse',
          duration: '+5m 30s',
          severity: 'warning',
          details: 'Return turbidity sensor took 180s longer than typical profile to clear particulate trace.',
        },
        {
          id: 'ev-11',
          time: '13:50 PM',
          line: 'CIP 2',
          runId: 'Run #1045 - MIX 01',
          phase: 'Intermediate Rinse',
          duration: '+4m 30s',
          severity: 'warning',
          details: 'Backpressure valve XV-304 seat resistance delayed drain evacuate cycle.',
        },
      ],
    },
    {
      id: 'wq-alert-3',
      name: 'Turbidity Scour Cycle Lag',
      subtitle: 'Final Rinse • Discharge Header',
      causeName: 'Water Q',
      lostTime: '4m',
      eventsCount: 1,
      paretoPct: 14,
      worstLine: 'CIP 1',
      comments: [],
      events: [
        {
          id: 'ev-12',
          time: '15:10 PM',
          line: 'CIP 1',
          runId: 'Run #1046 - CAN 01',
          phase: 'Final Rinse',
          duration: '+4m 00s',
          severity: 'info',
          details: 'Scour timer extended 240 seconds to guarantee zero detergent residue.',
        },
      ],
    },
  ],

  'Elbow 12': [
    {
      id: 'el-alert-1',
      name: 'Process Header Bend EL-12 Flow Restriction',
      subtitle: 'Pre Rinse • Process Header Bend',
      causeName: 'Elbow 12',
      lostTime: '8m',
      eventsCount: 2,
      paretoPct: 62,
      worstLine: 'CIP 2',
      comments: [
        {
          id: 'c-7',
          author: 'Elena Rostova',
          role: 'Maintenance Tech',
          avatarText: 'ER',
          timestamp: 'Yesterday 16:00 PM',
          content: 'Borescope inspection scheduled for weekend shut. Suspecting internal weld ridge buildup.',
        },
      ],
      events: [
        {
          id: 'ev-13',
          time: '08:15 AM',
          line: 'CIP 2',
          runId: 'Run #1040 - MIX 01',
          phase: 'Pre Rinse',
          duration: '+5m 00s',
          severity: 'critical',
          details: 'Differential pressure sensor across EL-12 spiked to 1.4 bar (normal: 0.6 bar). Flow velocity dropped to 1.3 m/s.',
        },
        {
          id: 'ev-14',
          time: '11:40 AM',
          line: 'CIP 2',
          runId: 'Run #1043 - MIX 01',
          phase: 'Pre Rinse',
          duration: '+3m 00s',
          severity: 'warning',
          details: 'Turbulence zone cavitation triggered pump RPM increase to compensate scouring flow.',
        },
      ],
    },
    {
      id: 'el-alert-2',
      name: 'Flow Scouring Restriction Zone Delay',
      subtitle: 'Caustic Recirculation • Riser Line',
      causeName: 'Elbow 12',
      lostTime: '5m',
      eventsCount: 1,
      paretoPct: 38,
      worstLine: 'CIP 1',
      comments: [],
      events: [
        {
          id: 'ev-15',
          time: '14:05 PM',
          line: 'CIP 1',
          runId: 'Run #1045 - CAN 01',
          phase: 'Caustic Recirculation',
          duration: '+5m 00s',
          severity: 'warning',
          details: 'Velocity meter FT-201 fell below critical Reynolds number for 180s.',
        },
      ],
    },
  ],

  'Chemicals': [
    {
      id: 'ch-alert-1',
      name: 'Caustic Concentrate Metering Slip',
      subtitle: 'Caustic Wash • Dosing Skid',
      causeName: 'Chemicals',
      lostTime: '6m',
      eventsCount: 2,
      paretoPct: 60,
      worstLine: 'CIP 2',
      comments: [
        {
          id: 'c-8',
          author: 'Marcus Vance',
          role: 'Lead Operator',
          avatarText: 'MV',
          timestamp: 'Yesterday 10:10 AM',
          content: 'Stroke rate calibration on dosing pump DP-01 was off by 6%. Calibrated stroke to 85%.',
        },
      ],
      events: [
        {
          id: 'ev-16',
          time: '09:30 AM',
          line: 'CIP 2',
          runId: 'Run #1041 - MIX 01',
          phase: 'Caustic Wash',
          duration: '+3m 40s',
          severity: 'critical',
          details: 'Target 2.5% caustic concentration took 420s to achieve due to metering pump check valve slip.',
        },
        {
          id: 'ev-17',
          time: '13:15 PM',
          line: 'CIP 3',
          runId: 'Run #1044 - CAN 02',
          phase: 'Caustic Wash',
          duration: '+2m 20s',
          severity: 'warning',
          details: 'Titration delay plateaued before final booster dosing pulse.',
        },
      ],
    },
    {
      id: 'ch-alert-2',
      name: 'Acid Neutralization Skid Lag',
      subtitle: 'Acid Wash • Day Tank',
      causeName: 'Chemicals',
      lostTime: '4m',
      eventsCount: 1,
      paretoPct: 40,
      worstLine: 'CIP 1',
      comments: [],
      events: [
        {
          id: 'ev-18',
          time: '12:10 PM',
          line: 'CIP 1',
          runId: 'Run #1043 - CAN 01',
          phase: 'Acid Wash',
          duration: '+4m 00s',
          severity: 'warning',
          details: 'Acid dilution loop recirculated 240s longer to equalize pH gradient across header.',
        },
      ],
    },
  ],
};

// Helper to generate dynamic alerts for any other cause name
export function getAlertsForCause(
  causeName: string,
  totalLostMinutes: number = 20,
  chartColor: string = '#0662c4'
): AlertBreakdownData[] {
  if (DEFAULT_ALERTS_BY_CAUSE[causeName]) {
    return DEFAULT_ALERTS_BY_CAUSE[causeName];
  }

  const pMin = Math.max(4, Math.round(totalLostMinutes * 0.55));
  const sMin = Math.max(2, Math.round(totalLostMinutes * 0.3));
  const tMin = Math.max(1, totalLostMinutes - pMin - sMin);

  return [
    {
      id: `${causeName}-alert-1`,
      name: `${causeName} Primary Actuator Threshold Deviation`,
      subtitle: `Phase Loop Diagnostic • Skid 1`,
      causeName,
      lostTime: `${pMin}m`,
      eventsCount: 3,
      paretoPct: 55,
      worstLine: 'CIP 2',
      comments: [
        {
          id: 'gen-c-1',
          author: 'Elena Rostova',
          role: 'Maintenance Tech',
          avatarText: 'ER',
          timestamp: 'Yesterday 10:00 AM',
          content: `Observed sensor feedback lag for ${causeName}. Scheduled diagnostic check for upcoming shift.`,
        },
      ],
      events: [
        {
          id: 'gen-ev-1',
          time: '08:30 AM',
          line: 'CIP 2',
          runId: 'Run #1041 - Unit A',
          phase: 'Process Step',
          duration: `+${pMin - 2}m 15s`,
          severity: 'critical',
          details: `Tolerance exceeded on ${causeName}. Automated safety watchdog extended execution timer.`,
        },
        {
          id: 'gen-ev-2',
          time: '11:45 AM',
          line: 'CIP 1',
          runId: 'Run #1043 - Unit B',
          phase: 'Ramp Step',
          duration: `+2m 00s`,
          severity: 'warning',
          details: `Intermittent communication timeout during setpoint verification.`,
        },
      ],
    },
    {
      id: `${causeName}-alert-2`,
      name: `${causeName} Flow / Calibration Restriction`,
      subtitle: `Sensor Loop • Skid 2`,
      causeName,
      lostTime: `${sMin}m`,
      eventsCount: 2,
      paretoPct: 30,
      worstLine: 'CIP 1',
      comments: [],
      events: [
        {
          id: 'gen-ev-3',
          time: '13:20 PM',
          line: 'CIP 1',
          runId: 'Run #1044 - Unit A',
          phase: 'Stabilization',
          duration: `+${sMin}m 00s`,
          severity: 'warning',
          details: `Sensor drift recorded on transmitter loop. Autotuning engaged.`,
        },
      ],
    },
    {
      id: `${causeName}-alert-3`,
      name: `${causeName} Secondary Pressure Differential`,
      subtitle: `Drain & Evacuation`,
      causeName,
      lostTime: `${tMin}m`,
      eventsCount: 1,
      paretoPct: 15,
      worstLine: 'CIP 3',
      comments: [],
      events: [
        {
          id: 'gen-ev-4',
          time: '15:00 PM',
          line: 'CIP 3',
          runId: 'Run #1045 - Unit C',
          phase: 'Final Flush',
          duration: `+${tMin}m 00s`,
          severity: 'info',
          details: `Line pressure stabilized after secondary pump start.`,
        },
      ],
    },
  ];
}

export interface CIPRootCauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData?: AlertBreakdownData | null;
  elementName?: string | null;
  activeLine?: string;
  activeTarget?: string;
  activeContext?: string;
  levelColor?: string;
}

export default function CIPRootCauseModal({
  isOpen,
  onClose,
  alertData,
  elementName,
  levelColor = '#0662c4',
}: CIPRootCauseModalProps) {
  // ── Two tabs: Comments, Events (Figma 29693:48809) ──
  const [activeTab, setActiveTab] = useState<AlertModalTab>('comments');
  const [commentsList, setCommentsList] = useState<AlertComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize alert data when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('comments');
      setNewCommentText('');
      if (alertData && alertData.comments) {
        setCommentsList([...alertData.comments]);
      } else if (elementName) {
        const generated = getAlertsForCause(elementName);
        if (generated.length > 0 && generated[0].comments) {
          setCommentsList([...generated[0].comments]);
        } else {
          setCommentsList([]);
        }
      }
    }
  }, [isOpen, alertData, elementName]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  // Active alert data
  const data: AlertBreakdownData = alertData || (
    elementName ? getAlertsForCause(elementName)[0] : DEFAULT_ALERTS_BY_CAUSE['Temp Ramp'][0]
  );

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: AlertComment = {
      id: `user-comment-${Date.now()}`,
      author: 'Current User',
      role: 'Operations Lead',
      avatarText: 'CU',
      timestamp: 'Just now',
      content: newCommentText.trim(),
    };

    setCommentsList((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  return createPortal(
    <div
      className="cip-root-cause-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="cip-alert-breakdown-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${data.name} - Alert Breakdown`}
        onClick={(e) => e.stopPropagation()}
        data-node-id="29693:48809"
      >
        {/* Top Header */}
        <div className="cip-ab-header">
          <div className="cip-ab-header-left">
            <div className="cip-ab-badge-row">
              <span className="cip-ab-cause-pill" style={{ borderColor: levelColor, color: levelColor }}>
                {data.causeName}
              </span>
              <span className="cip-ab-status-badge">Deviation Alert</span>
            </div>
            <h2 className="cip-ab-title">{data.name}</h2>
            <div className="cip-ab-subtitle">{data.subtitle}</div>

            {/* Quick Metrics Chips */}
            <div className="cip-ab-stats-chips">
              <div className="cip-ab-chip">
                <Icon name="timer" size="small" className="cip-ab-chip-icon" />
                <span className="cip-ab-chip-label">Time Lost:</span>
                <span className="cip-ab-chip-val">{data.lostTime}</span>
              </div>
              <div className="cip-ab-chip">
                <Icon name="event" size="small" className="cip-ab-chip-icon" />
                <span className="cip-ab-chip-label">Events:</span>
                <span className="cip-ab-chip-val">{data.eventsCount} occurrences</span>
              </div>
              <div className="cip-ab-chip">
                <Icon name="insights" size="small" className="cip-ab-chip-icon" />
                <span className="cip-ab-chip-label">Impact:</span>
                <span className="cip-ab-chip-val">{data.paretoPct}% of category</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="cip-ab-close-btn"
            onClick={onClose}
            aria-label="Close alert breakdown modal"
          >
            <Icon name="close" size="large" />
          </button>
        </div>

        {/* Modal Tabs (Comments, Events) - Figma 29693:48809 */}
        <div className="cip-ab-tabs-bar" role="tablist">
          <button
            type="button"
            className={`cip-ab-tab-btn ${activeTab === 'comments' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('comments')}
            role="tab"
            aria-selected={activeTab === 'comments'}
          >
            <Icon name="chat" size="small" />
            <span>Comments</span>
            <span className="cip-ab-tab-count">{commentsList.length}</span>
          </button>

          <button
            type="button"
            className={`cip-ab-tab-btn ${activeTab === 'events' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('events')}
            role="tab"
            aria-selected={activeTab === 'events'}
          >
            <Icon name="list_alt" size="small" />
            <span>Events</span>
            <span className="cip-ab-tab-count">{data.events.length}</span>
          </button>
        </div>

        {/* Modal Tab Content Area */}
        <div className="cip-ab-content-body">
          {/* TAB 1: Comments */}
          {activeTab === 'comments' && (
            <div className="cip-ab-comments-view">
              {/* Add comment box */}
              <form className="cip-ab-new-comment-form" onSubmit={handleAddComment}>
                <div className="cip-ab-input-row">
                  <div className="cip-ab-avatar is-current">CU</div>
                  <textarea
                    className="cip-ab-comment-textarea"
                    placeholder="Write an operational note, inspection finding, or handover note..."
                    rows={2}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                </div>
                <div className="cip-ab-comment-actions">
                  <button
                    type="submit"
                    className="cip-ab-post-btn"
                    disabled={!newCommentText.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="cip-ab-comments-list">
                {commentsList.length === 0 ? (
                  <div className="cip-ab-empty-state">
                    <Icon name="chat_bubble_outline" size="large" />
                    <span>No comments added yet. Be the first to leave an operational note.</span>
                  </div>
                ) : (
                  commentsList.map((c) => (
                    <div key={c.id} className="cip-ab-comment-card">
                      <div className="cip-ab-avatar">{c.avatarText}</div>
                      <div className="cip-ab-comment-main">
                        <div className="cip-ab-comment-header">
                          <span className="cip-ab-comment-author">{c.author}</span>
                          <span className="cip-ab-comment-role">{c.role}</span>
                          <span className="cip-ab-comment-time">{c.timestamp}</span>
                        </div>
                        <div className="cip-ab-comment-text">{c.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Events */}
          {activeTab === 'events' && (
            <div className="cip-ab-events-view">
              <div className="cip-ab-events-list">
                {data.events.map((ev) => (
                  <div key={ev.id} className="cip-ab-event-row">
                    <div className="cip-ab-event-left">
                      <div className="cip-ab-event-time-badge">{ev.time}</div>
                      <div
                        className={`cip-ab-severity-tag is-${ev.severity}`}
                        title={`Severity: ${ev.severity}`}
                      >
                        {ev.severity.toUpperCase()}
                      </div>
                    </div>

                    <div className="cip-ab-event-center">
                      <div className="cip-ab-event-title-line">
                        <span className="cip-ab-event-run">{ev.runId}</span>
                        <span className="cip-ab-event-phase">• {ev.phase}</span>
                      </div>
                      <div className="cip-ab-event-details">{ev.details}</div>
                    </div>

                    <div className="cip-ab-event-right">
                      <div className="cip-ab-event-duration">{ev.duration}</div>
                      <div className="cip-ab-event-line">{ev.line}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Retain legacy exports for backwards compatibility
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
    summary: { timeLost: '23m', occurrences: '3', runsAffected: '3', worstTime: 'CIP 1', shift: 'S3' },
    locations: [{ id: 'loc-1', title: 'Return Line Purge (1x)', subtitle: 'Pre Rinse', line: 'CIP1, CIP 2', lostTime: '10m Lost' }],
    actions: [{ id: 'act-1', timeframe: 'NOW', category: 'Utilities', description: 'Check incoming water conductivity' }],
  },
  'Chemicals': {
    displayTitle: 'Chemicals',
    subtitle: 'Root Cause Details',
    summary: { timeLost: '30m', occurrences: '4', runsAffected: '4', worstTime: 'CIP 2', shift: 'S2' },
    locations: [{ id: 'loc-2', title: 'Dosing Manifold Delivery', subtitle: 'Caustic Wash', line: 'CIP 2', lostTime: '14m Lost' }],
    actions: [{ id: 'act-2', timeframe: 'NOW', category: 'Chemical Skid', description: 'Calibrate caustic concentrate dosing' }],
  },
  'Temp Ramp': {
    displayTitle: 'Temp Ramp',
    subtitle: 'Root Cause Details',
    summary: { timeLost: '22m', occurrences: '3', runsAffected: '2', worstTime: 'CIP 3', shift: 'S1' },
    locations: [{ id: 'loc-3', title: 'Plate Heat Exchanger PHE-01', subtitle: 'Caustic Wash', line: 'CIP 3', lostTime: '12m Lost' }],
    actions: [{ id: 'act-3', timeframe: 'NOW', category: 'Steam Plant', description: 'Verify boiler header supply pressure' }],
  },
  'Elbow 12': {
    displayTitle: 'Elbow 12',
    subtitle: 'Root Cause Details',
    summary: { timeLost: '13m', occurrences: '2', runsAffected: '2', worstTime: 'CIP 2', shift: 'S2' },
    locations: [{ id: 'loc-4', title: 'Process Header Bend EL-12', subtitle: 'Pre Rinse', line: 'CIP 2', lostTime: '8m Lost' }],
    actions: [{ id: 'act-4', timeframe: 'NOW', category: 'Operations', description: 'Inspect pipeline line clamp across EL-12' }],
  },
};
