import {
  CandybarSegment,
  CandybarTimeframe,
  mock4HrSegments,
  mockShiftSegments,
  mock24HrSegments,
} from '@/components/shared/Candybar';

export type EquipmentStatus =
  | 'Running'
  | 'Slow Run'
  | 'Available'
  | 'Down'
  | 'Faulted'
  | 'Blocked'
  | 'Not Running';

export type KPICardDelta = 'Positive' | 'Negative' | 'Neutral';

export interface EquipmentViewData {
  id: string;
  name: string;
  headerTitle: string;
  status: EquipmentStatus;
  kpis: {
    efficiency: { value: number | string; delta: KPICardDelta; targetDelta: string; secondaryDelta: string };
    waste: { value: number | string; delta: KPICardDelta; targetDelta: string; secondaryDelta: string };
    rateLoss: { value: number | string; delta: KPICardDelta; targetDelta: string; secondaryDelta: string };
    downtime: {
      value: number | string;
      delta: KPICardDelta;
      targetDelta: string;
      secondaryDelta: string;
      subMetrics: Array<{ value: string | number; unit?: string; label: string }>;
    };
  };
  candybarSegments: CandybarSegment[];
  timeframeSegments?: Partial<Record<CandybarTimeframe, CandybarSegment[]>>;
}

// ============================================================================
// Packer KISTER Specific Segments Across Timeframes (Figma Node 9530:56671)
// ============================================================================

// 1 Hour (60m) - Exact match to Figma Node 9530:56671
export const PACKER_KISTER_SEGMENTS_1HR: CandybarSegment[] = [
  {
    id: 'pk-seg-1',
    status: 'running',
    durationMinutes: 6,
    title: 'Running',
    timeRange: '11:19 - 11:25',
    equipment: 'Packer KISTER',
    avgSpeed: '1,720 cans/hr',
    plannedSpeed: '1,800 cans/hr',
  },
  {
    id: 'pk-seg-2',
    status: 'running',
    durationMinutes: 4,
    title: 'Running',
    timeRange: '11:25 - 11:29',
    equipment: 'Packer KISTER',
    avgSpeed: '1,750 cans/hr',
    plannedSpeed: '1,800 cans/hr',
  },
  {
    id: 'pk-seg-3',
    status: 'fault',
    durationMinutes: 5,
    title: 'Case Erector Jam',
    timeRange: '11:29 - 11:34',
    equipment: 'Packer KISTER',
    avgSpeed: '0 cans/hr',
    plannedSpeed: '1,800 cans/hr',
    hasNote: true,
    operatorNote: {
      author: 'Chris G.',
      initials: 'CG',
      text: 'Carton magazine misfeed cleared by operator.',
    },
  },
  {
    id: 'pk-seg-4',
    status: 'fault',
    durationMinutes: 6,
    title: 'Infeed Conveyor Backup',
    timeRange: '11:34 - 11:40',
    equipment: 'Packer KISTER',
    avgSpeed: '0 cans/hr',
    plannedSpeed: '1,800 cans/hr',
  },
  {
    id: 'pk-seg-5',
    status: 'first-fault', // Red highlight segment with white indicator
    durationMinutes: 2,
    title: 'Sensor Calibration and Quality Assurance Halt',
    timeRange: '04/11/25 11:43 - 11:43',
    equipment: 'Packer KISTER',
    avgSpeed: '0 cans/hr',
    plannedSpeed: '1,800 cans/hr',
    hasNote: true,
    operatorNote: {
      author: 'Chris G.',
      initials: 'CG',
      text: 'Sensor calibration complete and QA verified.',
    },
  },
  {
    id: 'pk-seg-6',
    status: 'slow-running',
    durationMinutes: 9,
    title: 'Ramp-up / Slow Run',
    timeRange: '11:43 - 11:52',
    equipment: 'Packer KISTER',
    avgSpeed: '1,350 cans/hr',
    plannedSpeed: '1,800 cans/hr',
  },
  {
    id: 'pk-seg-7',
    status: 'fault',
    durationMinutes: 4,
    title: 'Glue Applicator Fault',
    timeRange: '11:52 - 11:56',
    equipment: 'Packer KISTER',
    avgSpeed: '0 cans/hr',
    plannedSpeed: '1,800 cans/hr',
  },
  {
    id: 'pk-seg-8',
    status: 'slow-running',
    durationMinutes: 6,
    title: 'Slow Run Pace',
    timeRange: '11:56 - 12:02',
    equipment: 'Packer KISTER',
    avgSpeed: '1,420 cans/hr',
    plannedSpeed: '1,800 cans/hr',
  },
  {
    id: 'pk-seg-9',
    status: 'running',
    durationMinutes: 18,
    title: 'Running at Optimal Speed',
    timeRange: '12:02 - 12:19',
    equipment: 'Packer KISTER',
    avgSpeed: '1,780 cans/hr',
    plannedSpeed: '1,800 cans/hr',
  },
];

