'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@/components/ui';

export type EquipmentStatus = 'Running' | 'Slow Run' | 'Available' | 'Down';

export interface EquipmentItem {
  id: string;
  name: string;
  status: EquipmentStatus;
  isMainLine?: boolean;
}

export interface EquipmentGroup {
  id: string;
  title?: string;
  items: EquipmentItem[];
}

export interface SidebarEquipmentProps {
  className?: string;
  /** Explicitly force state, or leave 'auto' to respond to 1180px breakpoint */
  state?: 'auto' | 'collapsed' | 'expanded';
  /** Line name / main equipment title (defaults to 'CAN G4') */
  lineName?: string;
  /** Overall line status (defaults to 'Running') */
  lineStatus?: EquipmentStatus;
  /** Custom equipment groups or items */
  groups?: EquipmentGroup[];
  /** Currently selected equipment id */
  selectedId?: string;
  /** Callback when an equipment item is clicked */
  onSelectEquipment?: (item: EquipmentItem) => void;
  /** Callback when the Equipment Monitor button is clicked */
  onMonitorClick?: () => void;
  /** Callback when state is toggled manually */
  onToggleState?: (nextState: 'collapsed' | 'expanded') => void;
  /** Allow clicking collapsed pill or collapse icon to toggle state */
  allowManualToggle?: boolean;
  /** Show top header (e.g. Line Equipment Status with close button) for tablet drawer */
  showHeader?: boolean;
  /** Title for the top header */
  headerTitle?: string;
  /** Callback when close button is clicked in header */
  onClose?: () => void;
}

export const DEFAULT_EQUIPMENT_GROUPS: EquipmentGroup[] = [
  {
    id: 'processing',
    title: 'Processing',
    items: [
      { id: 'depalletizer', name: 'Depalletizer', status: 'Running' },
      { id: 'empty-can-conveyor', name: 'Empty can conveyor', status: 'Running' },
      { id: 'seamer', name: 'Seamer', status: 'Running' },
      { id: 'caps-feeder', name: 'Caps feeder', status: 'Slow Run' },
      { id: 'filler', name: 'Filler', status: 'Running' },
      { id: 'paesturizer', name: 'Paesturizer', status: 'Slow Run' },
      { id: 'paesturizer-conveyor', name: 'Paesturizer conveyor', status: 'Running' },
      { id: 'full-can-conveyor', name: 'Full can conveyor', status: 'Running' },
    ],
  },
  {
    id: 'packaging',
    title: 'Packaging',
    items: [
      { id: 'packer-kister', name: 'Packer KISTER', status: 'Slow Run' },
      { id: 'packer-vega-1', name: 'Packer Vega 1', status: 'Running' },
      { id: 'packer-vega-2', name: 'Packer Vega 2', status: 'Available' },
      { id: 'packer-wr', name: 'Packer WR', status: 'Available' },
      { id: 'case-conveyor', name: 'Case Conveyor', status: 'Running' },
    ],
  },
  {
    id: 'palletizing',
    title: 'Palletizing & End of Line',
    items: [
      { id: 'palletizer-1-rocombi', name: 'Palletizer 1 Rocombi', status: 'Running' },
      { id: 'palletizer-2-pegasus', name: 'Palletizer 2 PEGASUS', status: 'Running' },
      { id: 'pallet-wrapper-1', name: 'Pallet Wrapper 1', status: 'Running' },
      { id: 'pallet-wrapper-2', name: 'Pallet Wrapper 2', status: 'Available' },
    ],
  },
];

