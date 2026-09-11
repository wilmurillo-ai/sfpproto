'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    iconName: 'dashboard',
  },
  {
    href: '/schedule',
    label: 'Schedule',
    iconName: 'calendar_today',
  },
  {
    href: '/summary',
    label: 'Summary',
    iconName: 'analytics',
  },
  {
    href: '/downtimes',
    label: 'Downtimes',
    iconName: 'error_outline',
  },
  {
    href: '/efficiency',
    label: 'Efficiency',
    iconName: 'speed',
  },
  {
    href: '/attainment',
    label: 'Attainment',
    iconName: 'bar_chart',
  },
  {
    href: '/equipment',
    label: 'Equipment',
    iconName: 'precision_manufacturing',
  },
  {
    href: '/rateloss',
    label: 'Rate Loss',
    iconName: 'trending_down',
  },
  {
    href: '/waste',
    label: 'Waste',
    iconName: 'delete_outline',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">S</div>
        <span className="sidebar-logo-text">SFP</span>
      </div>

      {/* Nav */}
      <p className="sidebar-section-label">Operator View</p>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${isActive ? ' active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="nav-icon">
                <Icon name={item.iconName} size="medium" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="header-avatar" style={{ width: 28, height: 28, fontSize: '10px' }}>OP</div>
        <div>
          <p style={{ fontSize: 'var(--font-size-paragraph-small)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Operator</p>
          <p style={{ fontSize: 'var(--font-size-paragraph-xs)', color: 'var(--color-text-secondary)' }}>Line A · Shift 1</p>
        </div>
      </div>
    </aside>
  );
}