// Alias for backward compatibility
export const PACKER_KISTER_SEGMENTS = PACKER_KISTER_SEGMENTS_1HR;

// 4 Hours (240m)
export const PACKER_KISTER_SEGMENTS_4HR: CandybarSegment[] = [
  {
    id: 'pk-4h-1',
    status: 'running',
    durationMinutes: 55,
    title: 'Morning High Speed Packaging',
    timeRange: '09:00 - 09:55',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,780 cans/hr',
  },
  {
    id: 'pk-4h-2',
    status: 'fault',
    durationMinutes: 12,
    title: 'Case Erector Misfeed',
    timeRange: '09:55 - 10:07',
    equipment: 'Packer KISTER',
    hasNote: true,
    operatorNote: {
      author: 'Chris G.',
      initials: 'CG',
      text: 'Cleared carton magazine jam and restarted feed.',
    },
  },
  {
    id: 'pk-4h-3',
    status: 'slow-running',
    durationMinutes: 15,
    title: 'Packer Speed Ramp-up',
    timeRange: '10:07 - 10:22',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,320 cans/hr',
  },
  {
    id: 'pk-4h-4',
    status: 'running',
    durationMinutes: 44,
    title: 'Steady Packaging Run',
    timeRange: '10:22 - 11:06',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,760 cans/hr',
  },
  {
    id: 'pk-4h-5',
    status: 'planned-dt',
    durationMinutes: 20,
    title: 'Scheduled Film Reel Changeover',
    timeRange: '11:06 - 11:26',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-4h-6',
    status: 'first-fault',
    durationMinutes: 10,
    title: 'Sensor Calibration and Quality Assurance Halt',
    timeRange: '11:26 - 11:36',
    equipment: 'Packer KISTER',
    hasNote: true,
    operatorNote: {
      author: 'Chris G.',
      initials: 'CG',
      text: 'Sensor calibration complete and QA verified.',
    },
  },
  {
    id: 'pk-4h-7',
    status: 'slow-running',
    durationMinutes: 14,
    title: 'Post-calibration Ramp',
    timeRange: '11:36 - 11:50',
    equipment: 'Packer KISTER',
    avgSpeed: '1,450 cans/hr',
  },
  {
    id: 'pk-4h-8',
    status: 'running',
    durationMinutes: 70,
    title: 'Optimal Packing Pace',
    timeRange: '11:50 - 13:00',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,795 cans/hr',
  },
];

// Shift (480m)
export const PACKER_KISTER_SEGMENTS_SHIFT: CandybarSegment[] = [
  {
    id: 'pk-sh-1',
    status: 'hidden',
    durationMinutes: 30,
    title: 'Shift Pre-Start & Setup',
    timeRange: '09:00 - 09:30',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-sh-2',
    status: 'running',
    durationMinutes: 85,
    title: 'Morning Production Packing',
    timeRange: '09:30 - 10:55',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,780 cans/hr',
  },
  {
    id: 'pk-sh-3',
    status: 'fault',
    durationMinutes: 18,
    title: 'Infeed Conveyor Backup',
    timeRange: '10:55 - 11:13',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-sh-4',
    status: 'slow-running',
    durationMinutes: 22,
    title: 'Packer Speed Stabilization',
    timeRange: '11:13 - 11:35',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-sh-5',
    status: 'first-fault',
    durationMinutes: 12,
    title: 'Sensor Calibration and Quality Assurance Halt',
    timeRange: '11:35 - 11:47',
    equipment: 'Packer KISTER',
    hasNote: true,
    operatorNote: {
      author: 'Chris G.',
      initials: 'CG',
      text: 'Sensor calibration complete and QA verified.',
    },
  },
  {
    id: 'pk-sh-6',
    status: 'running',
    durationMinutes: 110,
    title: 'Mid-Shift Continuous Packaging',
    timeRange: '11:47 - 13:37',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,810 cans/hr',
  },
  {
    id: 'pk-sh-7',
    status: 'planned-dt',
    durationMinutes: 35,
    title: 'Scheduled Tooling & Glue Purge',
    timeRange: '13:37 - 14:12',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-sh-8',
    status: 'slow-running',
    durationMinutes: 28,
    title: 'Warmup Cycle',
    timeRange: '14:12 - 14:40',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-sh-9',
    status: 'running',
    durationMinutes: 140,
    title: 'End of Shift Steady State Run',
    timeRange: '14:40 - 17:00',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,820 cans/hr',
  },
];

