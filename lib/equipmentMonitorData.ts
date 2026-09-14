import { CandybarSegment, CandybarTimeframe } from '@/components/shared/Candybar';

export type EquipmentMonitorStatus =
  | 'Running'
  | 'Slow Run'
  | 'Fault'
  | 'Faulted'
  | 'Planned Stop'
  | 'Blocked'
  | 'Not Running';

export interface EquipmentMonitorRow {
  id: string;
  name: string;
  status: EquipmentMonitorStatus;
  statusTag: {
    label: string;
    icon: string;
    variant: 'running' | 'slow-run' | 'fault' | 'blocked' | 'not-running';
  };
  candybarHeight?: number; // default 44px, 87px for main line
  timeframeSegments: Record<CandybarTimeframe, CandybarSegment[]>;
}

// ============================================================================
// Equipment Rows (Figma Node 10742:130710 exact timeline proportions)
// ============================================================================

export const EQUIPMENT_MONITOR_ROWS: EquipmentMonitorRow[] = [
  // 1. Can Line (Overview row, 87px height in Figma)
  {
    id: 'can-line',
    name: 'Can Line',
    status: 'Running',
    candybarHeight: 87,
    statusTag: {
      label: 'Running',
      icon: 'play_arrow',
      variant: 'running',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'cl-1h-1', status: 'running', durationMinutes: 5, title: 'Steady State Bottling', timeRange: '11:19 - 11:24', equipment: 'Can Line', avgSpeed: '1,820 cpm' },
        { id: 'cl-1h-2', status: 'fault', durationMinutes: 5, title: 'Infeed Conveyor Choke', timeRange: '11:24 - 11:29', equipment: 'Can Line', avgSpeed: '0 cpm' },
        { id: 'cl-1h-3', status: 'slow-running', durationMinutes: 5, title: 'Controlled Restart', timeRange: '11:29 - 11:34', equipment: 'Can Line', avgSpeed: '940 cpm' },
        { id: 'cl-1h-4', status: 'fault', durationMinutes: 5, title: 'Filler Valve Fault', timeRange: '11:34 - 11:39', equipment: 'Can Line', avgSpeed: '0 cpm' },
        { id: 'cl-1h-5', status: 'slow-running', durationMinutes: 8, title: 'Pressure Stabilization', timeRange: '11:39 - 11:47', equipment: 'Can Line', avgSpeed: '1,100 cpm' },
        { id: 'cl-1h-6', status: 'fault', durationMinutes: 10, title: 'Can Rinser Jam', timeRange: '11:47 - 11:57', equipment: 'Can Line', avgSpeed: '0 cpm', hasNote: true, operatorNote: { author: 'Marcus V.', initials: 'MV', text: 'Debris lodged in starwheel removed.' } },
        { id: 'cl-1h-7', status: 'planned-stop', durationMinutes: 12, title: 'Scheduled Operator Changeover', timeRange: '11:57 - 12:09', equipment: 'Can Line' },
        { id: 'cl-1h-8', status: 'slow-running', durationMinutes: 9, title: 'Line Ramp-Up', timeRange: '12:09 - 12:18', equipment: 'Can Line', avgSpeed: '1,250 cpm' },
        { id: 'cl-1h-9', status: 'fault', durationMinutes: 3, title: 'Inspection Camera Reject Spike', timeRange: '12:18 - 12:21', equipment: 'Can Line', avgSpeed: '0 cpm' },
        { id: 'cl-1h-10', status: 'slow-running', durationMinutes: 5, title: 'Verification Speed Run', timeRange: '12:21 - 12:26', equipment: 'Can Line', avgSpeed: '1,300 cpm' },
        { id: 'cl-1h-11', status: 'fault', durationMinutes: 3, title: 'Case Packer Fault', timeRange: '12:26 - 12:29', equipment: 'Can Line', avgSpeed: '0 cpm' },
        { id: 'cl-1h-12', status: 'running', durationMinutes: 7, title: 'Nominal High Production', timeRange: '12:29 - 12:36', equipment: 'Can Line', avgSpeed: '1,850 cpm' },
      ],
      '4hr': [
        { id: 'cl-4h-1', status: 'running', durationMinutes: 70, title: 'High Production', timeRange: '08:30 - 09:40', equipment: 'Can Line', avgSpeed: '1,800 cpm' },
        { id: 'cl-4h-2', status: 'fault', durationMinutes: 15, title: 'Seamer Drive Trip', timeRange: '09:40 - 09:55', equipment: 'Can Line', avgSpeed: '0 cpm' },
        { id: 'cl-4h-3', status: 'slow-running', durationMinutes: 35, title: 'Recovering Speed', timeRange: '09:55 - 10:30', equipment: 'Can Line', avgSpeed: '1,200 cpm' },
        { id: 'cl-4h-4', status: 'planned-stop', durationMinutes: 20, title: 'QA Sampling', timeRange: '10:30 - 10:50', equipment: 'Can Line' },
        { id: 'cl-4h-5', status: 'running', durationMinutes: 65, title: 'Steady State Run', timeRange: '10:50 - 11:55', equipment: 'Can Line', avgSpeed: '1,820 cpm' },
        { id: 'cl-4h-6', status: 'slow-running', durationMinutes: 35, title: 'Downstream Throttling', timeRange: '11:55 - 12:30', equipment: 'Can Line', avgSpeed: '1,400 cpm' },
      ],
      'shift': [
        { id: 'cl-sh-1', status: 'planned-stop', durationMinutes: 30, title: 'Pre-Shift Inspection', timeRange: '07:00 - 07:30', equipment: 'Can Line' },
        { id: 'cl-sh-2', status: 'running', durationMinutes: 180, title: 'Shift 1 Production Run', timeRange: '07:30 - 10:30', equipment: 'Can Line', avgSpeed: '1,800 cpm' },
        { id: 'cl-sh-3', status: 'fault', durationMinutes: 25, title: 'Capper Stall', timeRange: '10:30 - 10:55', equipment: 'Can Line', avgSpeed: '0 cpm' },
        { id: 'cl-sh-4', status: 'slow-running', durationMinutes: 45, title: 'Pressure Equalization', timeRange: '10:55 - 11:40', equipment: 'Can Line', avgSpeed: '1,300 cpm' },
        { id: 'cl-sh-5', status: 'running', durationMinutes: 200, title: 'Steady Run', timeRange: '11:40 - 15:00', equipment: 'Can Line', avgSpeed: '1,820 cpm' },
      ],
      '24hr': [
        { id: 'cl-24h-1', status: 'running', durationMinutes: 420, title: 'Shift 3 Overnight Operation', timeRange: '23:00 - 06:00', equipment: 'Can Line', avgSpeed: '1,780 cpm' },
        { id: 'cl-24h-2', status: 'planned-stop', durationMinutes: 60, title: 'Daily Maintenance & CIP', timeRange: '06:00 - 07:00', equipment: 'Can Line' },
        { id: 'cl-24h-3', status: 'running', durationMinutes: 480, title: 'Shift 1 Operation', timeRange: '07:00 - 15:00', equipment: 'Can Line', avgSpeed: '1,810 cpm' },
        { id: 'cl-24h-4', status: 'fault', durationMinutes: 45, title: 'Conveyor Drive Motor Replacement', timeRange: '15:00 - 15:45', equipment: 'Can Line', avgSpeed: '0 cpm' },
        { id: 'cl-24h-5', status: 'running', durationMinutes: 435, title: 'Shift 2 Operation', timeRange: '15:45 - 23:00', equipment: 'Can Line', avgSpeed: '1,830 cpm' },
      ],
    },
  },

  // 2. Depalletizer (Running)
  {
    id: 'depalletizer',
    name: 'Depalletizer',
    status: 'Running',
    candybarHeight: 44,
    statusTag: {
      label: 'Running',
      icon: 'play_arrow',
      variant: 'running',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'dp-1h-1', status: 'fault', durationMinutes: 4, title: 'Sweep Arm Misalignment', timeRange: '11:19 - 11:23', equipment: 'Depalletizer', avgSpeed: '0 cpm' },
        { id: 'dp-1h-2', status: 'slow-running', durationMinutes: 18, title: 'Slow Discharge Feed', timeRange: '11:23 - 11:41', equipment: 'Depalletizer', avgSpeed: '1,100 cpm' },
        { id: 'dp-1h-3', status: 'blocked', durationMinutes: 5, title: 'Discharge Conveyor Starved', timeRange: '11:41 - 11:46', equipment: 'Depalletizer', avgSpeed: '0 cpm' },
        { id: 'dp-1h-4', status: 'slow-running', durationMinutes: 11, title: 'Tier Sheet Removal', timeRange: '11:46 - 11:57', equipment: 'Depalletizer', avgSpeed: '1,200 cpm' },
        { id: 'dp-1h-5', status: 'fault', durationMinutes: 6, title: 'Pallet Lift Safety Sensor', timeRange: '11:57 - 12:03', equipment: 'Depalletizer', avgSpeed: '0 cpm' },
        { id: 'dp-1h-6', status: 'slow-running', durationMinutes: 2, title: 'Repositioning', timeRange: '12:03 - 12:05', equipment: 'Depalletizer', avgSpeed: '900 cpm' },
        { id: 'dp-1h-7', status: 'fault', durationMinutes: 2, title: 'Emergency Stop Reset', timeRange: '12:05 - 12:07', equipment: 'Depalletizer', avgSpeed: '0 cpm' },
        { id: 'dp-1h-8', status: 'slow-running', durationMinutes: 2, title: 'Pre-flight Check', timeRange: '12:07 - 12:09', equipment: 'Depalletizer', avgSpeed: '800 cpm' },
        { id: 'dp-1h-9', status: 'running', durationMinutes: 27, title: 'Full Sweep Discharge', timeRange: '12:09 - 12:36', equipment: 'Depalletizer', avgSpeed: '1,900 cpm' },
      ],
      '4hr': [
        { id: 'dp-4h-1', status: 'running', durationMinutes: 120, title: 'Continuous Pallet Feeding', timeRange: '08:30 - 10:30', equipment: 'Depalletizer', avgSpeed: '1,850 cpm' },
        { id: 'dp-4h-2', status: 'blocked', durationMinutes: 15, title: 'Blocked by Outfeed', timeRange: '10:30 - 10:45', equipment: 'Depalletizer', avgSpeed: '0 cpm' },
        { id: 'dp-4h-3', status: 'running', durationMinutes: 105, title: 'Normal Infeed', timeRange: '10:45 - 12:30', equipment: 'Depalletizer', avgSpeed: '1,880 cpm' },
      ],
      'shift': [
        { id: 'dp-sh-1', status: 'running', durationMinutes: 240, title: 'High Volume Feed', timeRange: '07:00 - 11:00', equipment: 'Depalletizer', avgSpeed: '1,850 cpm' },
        { id: 'dp-sh-2', status: 'fault', durationMinutes: 20, title: 'Hydraulic Hoist Error', timeRange: '11:00 - 11:20', equipment: 'Depalletizer', avgSpeed: '0 cpm' },
        { id: 'dp-sh-3', status: 'running', durationMinutes: 220, title: 'Resumed Production', timeRange: '11:20 - 15:00', equipment: 'Depalletizer', avgSpeed: '1,870 cpm' },
      ],
      '24hr': [
        { id: 'dp-24h-1', status: 'running', durationMinutes: 1300, title: '24hr Total Depalletizing Run', timeRange: 'Yesterday - Today', equipment: 'Depalletizer', avgSpeed: '1,850 cpm' },
        { id: 'dp-24h-2', status: 'fault', durationMinutes: 40, title: 'Sensor Maintenance', timeRange: 'Shift 2 Interruption', equipment: 'Depalletizer', avgSpeed: '0 cpm' },
        { id: 'dp-24h-3', status: 'running', durationMinutes: 100, title: 'Active Production', timeRange: 'Shift 1 Today', equipment: 'Depalletizer', avgSpeed: '1,880 cpm' },
      ],
    },
  },

  // 3. Empty Can Conveyor (Running)
  {
    id: 'empty-can-conveyor',
    name: 'Empty Can Conveyor',
    status: 'Running',
    candybarHeight: 44,
    statusTag: {
      label: 'Running',
      icon: 'play_arrow',
      variant: 'running',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'ecc-1h-1', status: 'slow-running', durationMinutes: 19, title: 'Can Accumulation Infeed', timeRange: '11:19 - 11:38', equipment: 'Empty Can Conveyor', avgSpeed: '1,200 cpm' },
        { id: 'ecc-1h-2', status: 'blocked', durationMinutes: 5, title: 'Conveyor Jam at Rinser', timeRange: '11:38 - 11:43', equipment: 'Empty Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'ecc-1h-3', status: 'slow-running', durationMinutes: 12, title: 'Slow Transfer Speed', timeRange: '11:43 - 11:55', equipment: 'Empty Can Conveyor', avgSpeed: '1,100 cpm' },
        { id: 'ecc-1h-4', status: 'fault', durationMinutes: 2, title: 'Can Fall Sensor Halt', timeRange: '11:55 - 11:57', equipment: 'Empty Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'ecc-1h-5', status: 'slow-running', durationMinutes: 2, title: 'Belt Calibration', timeRange: '11:57 - 11:59', equipment: 'Empty Can Conveyor', avgSpeed: '900 cpm' },
        { id: 'ecc-1h-6', status: 'fault', durationMinutes: 1, title: 'Interlock Warning', timeRange: '11:59 - 12:00', equipment: 'Empty Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'ecc-1h-7', status: 'running', durationMinutes: 36, title: 'High-Speed Can Infeed', timeRange: '12:00 - 12:36', equipment: 'Empty Can Conveyor', avgSpeed: '1,900 cpm' },
      ],
      '4hr': [
        { id: 'ecc-4h-1', status: 'running', durationMinutes: 150, title: 'Empty Can Transfer', timeRange: '08:30 - 11:00', equipment: 'Empty Can Conveyor', avgSpeed: '1,880 cpm' },
        { id: 'ecc-4h-2', status: 'slow-running', durationMinutes: 30, title: 'Buffer Management', timeRange: '11:00 - 11:30', equipment: 'Empty Can Conveyor', avgSpeed: '1,300 cpm' },
        { id: 'ecc-4h-3', status: 'running', durationMinutes: 60, title: 'Full Speed Run', timeRange: '11:30 - 12:30', equipment: 'Empty Can Conveyor', avgSpeed: '1,900 cpm' },
      ],
      'shift': [
        { id: 'ecc-sh-1', status: 'running', durationMinutes: 440, title: 'Shift Steady Conveyor Feed', timeRange: '07:00 - 14:20', equipment: 'Empty Can Conveyor', avgSpeed: '1,890 cpm' },
        { id: 'ecc-sh-2', status: 'slow-running', durationMinutes: 40, title: 'Controlled Deceleration', timeRange: '14:20 - 15:00', equipment: 'Empty Can Conveyor', avgSpeed: '1,200 cpm' },
      ],
      '24hr': [
        { id: 'ecc-24h-1', status: 'running', durationMinutes: 1380, title: '24hr Infeed Conveyance', timeRange: 'Yesterday - Today', equipment: 'Empty Can Conveyor', avgSpeed: '1,860 cpm' },
        { id: 'ecc-24h-2', status: 'planned-stop', durationMinutes: 60, title: 'Daily Cleaning', timeRange: 'Yesterday 06:00 - 07:00', equipment: 'Empty Can Conveyor' },
      ],
    },
  },

  // 4. Filler (Faulted)
  {
    id: 'filler',
    name: 'Filler',
    status: 'Faulted',
    candybarHeight: 44,
    statusTag: {
      label: 'Faulted',
      icon: 'warning',
      variant: 'fault',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'fl-1h-1', status: 'planned-stop', durationMinutes: 12, title: 'CIP Pre-flush', timeRange: '11:19 - 11:31', equipment: 'Filler' },
        { id: 'fl-1h-2', status: 'fault', durationMinutes: 4, title: 'Valve 14 Pressure Drop', timeRange: '11:31 - 11:35', equipment: 'Filler', avgSpeed: '0 cpm', hasNote: true, operatorNote: { author: 'Elena Rostova', initials: 'ER', text: 'Seal gasket inspected and replaced on station 14.' } },
        { id: 'fl-1h-3', status: 'slow-running', durationMinutes: 17, title: 'Filling Volume Calibration', timeRange: '11:35 - 11:52', equipment: 'Filler', avgSpeed: '950 cpm' },
        { id: 'fl-1h-4', status: 'blocked', durationMinutes: 4, title: 'Can Backlog Starve', timeRange: '11:52 - 11:56', equipment: 'Filler', avgSpeed: '0 cpm' },
        { id: 'fl-1h-5', status: 'slow-running', durationMinutes: 10, title: 'Ramping Infeed', timeRange: '11:56 - 12:06', equipment: 'Filler', avgSpeed: '1,200 cpm' },
        { id: 'fl-1h-6', status: 'fault', durationMinutes: 6, title: 'CO2 Purge Level Failure', timeRange: '12:06 - 12:12', equipment: 'Filler', avgSpeed: '0 cpm' },
        { id: 'fl-1h-7', status: 'slow-running', durationMinutes: 13, title: 'Temperature Stabilization', timeRange: '12:12 - 12:25', equipment: 'Filler', avgSpeed: '1,100 cpm' },
        { id: 'fl-1h-8', status: 'running', durationMinutes: 8, title: 'High Speed Canning', timeRange: '12:25 - 12:33', equipment: 'Filler', avgSpeed: '1,850 cpm' },
        { id: 'fl-1h-9', status: 'fault', durationMinutes: 3, title: 'Snift Valve Leak Fault', timeRange: '12:33 - 12:36', equipment: 'Filler', avgSpeed: '0 cpm' },
      ],
      '4hr': [
        { id: 'fl-4h-1', status: 'running', durationMinutes: 110, title: 'Steady Filling Run', timeRange: '08:30 - 10:20', equipment: 'Filler', avgSpeed: '1,800 cpm' },
        { id: 'fl-4h-2', status: 'fault', durationMinutes: 20, title: 'Counter-Pressure Sensor Fault', timeRange: '10:20 - 10:40', equipment: 'Filler', avgSpeed: '0 cpm' },
        { id: 'fl-4h-3', status: 'slow-running', durationMinutes: 40, title: 'Manual Flow Check', timeRange: '10:40 - 11:20', equipment: 'Filler', avgSpeed: '1,100 cpm' },
        { id: 'fl-4h-4', status: 'running', durationMinutes: 45, title: 'Normal Canning', timeRange: '11:20 - 12:05', equipment: 'Filler', avgSpeed: '1,820 cpm' },
        { id: 'fl-4h-5', status: 'fault', durationMinutes: 25, title: 'Snift Exhaust Failure', timeRange: '12:05 - 12:30', equipment: 'Filler', avgSpeed: '0 cpm' },
      ],
      'shift': [
        { id: 'fl-sh-1', status: 'running', durationMinutes: 300, title: 'Shift 1 Production Run', timeRange: '07:00 - 12:00', equipment: 'Filler', avgSpeed: '1,820 cpm' },
        { id: 'fl-sh-2', status: 'fault', durationMinutes: 40, title: 'Sterilization Chamber Alarm', timeRange: '12:00 - 12:40', equipment: 'Filler', avgSpeed: '0 cpm' },
        { id: 'fl-sh-3', status: 'slow-running', durationMinutes: 140, title: 'Reduced Speed Packaging', timeRange: '12:40 - 15:00', equipment: 'Filler', avgSpeed: '1,200 cpm' },
      ],
      '24hr': [
        { id: 'fl-24h-1', status: 'running', durationMinutes: 980, title: 'Total 24hr Canning Run', timeRange: 'Yesterday - Today', equipment: 'Filler', avgSpeed: '1,800 cpm' },
        { id: 'fl-24h-2', status: 'fault', durationMinutes: 80, title: 'Multiple Valve Replacements', timeRange: 'Shift 2 Breakdown', equipment: 'Filler', avgSpeed: '0 cpm' },
        { id: 'fl-24h-3', status: 'planned-stop', durationMinutes: 90, title: 'Scheduled CIP Flush', timeRange: 'Night Shift', equipment: 'Filler' },
        { id: 'fl-24h-4', status: 'running', durationMinutes: 290, title: 'Current Shift Production', timeRange: 'Today', equipment: 'Filler', avgSpeed: '1,830 cpm' },
      ],
    },
  },

  // 5. Full Can Conveyor (Blocked)
  {
    id: 'full-can-conveyor',
    name: 'Full Can Conveyor',
    status: 'Blocked',
    candybarHeight: 44,
    statusTag: {
      label: 'Blocked',
      icon: 'warning',
      variant: 'blocked',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'fcc-1h-1', status: 'planned-stop', durationMinutes: 12, title: 'Belt Sanitation', timeRange: '11:19 - 11:31', equipment: 'Full Can Conveyor' },
        { id: 'fcc-1h-2', status: 'slow-running', durationMinutes: 17, title: 'Gentle Transport Rate', timeRange: '11:31 - 11:48', equipment: 'Full Can Conveyor', avgSpeed: '1,100 cpm' },
        { id: 'fcc-1h-3', status: 'blocked', durationMinutes: 4, title: 'Downstream Packer Queue Blocked', timeRange: '11:48 - 11:52', equipment: 'Full Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'fcc-1h-4', status: 'slow-running', durationMinutes: 10, title: 'Infeed Modulation', timeRange: '11:52 - 12:02', equipment: 'Full Can Conveyor', avgSpeed: '1,250 cpm' },
        { id: 'fcc-1h-5', status: 'fault', durationMinutes: 6, title: 'Guide Rail Deviation', timeRange: '12:02 - 12:08', equipment: 'Full Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'fcc-1h-6', status: 'running', durationMinutes: 18, title: 'Steady Can Conveying', timeRange: '12:08 - 12:26', equipment: 'Full Can Conveyor', avgSpeed: '1,850 cpm' },
        { id: 'fcc-1h-7', status: 'blocked', durationMinutes: 10, title: 'Packer KISTER Backup Jam (Blocked)', timeRange: '12:26 - 12:36', equipment: 'Full Can Conveyor', avgSpeed: '0 cpm' },
      ],
      '4hr': [
        { id: 'fcc-4h-1', status: 'running', durationMinutes: 160, title: 'Can Outfeed Conveying', timeRange: '08:30 - 11:10', equipment: 'Full Can Conveyor', avgSpeed: '1,820 cpm' },
        { id: 'fcc-4h-2', status: 'blocked', durationMinutes: 35, title: 'Severe Downstream Stoppage', timeRange: '11:10 - 11:45', equipment: 'Full Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'fcc-4h-3', status: 'running', durationMinutes: 45, title: 'Resumed Conveying', timeRange: '11:45 - 12:30', equipment: 'Full Can Conveyor', avgSpeed: '1,850 cpm' },
      ],
      'shift': [
        { id: 'fcc-sh-1', status: 'running', durationMinutes: 380, title: 'Normal Can Infeed/Outfeed', timeRange: '07:00 - 13:20', equipment: 'Full Can Conveyor', avgSpeed: '1,840 cpm' },
        { id: 'fcc-sh-2', status: 'blocked', durationMinutes: 60, title: 'Downstream Choke Lock', timeRange: '13:20 - 14:20', equipment: 'Full Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'fcc-sh-3', status: 'running', durationMinutes: 40, title: 'Cleared Production', timeRange: '14:20 - 15:00', equipment: 'Full Can Conveyor', avgSpeed: '1,800 cpm' },
      ],
      '24hr': [
        { id: 'fcc-24h-1', status: 'running', durationMinutes: 1200, title: 'Full Operation Hours', timeRange: 'Yesterday - Today', equipment: 'Full Can Conveyor', avgSpeed: '1,820 cpm' },
        { id: 'fcc-24h-2', status: 'blocked', durationMinutes: 180, title: 'Accumulated Blocked Hours', timeRange: 'Across Shifts', equipment: 'Full Can Conveyor', avgSpeed: '0 cpm' },
        { id: 'fcc-24h-3', status: 'planned-stop', durationMinutes: 60, title: 'Belt Tensioning Maintenance', timeRange: 'Yesterday 22:00 - 23:00', equipment: 'Full Can Conveyor' },
      ],
    },
  },

  // 6. Packer KISTER (Slow Run)
  {
    id: 'packer-kister',
    name: 'Packer KISTER',
    status: 'Slow Run',
    candybarHeight: 44,
    statusTag: {
      label: 'Slow Run',
      icon: 'schedule',
      variant: 'slow-run',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'pk-1h-1', status: 'planned-stop', durationMinutes: 18, title: 'Carton Loader Replenishment', timeRange: '11:19 - 11:37', equipment: 'Packer KISTER' },
        { id: 'pk-1h-2', status: 'fault', durationMinutes: 3, title: 'Glue Gun Temperature Dip', timeRange: '11:37 - 11:40', equipment: 'Packer KISTER', avgSpeed: '0 cpm' },
        { id: 'pk-1h-3', status: 'slow-running', durationMinutes: 16, title: 'Slow Box Folding Rate', timeRange: '11:40 - 11:56', equipment: 'Packer KISTER', avgSpeed: '980 cpm' },
        { id: 'pk-1h-4', status: 'blocked', durationMinutes: 4, title: 'Palletizer Conveyor Backlog', timeRange: '11:56 - 12:00', equipment: 'Packer KISTER', avgSpeed: '0 cpm' },
        { id: 'pk-1h-5', status: 'slow-running', durationMinutes: 10, title: 'Slow Case Erector Speed', timeRange: '12:00 - 12:10', equipment: 'Packer KISTER', avgSpeed: '1,050 cpm' },
        { id: 'pk-1h-6', status: 'fault', durationMinutes: 5, title: 'Packer Flap Jam', timeRange: '12:10 - 12:15', equipment: 'Packer KISTER', avgSpeed: '0 cpm', hasNote: true, operatorNote: { author: 'Carlos Ramos', initials: 'CR', text: 'Bent cardboard carton cleared from side compression arm.' } },
        { id: 'pk-1h-7', status: 'slow-running', durationMinutes: 2, title: 'Slow Re-indexing', timeRange: '12:15 - 12:17', equipment: 'Packer KISTER', avgSpeed: '750 cpm' },
        { id: 'pk-1h-8', status: 'fault', durationMinutes: 2, title: 'Safety Gate Sensor Tripped', timeRange: '12:17 - 12:19', equipment: 'Packer KISTER', avgSpeed: '0 cpm' },
        { id: 'pk-1h-9', status: 'slow-running', durationMinutes: 2, title: 'Warmup Cycle', timeRange: '12:19 - 12:21', equipment: 'Packer KISTER', avgSpeed: '820 cpm' },
        { id: 'pk-1h-10', status: 'running', durationMinutes: 15, title: 'Regular Case Packing', timeRange: '12:21 - 12:36', equipment: 'Packer KISTER', avgSpeed: '1,720 cpm' },
      ],
      '4hr': [
        { id: 'pk-4h-1', status: 'running', durationMinutes: 100, title: 'Packer Primary Run', timeRange: '08:30 - 10:10', equipment: 'Packer KISTER', avgSpeed: '1,750 cpm' },
        { id: 'pk-4h-2', status: 'slow-running', durationMinutes: 60, title: 'Glue Unit Throttling', timeRange: '10:10 - 11:10', equipment: 'Packer KISTER', avgSpeed: '1,100 cpm' },
        { id: 'pk-4h-3', status: 'fault', durationMinutes: 20, title: 'Infeed Jam Halt', timeRange: '11:10 - 11:30', equipment: 'Packer KISTER', avgSpeed: '0 cpm' },
        { id: 'pk-4h-4', status: 'running', durationMinutes: 60, title: 'High Speed Case Packing', timeRange: '11:30 - 12:30', equipment: 'Packer KISTER', avgSpeed: '1,780 cpm' },
      ],
      'shift': [
        { id: 'pk-sh-1', status: 'running', durationMinutes: 280, title: 'Shift 1 Packaging Run', timeRange: '07:00 - 11:40', equipment: 'Packer KISTER', avgSpeed: '1,760 cpm' },
        { id: 'pk-sh-2', status: 'slow-running', durationMinutes: 120, title: 'Reduced Case Throughput', timeRange: '11:40 - 13:40', equipment: 'Packer KISTER', avgSpeed: '1,200 cpm' },
        { id: 'pk-sh-3', status: 'running', durationMinutes: 80, title: 'Normal Shift Finish', timeRange: '13:40 - 15:00', equipment: 'Packer KISTER', avgSpeed: '1,740 cpm' },
      ],
      '24hr': [
        { id: 'pk-24h-1', status: 'running', durationMinutes: 1050, title: 'Total Case Packing Cycles', timeRange: 'Yesterday - Today', equipment: 'Packer KISTER', avgSpeed: '1,720 cpm' },
        { id: 'pk-24h-2', status: 'slow-running', durationMinutes: 240, title: 'Low Speed Carton Erecting', timeRange: 'Overnight Hours', equipment: 'Packer KISTER', avgSpeed: '1,150 cpm' },
        { id: 'pk-24h-3', status: 'fault', durationMinutes: 90, title: 'Cardboard Magazine Repair', timeRange: 'Shift 2 Interruption', equipment: 'Packer KISTER', avgSpeed: '0 cpm' },
        { id: 'pk-24h-4', status: 'planned-stop', durationMinutes: 60, title: 'Adhesive Tank Cleanout', timeRange: 'Shift Changeover', equipment: 'Packer KISTER' },
      ],
    },
  },

  // 7. Palletizer Rocombi 1 (Slow Run)
  {
    id: 'palletizer-rocombi-1',
    name: 'Palletizer Rocombi 1',
    status: 'Slow Run',
    candybarHeight: 44,
    statusTag: {
      label: 'Slow Run',
      icon: 'schedule',
      variant: 'slow-run',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'pr-1h-1', status: 'planned-stop', durationMinutes: 18, title: 'Wooden Pallet Magazine Reload', timeRange: '11:19 - 11:37', equipment: 'Palletizer Rocombi 1' },
        { id: 'pr-1h-2', status: 'fault', durationMinutes: 3, title: 'Gripper Arm Sensor Error', timeRange: '11:37 - 11:40', equipment: 'Palletizer Rocombi 1', avgSpeed: '0 cpm' },
        { id: 'pr-1h-3', status: 'slow-running', durationMinutes: 16, title: 'Tier Stacking Speed Limit', timeRange: '11:40 - 11:56', equipment: 'Palletizer Rocombi 1', avgSpeed: '950 cpm' },
        { id: 'pr-1h-4', status: 'blocked', durationMinutes: 4, title: 'Outfeed Turntable Blocked', timeRange: '11:56 - 12:00', equipment: 'Palletizer Rocombi 1', avgSpeed: '0 cpm' },
        { id: 'pr-1h-5', status: 'slow-running', durationMinutes: 10, title: 'Positioning Layer Push', timeRange: '12:00 - 12:10', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,000 cpm' },
        { id: 'pr-1h-6', status: 'fault', durationMinutes: 5, title: 'Slip Sheet Pick Error', timeRange: '12:10 - 12:15', equipment: 'Palletizer Rocombi 1', avgSpeed: '0 cpm' },
        { id: 'pr-1h-7', status: 'slow-running', durationMinutes: 2, title: 'Arm Homing Sequence', timeRange: '12:15 - 12:17', equipment: 'Palletizer Rocombi 1', avgSpeed: '700 cpm' },
        { id: 'pr-1h-8', status: 'fault', durationMinutes: 2, title: 'Interlock Warning Gate', timeRange: '12:17 - 12:19', equipment: 'Palletizer Rocombi 1', avgSpeed: '0 cpm' },
        { id: 'pr-1h-9', status: 'slow-running', durationMinutes: 2, title: 'Pallet Centering', timeRange: '12:19 - 12:21', equipment: 'Palletizer Rocombi 1', avgSpeed: '800 cpm' },
        { id: 'pr-1h-10', status: 'running', durationMinutes: 15, title: 'Full Speed Layer Stacking', timeRange: '12:21 - 12:36', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,700 cpm' },
      ],
      '4hr': [
        { id: 'pr-4h-1', status: 'running', durationMinutes: 120, title: 'Palletizing Cases', timeRange: '08:30 - 10:30', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,720 cpm' },
        { id: 'pr-4h-2', status: 'slow-running', durationMinutes: 50, title: 'Stack Height Limit Run', timeRange: '10:30 - 11:20', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,100 cpm' },
        { id: 'pr-4h-3', status: 'running', durationMinutes: 70, title: 'Nominal Stacking', timeRange: '11:20 - 12:30', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,750 cpm' },
      ],
      'shift': [
        { id: 'pr-sh-1', status: 'running', durationMinutes: 320, title: 'Shift 1 Stacking Output', timeRange: '07:00 - 12:20', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,740 cpm' },
        { id: 'pr-sh-2', status: 'slow-running', durationMinutes: 110, title: 'Pallet Discharge Throttled', timeRange: '12:20 - 14:10', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,150 cpm' },
        { id: 'pr-sh-3', status: 'running', durationMinutes: 50, title: 'Shift End Clean Run', timeRange: '14:10 - 15:00', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,720 cpm' },
      ],
      '24hr': [
        { id: 'pr-24h-1', status: 'running', durationMinutes: 1120, title: 'Total 24hr Case Palletizing', timeRange: 'Yesterday - Today', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,730 cpm' },
        { id: 'pr-24h-2', status: 'slow-running', durationMinutes: 200, title: 'Layer Stacking Adjustment Run', timeRange: 'Shift 3 Overnight', equipment: 'Palletizer Rocombi 1', avgSpeed: '1,100 cpm' },
        { id: 'pr-24h-3', status: 'planned-stop', durationMinutes: 120, title: 'Daily Roller Lubrication', timeRange: 'Maintenance Windows', equipment: 'Palletizer Rocombi 1' },
      ],
    },
  },

  // 8. Pallet Wrapper 1 (Not Running)
  {
    id: 'pallet-wrapper-1',
    name: 'Pallet Wrapper 1',
    status: 'Not Running',
    candybarHeight: 44,
    statusTag: {
      label: 'Not Running',
      icon: 'hourglass_disabled',
      variant: 'not-running',
    },
    timeframeSegments: {
      '1hr': [
        { id: 'pw-1h-1', status: 'not-running', durationMinutes: 60, title: 'Not Running — Standby Mode', timeRange: '11:19 - 12:36', equipment: 'Pallet Wrapper 1', avgSpeed: '0 cpm' },
      ],
      '4hr': [
        { id: 'pw-4h-1', status: 'not-running', durationMinutes: 240, title: 'Not Running — Standby Mode', timeRange: '08:30 - 12:30', equipment: 'Pallet Wrapper 1', avgSpeed: '0 cpm' },
      ],
      'shift': [
        { id: 'pw-sh-1', status: 'not-running', durationMinutes: 480, title: 'Not Running — Standby Mode', timeRange: '07:00 - 15:00', equipment: 'Pallet Wrapper 1', avgSpeed: '0 cpm' },
      ],
      '24hr': [
        { id: 'pw-24h-1', status: 'not-running', durationMinutes: 1440, title: 'Not Running — Standby Mode', timeRange: 'Past 24 Hours', equipment: 'Pallet Wrapper 1', avgSpeed: '0 cpm' },
      ],
    },
  },
];
