import React from 'react';

export type IconSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: IconSize;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

const sizeMap: Record<IconSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
  'extra-large': 48,
};

export default function Icon({
  name,
  size = 'large',
  color,
  className = '',
  style = {},
  alt,
  ...props
}: IconProps) {
  const pixelSize = sizeMap[size] || 24;

  const combinedStyle: React.CSSProperties = {
    fontSize: `${pixelSize}px`,
    width: `${pixelSize}px`,
    height: `${pixelSize}px`,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    verticalAlign: 'middle',
    color: color || 'inherit',
    ...style,
  };

  return (
    <span
      className={`material-icons-outlined gds-icon ${className}`.trim()}
      style={combinedStyle}
      role="img"
      aria-label={alt || name}
      {...props}
    >
      {name}
    </span>
  );
}
