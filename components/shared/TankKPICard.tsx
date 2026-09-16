'use client';

import React from 'react';
import { Icon } from '@/components/ui';

export type TankAccentVariant = 'green' | 'yellow' | 'red';

export interface TankKPICardProps {
  /** Unique id */
  id?: string;
  /** Tank identifier (e.g. 'Tank-01') */
  tankId?: string;
  /** Name of the chemical or liquid (e.g. 'Hot Water', 'Rinse', 'Acid', 'Caustic') */
  title: string;
  /** Percentage fill level (e.g. 81, 77, 15) */
  level: number;
  /** Color variant: 'green' (default), 'yellow', or 'red' */
  variant?: TankAccentVariant;
  /** Current temperature string or number (e.g. 80 or '80°C') */
  temperature: string | number;
  /** Minimum temperature threshold (e.g. '75ºC min') */
  minTemp?: string;
  /** Maximum temperature threshold (e.g. '81ºC max') */
  maxTemp?: string;
  /** Conductivity value (e.g. '78.53m S/Cm') */
  conductivity?: string;
  /** Minimum conductivity requirement (e.g. 'min: 78.53m S/Cm') */
  minConductivity?: string;
  /** Optional alert message with warning */
  alertMessage?: string;
  /** Additional CSS class */
  className?: string;
}

export default function TankKPICard({
  id,
  tankId = 'Tank-01',
  title,
  level,
  variant = 'green',
  temperature,
  minTemp = '75ºC min',
  maxTemp = '81ºC max',
  conductivity = '78.53m S/Cm',
  minConductivity = 'min: 78.53m S/Cm',
  alertMessage,
  className = '',
}: TankKPICardProps) {
  // Format temperature string
  const formattedTemp =
    typeof temperature === 'number'
      ? `${temperature}°C`
      : temperature.includes('°')
      ? temperature
      : `${temperature}°C`;

  // Clamp level 0 - 100
  const clampedLevel = Math.max(0, Math.min(100, level));

  return (
    <div
      id={id}
      className={`tank-kpi-card variant-${variant} ${className}`.trim()}
      role="region"
      aria-label={`${tankId} ${title}: ${level}% full, ${formattedTemp}, conductivity ${conductivity}`}
    >
      {/* 24px Vertical Tank Column on Left */}
      <div className="tank-vertical-column" aria-hidden="true">
        <div className="tank-vertical-track">
          <div
            className="tank-vertical-fill"
            style={{ height: `${clampedLevel}%` }}
          />
        </div>
      </div>

      {/* Tank Information Body */}
      <div className="tank-kpi-body">
        {/* Top Row: Tank ID, Title, Level % on left; Temperature on right */}
        <div className="tank-kpi-row-top">
          <div className="tank-kpi-ident-group">
            <div className="tank-kpi-tank-id">{tankId}</div>
            <div className="tank-kpi-title-level">
              <h3 className="tank-kpi-title">{title}</h3>
              <span className="tank-kpi-level-percent">{level}%</span>
            </div>
          </div>

          <div className="tank-kpi-temp-display">
            <span className="tank-kpi-temp-number">{formattedTemp}</span>
            <Icon
              name="device_thermostat"
              size="medium"
              className="tank-kpi-thermostat-icon"
            />
          </div>
        </div>

        {/* Optional Alert notice if provided */}
        {alertMessage && (
          <div className="tank-kpi-alert-pill">
            <Icon name="warning" size="small" className="tank-kpi-alert-icon" />
            <span>{alertMessage}</span>
          </div>
        )}

        {/* Bottom Row: Conductivity on left; Min / Max Limits on right */}
        <div className="tank-kpi-row-bottom">
          <div className="tank-kpi-cond-group">
            <span className="tank-kpi-cond-val">{conductivity}</span>
            <span className="tank-kpi-cond-sub">{minConductivity}</span>
          </div>

          <div className="tank-kpi-limits-group">
            <span className="tank-kpi-limit-item">{minTemp}</span>
            <span className="tank-kpi-limit-item">{maxTemp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