// 24 Hours (1440m)
export const PACKER_KISTER_SEGMENTS_24HR: CandybarSegment[] = [
  {
    id: 'pk-24-1',
    status: 'hidden',
    durationMinutes: 75,
    title: 'Previous Day Turnover',
    timeRange: 'Yesterday 09:00 - 10:15',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-24-2',
    status: 'running',
    durationMinutes: 260,
    title: 'Day Shift Continuous Packaging',
    timeRange: 'Yesterday 10:15 - 14:35',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,790 cans/hr',
  },
  {
    id: 'pk-24-3',
    status: 'fault',
    durationMinutes: 25,
    title: 'Case Magazine Jam',
    timeRange: 'Yesterday 14:35 - 15:00',
    equipment: 'Packer KISTER',
    hasNote: true,
    operatorNote: {
      author: 'Chris G.',
      initials: 'CG',
      text: 'Magazine unjammed, feeder tension calibrated.',
    },
  },
  {
    id: 'pk-24-4',
    status: 'slow-running',
    durationMinutes: 30,
    title: 'Recovery Pace',
    timeRange: 'Yesterday 15:00 - 15:30',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-24-5',
    status: 'running',
    durationMinutes: 210,
    title: 'Shift 2 Production Packing',
    timeRange: 'Yesterday 15:30 - 19:00',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,770 cans/hr',
  },
  {
    id: 'pk-24-6',
    status: 'planned-dt',
    durationMinutes: 60,
    title: 'Scheduled Sanitation & Lube',
    timeRange: 'Yesterday 19:00 - 20:00',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-24-7',
    status: 'running',
    durationMinutes: 280,
    title: 'Night Shift Steady Run',
    timeRange: 'Yesterday 20:00 - 00:40',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,815 cans/hr',
  },
  {
    id: 'pk-24-8',
    status: 'first-fault',
    durationMinutes: 20,
    title: 'Sensor Calibration and Quality Assurance Halt',
    timeRange: '00:40 - 01:00',
    equipment: 'Packer KISTER',
    hasNote: true,
    operatorNote: {
      author: 'Chris G.',
      initials: 'CG',
      text: 'Sensor calibration complete and QA verified.',
    },
  },
  {
    id: 'pk-24-9',
    status: 'slow-running',
    durationMinutes: 40,
    title: 'Night Shift Ramp-up',
    timeRange: '01:00 - 01:40',
    equipment: 'Packer KISTER',
  },
  {
    id: 'pk-24-10',
    status: 'running',
    durationMinutes: 440,
    title: 'Morning Continuous Full Speed Run',
    timeRange: '01:40 - 09:00',
    equipment: 'Packer KISTER',
    plannedSpeed: '1,800 cans/hr',
    avgSpeed: '1,825 cans/hr',
  },
];

// ============================================================================
// Default Line Data (CAN G4 Line)
// ============================================================================
export const LINE_MAIN_1HR: CandybarSegment[] = [
  { id: 'l-1', status: 'running', durationMinutes: 8, title: 'Running', timeRange: '11:19 - 11:27', avgSpeed: '1,720 cans/hr' },
  { id: 'l-2', status: 'fault', durationMinutes: 6, title: 'Seamer Infeed Jam', timeRange: '11:27 - 11:33', avgSpeed: '0 cans/hr' },
  { id: 'l-3', status: 'slow-running', durationMinutes: 7, title: 'Line Ramp-up', timeRange: '11:33 - 11:40', avgSpeed: '1,200 cans/hr' },
  { id: 'l-4', status: 'fault', durationMinutes: 5, title: 'Filler Level Fault', timeRange: '11:40 - 11:45', avgSpeed: '0 cans/hr' },
  { id: 'l-5', status: 'planned-stop', durationMinutes: 12, title: 'Planned CIP Rinse', timeRange: '11:45 - 11:57', avgSpeed: '0 cans/hr' },
  { id: 'l-6', status: 'slow-running', durationMinutes: 7, title: 'Recovery Phase', timeRange: '11:57 - 12:04', avgSpeed: '1,400 cans/hr' },
  { id: 'l-7', status: 'running', durationMinutes: 15, title: 'Steady State Running', timeRange: '12:04 - 12:19', avgSpeed: '1,790 cans/hr' },
];

export const LINE_MAIN_DATA: EquipmentViewData = {
  id: 'line-main',
  name: 'CAN G4',
  headerTitle: 'CAN G4 Line',
  status: 'Running',
  kpis: {
    efficiency: { value: 92, delta: 'Positive', targetDelta: '2% vs Target', secondaryDelta: '+2.4% vs last hr' },
    waste: { value: '0.39', delta: 'Positive', targetDelta: '1.7% vs Target', secondaryDelta: '+0.3% vs last hr' },
    rateLoss: { value: 12, delta: 'Positive', targetDelta: '3% vs Target', secondaryDelta: '-2.4% vs last hr' },
    downtime: {
      value: 16,
      delta: 'Negative',
      targetDelta: '2% vs Target',
      secondaryDelta: '+2.4% vs last hr',
      subMetrics: [
        { value: 6, label: 'Major Events' },
        { value: '2.17', unit: 'min', label: 'MTBF' },
        { value: '1.55', unit: 'min', label: 'MTTR' },
      ],
    },
  },
  candybarSegments: LINE_MAIN_1HR,
  timeframeSegments: {
    '1hr': LINE_MAIN_1HR,
    '4hr': mock4HrSegments,
    shift: mockShiftSegments,
    '24hr': mock24HrSegments,
  },
};