export default function SidebarEquipment({
  className = '',
  state = 'auto',
  lineName = 'CAN G4',
  lineStatus = 'Running',
  groups = DEFAULT_EQUIPMENT_GROUPS,
  selectedId: controlledSelectedId,
  onSelectEquipment,
  onMonitorClick,
  onToggleState,
  allowManualToggle = true,
  showHeader = false,
  headerTitle = 'Line Equipment Status',
  onClose,
}: SidebarEquipmentProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string>('line-main');
  const [isClient, setIsClient] = useState(false);
  const [isScreenCollapsed, setIsScreenCollapsed] = useState(false);
  const [manualOverride, setManualOverride] = useState<'collapsed' | 'expanded' | null>(null);

  // Active selected id
  const activeSelectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  // Track 1180px screen resolution breakpoint
  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(max-width: 1179.98px)');

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsScreenCollapsed(e.matches);
      // Reset manual override on window resize across breakpoint
      setManualOverride(null);
    };

    setIsScreenCollapsed(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, []);

  // Determine current effective state:
  // 1. Explicit prop ('collapsed' | 'expanded')
  // 2. Manual toggle override (if user clicked to toggle)
  // 3. Screen breakpoint (<1180px -> collapsed, >=1180px -> expanded)
  const effectiveState: 'collapsed' | 'expanded' = useMemo(() => {
    if (state !== 'auto') {
      return state;
    }
    if (manualOverride !== null) {
      return manualOverride;
    }
    if (!isClient) {
      // Default to expanded for SSR, or responsive via CSS classes
      return 'expanded';
    }
    return isScreenCollapsed ? 'collapsed' : 'expanded';
  }, [state, manualOverride, isClient, isScreenCollapsed]);

  const handleToggle = () => {
    if (!allowManualToggle) return;
    const next = effectiveState === 'collapsed' ? 'expanded' : 'collapsed';
    setManualOverride(next);
    onToggleState?.(next);
  };

  const handleItemClick = (item: EquipmentItem) => {
    setInternalSelectedId(item.id);
    onSelectEquipment?.(item);
  };

  const handleMainLineClick = () => {
    const mainItem: EquipmentItem = {
      id: 'line-main',
      name: lineName,
      status: lineStatus,
      isMainLine: true,
    };
    setInternalSelectedId('line-main');
    onSelectEquipment?.(mainItem);
  };

  // Helper for status badge rendering
  const renderStatusTag = (status: EquipmentStatus, isCompact = false) => {
    switch (status) {
      case 'Running':
        return (
          <span className={`sidebar-equipment-tag is-running ${isCompact ? 'is-compact' : ''}`}>
            <Icon name="play_arrow" size="small" className="sidebar-equipment-tag-icon" />
            <span className="sidebar-equipment-tag-text">Running</span>
          </span>
        );
      case 'Slow Run':
        return (
          <span className={`sidebar-equipment-tag is-slow-run ${isCompact ? 'is-compact' : ''}`}>
            <Icon name="timelapse" size="small" className="sidebar-equipment-tag-icon" />
            <span className="sidebar-equipment-tag-text">Slow Run</span>
          </span>
        );
      case 'Available':
        return (
          <span className={`sidebar-equipment-tag is-available ${isCompact ? 'is-compact' : ''}`}>
            <Icon name="check_circle" size="small" className="sidebar-equipment-tag-icon" />
            <span className="sidebar-equipment-tag-text">Available</span>
          </span>
        );
      case 'Down':
      default:
        return (
          <span className={`sidebar-equipment-tag is-down ${isCompact ? 'is-compact' : ''}`}>
            <Icon name="error_outline" size="small" className="sidebar-equipment-tag-icon" />
            <span className="sidebar-equipment-tag-text">Down</span>
          </span>
        );
    }
  };

  /* =========================================================================
     COLLAPSED STATE (for screen resolutions < 1180px)
     ========================================================================= */
  if (effectiveState === 'collapsed') {
    return (
      <aside
        className={`sidebar-equipment-collapsed-root ${className}`.trim()}
        data-node-id="12622:209516"
        data-name="sidebar-equipment / collapsed"
      >
        <button
          type="button"
          className="sidebar-equipment-pill-btn"
          onClick={handleToggle}
          title={allowManualToggle ? 'Click to expand equipment sidebar' : undefined}
          aria-expanded={false}
          aria-label={`${lineName} equipment list, currently ${lineStatus}`}
        >
          {/* Menu / Hamburger Icon */}
          <div className="sidebar-equipment-pill-icon">
            <Icon name="menu" size="medium" />
          </div>

          {/* Line Title */}
          <span className="sidebar-equipment-pill-title">{lineName}</span>

          {/* Solid Green Active Tag */}
          <div className="sidebar-equipment-pill-badge">
            <Icon name="play_arrow" size="small" />
            <span>{lineStatus}</span>
          </div>
        </button>
      </aside>
    );
  }

  /* =========================================================================
     EXPANDED STATE (for screen resolutions >= 1180px)
     ========================================================================= */
  return (
    <aside
      className={`sidebar-equipment-expanded-root ${showHeader ? 'has-drawer-header' : ''} ${className}`.trim()}
      data-node-id="12622:209307"
      data-name="sidebar-equipment / expanded"
    >
      {/* Optional Drawer Header for Tablet (Figma Node 10535:92036) */}
      {showHeader && (
        <div className="sidebar-equipment-drawer-header">
          <span className="sidebar-equipment-drawer-title">{headerTitle}</span>
          {onClose && (
            <button
              type="button"
              className="sidebar-equipment-drawer-close-btn"
              onClick={onClose}
              aria-label="Close equipment sidebar"
            >
              <Icon name="close" size="medium" />
            </button>
          )}
        </div>
      )}

      {/* Scrollable list of equipment groups */}
      <div className="sidebar-equipment-scroll-area">
        {/* Top Primary Line Header Item (e.g. CAN G4) */}
        <div className="sidebar-equipment-group primary-group">
          <div
            className={`sidebar-equipment-item is-main-line ${
              activeSelectedId === 'line-main' ? 'is-selected' : ''
            }`}
            onClick={handleMainLineClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleMainLineClick()}
          >
            <span className="sidebar-equipment-item-title is-main-title" title={lineName}>
              {lineName}
            </span>

            <div className="sidebar-equipment-item-right">
              {/* Solid Green Tag for Main Line */}
              <div className="sidebar-equipment-pill-badge is-solid">
                <Icon name="play_arrow" size="small" />
                <span>{lineStatus}</span>
              </div>

              <div className="sidebar-equipment-item-chevron">
                <Icon name="chevron_right" size="small" />
              </div>
            </div>
          </div>

          {/* Group 1 equipment items */}
          {groups[0]?.items.map((item) => {
            const isSelected = activeSelectedId === item.id;
            return (
              <div
                key={item.id}
                className={`sidebar-equipment-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleItemClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item)}
              >
                <span className="sidebar-equipment-item-title" title={item.name}>
                  {item.name}
                </span>

                <div className="sidebar-equipment-item-right">
                  {renderStatusTag(item.status)}
                  <div className="sidebar-equipment-item-chevron">
                    <Icon name="chevron_right" size="small" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subsequent Equipment Groups (Packaging, Palletizing, etc.) */}
        {groups.slice(1).map((group) => (
          <div key={group.id} className="sidebar-equipment-group">
            {group.items.map((item) => {
              const isSelected = activeSelectedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`sidebar-equipment-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item)}
                >
                  <span className="sidebar-equipment-item-title" title={item.name}>
                    {item.name}
                  </span>

                  <div className="sidebar-equipment-item-right">
                    {renderStatusTag(item.status)}
                    <div className="sidebar-equipment-item-chevron">
                      <Icon name="chevron_right" size="small" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Action Footer: Equipment Monitor */}
      <div className="sidebar-equipment-footer">
        <button
          type="button"
          className="sidebar-equipment-monitor-btn"
          onClick={onMonitorClick}
        >
          <span className="sidebar-equipment-monitor-text">Equipment Monitor</span>
          <Icon name="insert_chart" size="medium" className="sidebar-equipment-monitor-icon" />
        </button>
      </div>
    </aside>
  );
}
