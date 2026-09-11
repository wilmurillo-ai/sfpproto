// ============================================================
// DUMMY DATA — SFP Prototype
// All data is static and for UI demonstration only
// ============================================================

// ---- Shared Types ----
export type StatusType = 'running' | 'planned' | 'changeover' | 'downtime' | 'idle';
export type TrendType = 'up' | 'down' | 'flat';

// ---- Shifts ----
export const shifts = ['Shift 1', 'Shift 2', 'Shift 3'];
export const lines  = ['Line A', 'Line B', 'Line C', 'Line D'];
export const currentShift = 'Shift 1';
export const currentLine  = 'Line A';
export const lastRefreshed = '4 min ago';
export const currentTime   = '10:50';

// ---- Dashboard KPIs ----
export const dashboardKPIs = [
  { id: 'efficiency', label: 'Efficiency',    value: 84,   unit: '%',   trend: 'up'   as TrendType, delta: '+2.1%' },
  { id: 'attainment', label: 'Attainment',    value: 91,   unit: '%',   trend: 'up'   as TrendType, delta: '+4.3%' },
  { id: 'rate',       label: 'Rate (units/h)', value: 312,  unit: 'u/h', trend: 'flat' as TrendType, delta: '0.0%' },
  { id: 'output',     label: 'Output',        value: 2480, unit: 'pcs', trend: 'up'   as TrendType, delta: '+120' },
  { id: 'downtime',   label: 'Downtime',      value: 22,   unit: 'min', trend: 'down' as TrendType, delta: '-8 min' },
  { id: 'waste',      label: 'Waste',         value: 1.4,  unit: '%',   trend: 'down' as TrendType, delta: '-0.3%' },
];

// ---- Schedule Blocks ----
export interface ScheduleBlock {
  id: string;
  label: string;
  status: StatusType;
  startHour: number; // 0-24
  endHour: number;
  product?: string;
}

export const scheduleBlocks: ScheduleBlock[] = [
  { id: 's1', label: 'SKU-A101',    status: 'running',    startHour: 6,  endHour: 9,   product: 'SKU-A101' },
  { id: 's2', label: 'Changeover',  status: 'changeover', startHour: 9,  endHour: 9.5, product: undefined  },
  { id: 's3', label: 'SKU-B204',    status: 'planned',    startHour: 9.5, endHour: 12, product: 'SKU-B204' },
  { id: 's4', label: 'Break',       status: 'idle',       startHour: 12, endHour: 12.5 },
  { id: 's5', label: 'SKU-C390',    status: 'planned',    startHour: 12.5, endHour: 15 },
  { id: 's6', label: 'Maintenance', status: 'downtime',   startHour: 15, endHour: 16  },
  { id: 's7', label: 'SKU-D118',    status: 'planned',    startHour: 16, endHour: 18  },
];

// ---- Summary ----
export interface SummaryRow {
  id: string;
  sku: string;
  description: string;
  planned: number;
  actual: number;
  attainment: number;
  status: 'on-track' | 'at-risk' | 'behind';
}

export const summaryRows: SummaryRow[] = [
  { id: 'r1', sku: 'SKU-A101', description: 'Widget Alpha',   planned: 800, actual: 812, attainment: 101.5, status: 'on-track' },
  { id: 'r2', sku: 'SKU-B204', description: 'Bracket Beta',   planned: 600, actual: 574, attainment: 95.7,  status: 'at-risk'  },
  { id: 'r3', sku: 'SKU-C390', description: 'Connector Gamma',planned: 400, actual: 380, attainment: 95.0,  status: 'at-risk'  },
  { id: 'r4', sku: 'SKU-D118', description: 'Plate Delta',    planned: 680, actual: 714, attainment: 105.0, status: 'on-track' },
  { id: 'r5', sku: 'SKU-E007', description: 'Module Epsilon', planned: 200, actual: 152, attainment: 76.0,  status: 'behind'   },
];

// ---- Downtimes ----
export interface DowntimeEvent {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  category: string;
  reason: string;
  equipment: string;
  responsible: string;
}

export const downtimeEvents: DowntimeEvent[] = [
  { id: 'd1', startTime: '06:14', endTime: '06:32', duration: 18, category: 'Mechanical', reason: 'Conveyor jam',           equipment: 'Conv-01', responsible: 'Maintenance' },
  { id: 'd2', startTime: '08:05', endTime: '08:09', duration: 4,  category: 'Quality',    reason: 'Inspection hold',        equipment: 'QC-A',    responsible: 'Quality'     },
  { id: 'd3', startTime: '09:00', endTime: '09:30', duration: 30, category: 'Changeover', reason: 'Product change SKU-A/B', equipment: 'Line',    responsible: 'Operator'    },
  { id: 'd4', startTime: '10:22', endTime: '10:25', duration: 3,  category: 'Material',   reason: 'Part shortage',          equipment: 'Feeder-2',responsible: 'Supply'      },
  { id: 'd5', startTime: '15:00', endTime: '16:00', duration: 60, category: 'Planned',    reason: 'Preventive maintenance', equipment: 'Press-A', responsible: 'Maintenance' },
];