// ============================================================================
// Dictionary of All Equipment Specific Views
// ============================================================================
export const EQUIPMENT_VIEWS: Record<string, EquipmentViewData> = {
  'line-main': LINE_MAIN_DATA,
  'can-g4': LINE_MAIN_DATA,

  'packer-kister': {
    id: 'packer-kister',
    name: 'Packer KISTER',
    headerTitle: 'Packer KISTER',
    status: 'Running',
    kpis: {
      efficiency: { value: 92, delta: 'Positive', targetDelta: '2% vs Target', secondaryDelta: '+2.4% vs last hr' },
      waste: { value: '0.39', delta: 'Positive', targetDelta: '1.7% vs Target', secondaryDelta: '+0.3% vs last hr' },
      rateLoss: { value: 12, delta: 'Positive', targetDelta: '3% vs Target', secondaryDelta: '-2.4% vs last hr' },
      downtime: {
        value: 16,
        delta: 'Negative',
        targetDelta: '2% vs Target',
        secondaryDelta: '+2.4% vs last hr',
        subMetrics: [
          { value: 6, label: 'Major Events' },
          { value: '2.17', unit: 'min', label: 'MTBF' },
          { value: '1.55', unit: 'min', label: 'MTTR' },
        ],
      },
    },
    candybarSegments: PACKER_KISTER_SEGMENTS_1HR,
    timeframeSegments: {
      '1hr': PACKER_KISTER_SEGMENTS_1HR,
      '4hr': PACKER_KISTER_SEGMENTS_4HR,
      shift: PACKER_KISTER_SEGMENTS_SHIFT,
      '24hr': PACKER_KISTER_SEGMENTS_24HR,
    },
  },

  filler: {
    id: 'filler',
    name: 'Filler',
    headerTitle: 'Filler',
    status: 'Faulted',
    kpis: {
      efficiency: { value: 74, delta: 'Negative', targetDelta: '-11% vs Target', secondaryDelta: '-8.2% vs last hr' },
      waste: { value: '1.28', delta: 'Negative', targetDelta: '-0.88% vs Target', secondaryDelta: '+0.7% vs last hr' },
      rateLoss: { value: 24, delta: 'Negative', targetDelta: '-9% vs Target', secondaryDelta: '+6.1% vs last hr' },
      downtime: {
        value: 38,
        delta: 'Negative',
        targetDelta: '-18% vs Target',
        secondaryDelta: '+14% vs last hr',
        subMetrics: [
          { value: 12, label: 'Major Events' },
          { value: '1.05', unit: 'min', label: 'MTBF' },
          { value: '3.12', unit: 'min', label: 'MTTR' },
        ],
      },
    },
    candybarSegments: [
      { id: 'f-1', status: 'running', durationMinutes: 10, title: 'Filling Active', timeRange: '11:19 - 11:29' },
      { id: 'f-2', status: 'fault', durationMinutes: 14, title: 'Nozzle Flow Calibration Fault', timeRange: '11:29 - 11:43', hasNote: true, operatorNote: { author: 'Chris G.', initials: 'CG', text: 'Nozzle 4 recalibrated' } },
      { id: 'f-3', status: 'slow-running', durationMinutes: 12, title: 'Slow Fill Test', timeRange: '11:43 - 11:55' },
      { id: 'f-4', status: 'fault', durationMinutes: 8, title: 'Pressure Relief Trip', timeRange: '11:55 - 12:03' },
      { id: 'f-5', status: 'running', durationMinutes: 16, title: 'Normal Operation', timeRange: '12:03 - 12:19' },
    ],
    timeframeSegments: {
      '1hr': [
        { id: 'f-1h-1', status: 'running', durationMinutes: 10, title: 'Filling Active', timeRange: '10:30 - 10:40' },
        { id: 'f-1h-2', status: 'fault', durationMinutes: 14, title: 'Nozzle Flow Calibration Fault', timeRange: '10:40 - 10:54', hasNote: true, operatorNote: { author: 'Chris G.', initials: 'CG', text: 'Nozzle 4 recalibrated' } },
        { id: 'f-1h-3', status: 'slow-running', durationMinutes: 12, title: 'Slow Fill Test', timeRange: '10:54 - 11:06' },
        { id: 'f-1h-4', status: 'fault', durationMinutes: 8, title: 'Pressure Relief Trip', timeRange: '11:06 - 11:14' },
        { id: 'f-1h-5', status: 'running', durationMinutes: 16, title: 'Normal Operation', timeRange: '11:14 - 11:30' },
      ],
      '4hr': [
        { id: 'f-4h-1', status: 'running', durationMinutes: 50, title: 'Filling Steady', timeRange: '09:00 - 09:50' },
        { id: 'f-4h-2', status: 'fault', durationMinutes: 30, title: 'Nozzle Flow Calibration Fault', timeRange: '09:50 - 10:20' },
        { id: 'f-4h-3', status: 'slow-running', durationMinutes: 25, title: 'Recalibration Phase', timeRange: '10:20 - 10:45' },
        { id: 'f-4h-4', status: 'planned-dt', durationMinutes: 25, title: 'CIP Flush Verification', timeRange: '10:45 - 11:10' },
        { id: 'f-4h-5', status: 'fault', durationMinutes: 20, title: 'Pressure Relief Trip', timeRange: '11:10 - 11:30' },
        { id: 'f-4h-6', status: 'running', durationMinutes: 90, title: 'Filling Steady', timeRange: '11:30 - 13:00' },
      ],
      shift: [
        { id: 'f-sh-1', status: 'hidden', durationMinutes: 30, title: 'Sanitation Startup', timeRange: '09:00 - 09:30' },
        { id: 'f-sh-2', status: 'running', durationMinutes: 110, title: 'Morning Fill Run', timeRange: '09:30 - 11:20' },
        { id: 'f-sh-3', status: 'fault', durationMinutes: 35, title: 'Flow Meter Recalibration', timeRange: '11:20 - 11:55' },
        { id: 'f-sh-4', status: 'slow-running', durationMinutes: 45, title: 'Controlled Pace', timeRange: '11:55 - 12:40' },
        { id: 'f-sh-5', status: 'planned-dt', durationMinutes: 40, title: 'CIP Rinse Cycle', timeRange: '12:40 - 13:20' },
        { id: 'f-sh-6', status: 'fault', durationMinutes: 20, title: 'Bowl Level Alert', timeRange: '13:20 - 13:40' },
        { id: 'f-sh-7', status: 'running', durationMinutes: 200, title: 'Afternoon Filling', timeRange: '13:40 - 17:00' },
      ],
      '24hr': [
        { id: 'f-24-1', status: 'hidden', durationMinutes: 60, title: 'Daily Turnover', timeRange: 'Yesterday 09:00 - 10:00' },
        { id: 'f-24-2', status: 'running', durationMinutes: 320, title: 'Shift 1 Filling', timeRange: 'Yesterday 10:00 - 15:20' },
        { id: 'f-24-3', status: 'fault', durationMinutes: 40, title: 'Valve Cluster Jam', timeRange: 'Yesterday 15:20 - 16:00' },
        { id: 'f-24-4', status: 'running', durationMinutes: 280, title: 'Shift 2 Production', timeRange: 'Yesterday 16:00 - 20:40' },
        { id: 'f-24-5', status: 'planned-dt', durationMinutes: 80, title: 'Night CIP Sanitation', timeRange: 'Yesterday 20:40 - 22:00' },
        { id: 'f-24-6', status: 'running', durationMinutes: 360, title: 'Graveyard Continuous Fill', timeRange: 'Yesterday 22:00 - 04:00' },
        { id: 'f-24-7', status: 'fault', durationMinutes: 50, title: 'Infeed Valve Trip', timeRange: '04:00 - 04:50' },
        { id: 'f-24-8', status: 'running', durationMinutes: 250, title: 'Morning Production', timeRange: '04:50 - 09:00' },
      ],
    },
  },

  depalletizer: {
    id: 'depalletizer',
    name: 'Depalletizer',
    headerTitle: 'Depalletizer',
    status: 'Running',
    kpis: {
      efficiency: { value: 96, delta: 'Positive', targetDelta: '4% vs Target', secondaryDelta: '+1.1% vs last hr' },
      waste: { value: '0.12', delta: 'Positive', targetDelta: '1.9% vs Target', secondaryDelta: '-0.1% vs last hr' },
      rateLoss: { value: 4, delta: 'Positive', targetDelta: '5% vs Target', secondaryDelta: '-1.2% vs last hr' },
      downtime: {
        value: 5,
        delta: 'Positive',
        targetDelta: '7% vs Target',
        secondaryDelta: '-4.2% vs last hr',
        subMetrics: [
          { value: 1, label: 'Major Events' },
          { value: '14.2', unit: 'min', label: 'MTBF' },
          { value: '0.80', unit: 'min', label: 'MTTR' },
        ],
      },
    },
    candybarSegments: [
      { id: 'dp-1', status: 'running', durationMinutes: 42, title: 'Continuous Feed', timeRange: '11:19 - 12:01' },
      { id: 'dp-2', status: 'slow-running', durationMinutes: 8, title: 'Pallet Changeover', timeRange: '12:01 - 12:09' },
      { id: 'dp-3', status: 'running', durationMinutes: 10, title: 'Continuous Feed', timeRange: '12:09 - 12:19' },
    ],
    timeframeSegments: {
      '1hr': [
        { id: 'dp-1h-1', status: 'running', durationMinutes: 44, title: 'Continuous Sweep', timeRange: '10:30 - 11:14' },
        { id: 'dp-1h-2', status: 'slow-running', durationMinutes: 6, title: 'Pallet Hoist Changeover', timeRange: '11:14 - 11:20' },
        { id: 'dp-1h-3', status: 'running', durationMinutes: 10, title: 'Continuous Sweep', timeRange: '11:20 - 11:30' },
      ],
      '4hr': [
        { id: 'dp-4h-1', status: 'running', durationMinutes: 110, title: 'Continuous Feed Run', timeRange: '09:00 - 10:50' },
        { id: 'dp-4h-2', status: 'slow-running', durationMinutes: 15, title: 'Tier Sheet Magazine Reload', timeRange: '10:50 - 11:05' },
        { id: 'dp-4h-3', status: 'running', durationMinutes: 115, title: 'High Speed Depalletizing', timeRange: '11:05 - 13:00' },
      ],
      shift: [
        { id: 'dp-sh-1', status: 'hidden', durationMinutes: 20, title: 'Line Pre-check', timeRange: '09:00 - 09:20' },
        { id: 'dp-sh-2', status: 'running', durationMinutes: 210, title: 'Morning Pallet Sweeps', timeRange: '09:20 - 12:50' },
        { id: 'dp-sh-3', status: 'planned-dt', durationMinutes: 25, title: 'Hoist Guide Lubrication', timeRange: '12:50 - 13:15' },
        { id: 'dp-sh-4', status: 'running', durationMinutes: 225, title: 'Afternoon Continuous Sweeps', timeRange: '13:15 - 17:00' },
      ],
      '24hr': [
        { id: 'dp-24-1', status: 'running', durationMinutes: 420, title: 'Shift 1 Pallet Feeding', timeRange: 'Yesterday 09:00 - 16:00' },
        { id: 'dp-24-2', status: 'planned-dt', durationMinutes: 40, title: 'Scheduled Inspection', timeRange: 'Yesterday 16:00 - 16:40' },
        { id: 'dp-24-3', status: 'running', durationMinutes: 440, title: 'Shift 2 Depalletizing', timeRange: 'Yesterday 16:40 - 00:00' },
        { id: 'dp-24-4', status: 'running', durationMinutes: 540, title: 'Night Shift Continuous Sweep', timeRange: '00:00 - 09:00' },
      ],
    },
  },

  'empty-can-conveyor': {
    id: 'empty-can-conveyor',
    name: 'Empty can conveyor',
    headerTitle: 'Empty can conveyor',
    status: 'Running',
    kpis: {
      efficiency: { value: 94, delta: 'Positive', targetDelta: '2% vs Target', secondaryDelta: '+0.8% vs last hr' },
      waste: { value: '0.08', delta: 'Positive', targetDelta: '1.9% vs Target', secondaryDelta: '0.0%' },
      rateLoss: { value: 6, delta: 'Positive', targetDelta: '4% vs Target', secondaryDelta: '-0.5%' },
      downtime: {
        value: 8,
        delta: 'Positive',
        targetDelta: '5% vs Target',
        secondaryDelta: '-1.5% vs last hr',
        subMetrics: [
          { value: 2, label: 'Major Events' },
          { value: '8.4', unit: 'min', label: 'MTBF' },
          { value: '1.10', unit: 'min', label: 'MTTR' },
        ],
      },
    },
    candybarSegments: [
      { id: 'ecc-1', status: 'running', durationMinutes: 60, title: 'Full Speed Transfer', timeRange: '11:19 - 12:19' },
    ],
    timeframeSegments: {
      '1hr': [{ id: 'ecc-1h', status: 'running', durationMinutes: 60, title: 'Full Speed Transfer', timeRange: '10:30 - 11:30' }],
      '4hr': [
        { id: 'ecc-4h-1', status: 'running', durationMinutes: 140, title: 'Continuous Can Flow', timeRange: '09:00 - 11:20' },
        { id: 'ecc-4h-2', status: 'slow-running', durationMinutes: 20, title: 'Buffer Regulation', timeRange: '11:20 - 11:40' },
        { id: 'ecc-4h-3', status: 'running', durationMinutes: 80, title: 'Full Speed Transfer', timeRange: '11:40 - 13:00' },
      ],
      shift: [
        { id: 'ecc-sh-1', status: 'running', durationMinutes: 260, title: 'Steady Flow', timeRange: '09:00 - 13:20' },
        { id: 'ecc-sh-2', status: 'slow-running', durationMinutes: 30, title: 'Line Speed Sync', timeRange: '13:20 - 13:50' },
        { id: 'ecc-sh-3', status: 'running', durationMinutes: 190, title: 'Steady Flow', timeRange: '13:50 - 17:00' },
      ],
      '24hr': [
        { id: 'ecc-24-1', status: 'running', durationMinutes: 700, title: 'Continuous Can Flow', timeRange: 'Yesterday 09:00 - 20:40' },
        { id: 'ecc-24-2', status: 'slow-running', durationMinutes: 40, title: 'Buffer Regulation', timeRange: 'Yesterday 20:40 - 21:20' },
        { id: 'ecc-24-3', status: 'running', durationMinutes: 700, title: 'Continuous Can Flow', timeRange: 'Yesterday 21:20 - 09:00' },
      ],
    },
  },

  seamer: {
    id: 'seamer',
    name: 'Seamer',
    headerTitle: 'Seamer',
    status: 'Running',
    kpis: {
      efficiency: { value: 91, delta: 'Positive', targetDelta: '1% vs Target', secondaryDelta: '+1.5% vs last hr' },
      waste: { value: '0.45', delta: 'Positive', targetDelta: '1.5% vs Target', secondaryDelta: '+0.1%' },
      rateLoss: { value: 11, delta: 'Positive', targetDelta: '2% vs Target', secondaryDelta: '-1.0%' },
      downtime: {
        value: 14,
        delta: 'Negative',
        targetDelta: '1% vs Target',
        secondaryDelta: '+1.8% vs last hr',
        subMetrics: [
          { value: 4, label: 'Major Events' },
          { value: '3.4', unit: 'min', label: 'MTBF' },
          { value: '1.80', unit: 'min', label: 'MTTR' },
        ],
      },
    },
    candybarSegments: [
      { id: 'sm-1', status: 'running', durationMinutes: 25, title: 'High Speed Seaming', timeRange: '11:19 - 11:44' },
      { id: 'sm-2', status: 'slow-running', durationMinutes: 10, title: 'Lid Feeder Synchronization', timeRange: '11:44 - 11:54' },
      { id: 'sm-3', status: 'running', durationMinutes: 25, title: 'High Speed Seaming', timeRange: '11:54 - 12:19' },
    ],
    timeframeSegments: {
      '1hr': [
        { id: 'sm-1h-1', status: 'running', durationMinutes: 25, title: 'High Speed Seaming', timeRange: '10:30 - 10:55' },
        { id: 'sm-1h-2', status: 'slow-running', durationMinutes: 10, title: 'Lid Feeder Synchronization', timeRange: '10:55 - 11:05' },
        { id: 'sm-1h-3', status: 'running', durationMinutes: 25, title: 'High Speed Seaming', timeRange: '11:05 - 11:30' },
      ],
      '4hr': [
        { id: 'sm-4h-1', status: 'running', durationMinutes: 85, title: 'Continuous Seam Run', timeRange: '09:00 - 10:25' },
        { id: 'sm-4h-2', status: 'fault', durationMinutes: 15, title: 'Lid Chute Jam', timeRange: '10:25 - 10:40' },
        { id: 'sm-4h-3', status: 'slow-running', durationMinutes: 20, title: 'Double Seam Inspection', timeRange: '10:40 - 11:00' },
        { id: 'sm-4h-4', status: 'running', durationMinutes: 120, title: 'High Rate Seaming', timeRange: '11:00 - 13:00' },
      ],
      shift: [
        { id: 'sm-sh-1', status: 'hidden', durationMinutes: 25, title: 'Pre-shift Seam Teardown Check', timeRange: '09:00 - 09:25' },
        { id: 'sm-sh-2', status: 'running', durationMinutes: 185, title: 'Morning Seam Run', timeRange: '09:25 - 12:30' },
        { id: 'sm-sh-3', status: 'planned-dt', durationMinutes: 30, title: 'Tooling Lubrication & Clean', timeRange: '12:30 - 13:00' },
        { id: 'sm-sh-4', status: 'running', durationMinutes: 240, title: 'Afternoon Production', timeRange: '13:00 - 17:00' },
      ],
      '24hr': [
        { id: 'sm-24-1', status: 'running', durationMinutes: 440, title: 'Day Shift Seaming', timeRange: 'Yesterday 09:00 - 16:20' },
        { id: 'sm-24-2', status: 'fault', durationMinutes: 30, title: 'Chuck Roll Jam', timeRange: 'Yesterday 16:20 - 16:50' },
        { id: 'sm-24-3', status: 'running', durationMinutes: 450, title: 'Shift 2 Production', timeRange: 'Yesterday 16:50 - 00:20' },
        { id: 'sm-24-4', status: 'running', durationMinutes: 520, title: 'Graveyard Continuous Run', timeRange: '00:20 - 09:00' },
      ],
    },
  },
};

export function createNotRunningEquipmentData(id: string, name: string): EquipmentViewData {
  const notRunningSegments1Hr: CandybarSegment[] = [
    {
      id: `${id}-nr-1h`,
      status: 'not-running',
      durationMinutes: 60,
      title: 'Not Running — Machine Inactive',
      timeRange: '10:30 - 11:30',
      equipment: name,
      avgSpeed: '0 cans/hr',
      plannedSpeed: '0 cans/hr',
    },
  ];

  const notRunningSegments4Hr: CandybarSegment[] = [
    {
      id: `${id}-nr-4h`,
      status: 'not-running',
      durationMinutes: 240,
      title: 'Not Running — Machine Inactive',
      timeRange: '09:00 - 13:00',
      equipment: name,
      avgSpeed: '0 cans/hr',
      plannedSpeed: '0 cans/hr',
    },
  ];

  const notRunningSegmentsShift: CandybarSegment[] = [
    {
      id: `${id}-nr-sh`,
      status: 'not-running',
      durationMinutes: 480,
      title: 'Not Running — Machine Inactive',
      timeRange: '09:00 - 17:00',
      equipment: name,
      avgSpeed: '0 cans/hr',
      plannedSpeed: '0 cans/hr',
    },
  ];

  const notRunningSegments24Hr: CandybarSegment[] = [
    {
      id: `${id}-nr-24h`,
      status: 'not-running',
      durationMinutes: 1440,
      title: 'Not Running — Machine Inactive',
      timeRange: 'Yesterday 09:00 - 09:00',
      equipment: name,
      avgSpeed: '0 cans/hr',
      plannedSpeed: '0 cans/hr',
    },
  ];

  return {
    id,
    name,
    headerTitle: name,
    status: 'Not Running',
    kpis: {
      efficiency: {
        value: 0,
        delta: 'Neutral',
        targetDelta: '0% vs Target',
        secondaryDelta: '—',
      },
      waste: {
        value: '0.00',
        delta: 'Neutral',
        targetDelta: '0% vs Target',
        secondaryDelta: '—',
      },
      rateLoss: {
        value: 0,
        delta: 'Neutral',
        targetDelta: '0% vs Target',
        secondaryDelta: '—',
      },
      downtime: {
        value: 0,
        delta: 'Neutral',
        targetDelta: '0% vs Target',
        secondaryDelta: '—',
        subMetrics: [
          { value: 0, label: 'Major Events' },
          { value: '—', label: 'MTBF' },
          { value: '—', label: 'MTTR' },
        ],
      },
    },
    candybarSegments: notRunningSegments1Hr,
    timeframeSegments: {
      '1hr': notRunningSegments1Hr,
      '4hr': notRunningSegments4Hr,
      shift: notRunningSegmentsShift,
      '24hr': notRunningSegments24Hr,
    },
  };
}