// ---- Efficiency Trend ----
export interface EfficiencyPoint {
  hour: string;
  efficiency: number;
  target: number;
}

export const efficiencyTrend: EfficiencyPoint[] = [
  { hour: '06:00', efficiency: 78, target: 85 },
  { hour: '07:00', efficiency: 82, target: 85 },
  { hour: '08:00', efficiency: 88, target: 85 },
  { hour: '09:00', efficiency: 65, target: 85 },
  { hour: '10:00', efficiency: 84, target: 85 },
  { hour: '11:00', efficiency: 87, target: 85 },
  { hour: '12:00', efficiency: 83, target: 85 },
  { hour: '13:00', efficiency: 91, target: 85 },
  { hour: '14:00', efficiency: 89, target: 85 },
  { hour: '15:00', efficiency: 0,  target: 85 },
  { hour: '16:00', efficiency: 0,  target: 85 },
  { hour: '17:00', efficiency: 0,  target: 85 },
];

// ---- Attainment ----
export interface AttainmentRow {
  id: string;
  period: string;
  planned: number;
  actual: number;
  attainment: number;
}

export const attainmentData: AttainmentRow[] = [
  { id: 'a1', period: '06:00–07:00', planned: 320, actual: 295, attainment: 92.2 },
  { id: 'a2', period: '07:00–08:00', planned: 320, actual: 338, attainment: 105.6 },
  { id: 'a3', period: '08:00–09:00', planned: 320, actual: 329, attainment: 102.8 },
  { id: 'a4', period: '09:00–10:00', planned: 160, actual: 120, attainment: 75.0  },
  { id: 'a5', period: '10:00–11:00', planned: 320, actual: 305, attainment: 95.3  },
  { id: 'a6', period: '11:00–12:00', planned: 320, actual: 341, attainment: 106.6 },
];

// ---- Equipment ----
export interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'idle' | 'fault' | 'maintenance';
  oee: number;
  uptime: number; // percent
  lastFault?: string;
}

export const equipmentList: EquipmentItem[] = [
  { id: 'eq1', name: 'Press A',       type: 'Press',     status: 'running',     oee: 88, uptime: 96, },
  { id: 'eq2', name: 'Conveyor 01',   type: 'Conveyor',  status: 'running',     oee: 79, uptime: 91, lastFault: 'Jam – 06:14' },
  { id: 'eq3', name: 'Robot Arm R1',  type: 'Robot',     status: 'running',     oee: 93, uptime: 99, },
  { id: 'eq4', name: 'QC Station A',  type: 'QC',        status: 'idle',        oee: 72, uptime: 88, lastFault: 'Hold – 08:05' },
  { id: 'eq5', name: 'Feeder 2',      type: 'Feeder',    status: 'fault',       oee: 45, uptime: 68, lastFault: 'Part shortage – 10:22' },
  { id: 'eq6', name: 'Packing Line',  type: 'Assembly',  status: 'running',     oee: 85, uptime: 94, },
  { id: 'eq7', name: 'Press B',       type: 'Press',     status: 'maintenance', oee: 0,  uptime: 0,  lastFault: 'PM – 15:00' },
];

// ---- Rate Loss ----
export interface RateLossItem {
  id: string;
  category: string;
  minutes: number;
  units: number;
  percent: number;
  color: string;
}

export const rateLossItems: RateLossItem[] = [
  { id: 'rl1', category: 'Downtime',         minutes: 85, units: 442, percent: 48, color: '#dc2626' },
  { id: 'rl2', category: 'Speed Loss',       minutes: 42, units: 218, percent: 24, color: '#d97706' },
  { id: 'rl3', category: 'Minor Stops',      minutes: 28, units: 146, percent: 16, color: '#f59e0b' },
  { id: 'rl4', category: 'Changeover',       minutes: 18, units: 94,  percent: 10, color: '#2563eb' },
  { id: 'rl5', category: 'Startup Losses',   minutes: 4,  units: 21,  percent: 2,  color: '#6366f1' },
];

// ---- Waste ----
export interface WasteItem {
  id: string;
  category: string;
  quantity: number;
  unit: string;
  cost: number;
  percent: number;
  color: string;
}

export const wasteItems: WasteItem[] = [
  { id: 'w1', category: 'Scrap Parts',       quantity: 48,  unit: 'pcs', cost: 1440, percent: 40, color: '#dc2626' },
  { id: 'w2', category: 'Rework',            quantity: 32,  unit: 'pcs', cost: 640,  percent: 27, color: '#d97706' },
  { id: 'w3', category: 'Material Overuse',  quantity: 18,  unit: 'kg',  cost: 360,  percent: 15, color: '#f59e0b' },
  { id: 'w4', category: 'Packaging Waste',   quantity: 12,  unit: 'pcs', cost: 180,  percent: 10, color: '#2563eb' },
  { id: 'w5', category: 'Overproduction',    quantity: 8,   unit: 'pcs', cost: 240,  percent: 8,  color: '#6366f1' },
];