// Add Not Running equipment pieces to dictionary
EQUIPMENT_VIEWS['packer-vega-1'] = createNotRunningEquipmentData('packer-vega-1', 'Packer Vega 1');
EQUIPMENT_VIEWS['palletizer-1-robocombi'] = createNotRunningEquipmentData('palletizer-1-robocombi', 'Palletizer 1 Robocombi');
EQUIPMENT_VIEWS['pallet-wrapper-1'] = createNotRunningEquipmentData('pallet-wrapper-1', 'Pallet wrapper 1');

export function getEquipmentData(id: string): EquipmentViewData {
  if (EQUIPMENT_VIEWS[id]) {
    return EQUIPMENT_VIEWS[id];
  }
  // Generic fallback for any other equipment clicked
  return {
    id,
    name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    headerTitle: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    status: 'Running',
    kpis: LINE_MAIN_DATA.kpis,
    candybarSegments: LINE_MAIN_DATA.candybarSegments,
    timeframeSegments: LINE_MAIN_DATA.timeframeSegments,
  };
}

/**
 * Returns the exact Candybar segments for an equipment and timeframe combination.
 * Automatically guarantees correct segment duration (1h=60m, 4h=240m, shift=480m, 24h=1440m).
 */
export function getEquipmentCandybarSegments(
  equipmentId: string,
  timeframe: CandybarTimeframe
): CandybarSegment[] {
  const equip = getEquipmentData(equipmentId);

  // 1. Direct match in equipment's timeframeSegments
  if (equip.timeframeSegments && equip.timeframeSegments[timeframe]) {
    return equip.timeframeSegments[timeframe]!;
  }

  // 2. Fallback to 1hr candybarSegments if 1hr requested
  if (timeframe === '1hr' && equip.candybarSegments?.length > 0) {
    return equip.candybarSegments;
  }

  // 3. Fallback to Line main timeframe segments
  if (LINE_MAIN_DATA.timeframeSegments?.[timeframe]) {
    return LINE_MAIN_DATA.timeframeSegments[timeframe]!;
  }

  return LINE_MAIN_1HR;
}
