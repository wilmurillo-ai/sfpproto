'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui';

export type ModalWindowSize = 'fullscreen' | 'large' | 'medium' | 'small' | 'custom';

export interface ModalWindowProps {
  /** Controls open/closed visibility */
  isOpen: boolean;
  /** Callback triggered when close button, escape key, or backdrop is clicked */
  onClose: () => void;
  /** Primary title of the modal (defaults to 'Modal Title') */
  title?: React.ReactNode;
  /** Optional subtitle next to title (e.g. 'Modal Subtitle') */
  subtitle?: React.ReactNode;
  /** Material Symbols icon name or custom ReactNode (defaults to 'wb_sunny') */
  icon?: string | React.ReactNode;
  /** Modal size: 'fullscreen' (default), 'large', 'medium', 'small', 'custom' */
  size?: ModalWindowSize;
  /** Custom width for size="custom" */
  width?: string | number;
  /** Custom height for size="custom" */
  height?: string | number;
  /** Custom max-width */
  maxWidth?: string | number;
  /** Custom max-height */
  maxHeight?: string | number;
  /** Modal body content */
  children?: React.ReactNode;
  /** Optional footer component */
  footer?: React.ReactNode;
  /** Additional container CSS class */
  className?: string;
  /** Additional content area CSS class */
  contentClassName?: string;
  /** Close on Escape key press (default: true) */
  closeOnEsc?: boolean;
  /** Close when clicking on backdrop overlay (default: true) */
  closeOnBackdropClick?: boolean;
  /** Whether to show the close button in header (default: true) */
  showCloseButton?: boolean;
  /** Custom header right actions before or replacing close button */
  headerActions?: React.ReactNode;
  /** Disable body scroll when open (default: true) */
  preventScroll?: boolean;
}

export default function ModalWindow({
  isOpen,
  onClose,
  title = 'Modal Title',
  subtitle = 'Modal Subtitle',
  icon = 'wb_sunny',
  size = 'fullscreen',
  width,
  height,
  maxWidth,
  maxHeight,
  children,
  footer,
  className = '',
  contentClassName = '',
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  headerActions,
  preventScroll = true,
}: ModalWindowProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (!isOpen || !preventScroll || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, preventScroll]);

  if (!isOpen || !mounted || typeof document === 'undefined') {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const customStyle: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(maxWidth !== undefined ? { maxWidth } : {}),
    ...(maxHeight !== undefined ? { maxHeight } : {}),
  };

  return createPortal(
    <div
      className="modal-window-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={`modal-window-container size-${size} ${className}`.trim()}
        style={customStyle}
        onClick={(e) => e.stopPropagation()}
        data-node-id="12630:550691"
        data-name="modal"
      >
        {/* Top Header (Breadcrumb container) */}
        <header
          className="modal-window-header"
          data-node-id="12630:550692"
          data-name="breadcrumb container"
        >
          {/* Left Title & Icon Section */}
          <div className="modal-window-header-left">
            <div className="modal-window-header-title-group">
              {icon && (
                <div className="modal-window-icon" data-name="factory">
                  {typeof icon === 'string' ? (
                    <Icon name={icon} size="large" />
                  ) : (
                    icon
                  )}
                </div>
              )}

              <div className="modal-window-titles">
                <h3 className="modal-window-title">{title}</h3>
                {subtitle && <span className="modal-window-subtitle">{subtitle}</span>}
              </div>
            </div>
          </div>

          {/* Right Section: Header Actions & Close Button */}
          <div className="modal-window-header-right">
            {headerActions}

            {showCloseButton && (
              <button
                type="button"
                className="modal-window-close-btn"
                onClick={onClose}
                aria-label="Close modal window"
                data-name="Navigation/close"
              >
                <Icon name="close" size="large" />
              </button>
            )}
          </div>
        </header>

        {/* Modal Main Content Area */}
        <div
          className={`modal-window-content ${contentClassName}`.trim()}
          data-node-id="12630:550693"
        >
          {children}
        </div>

        {/* Optional Modal Footer */}
        {footer && <footer className="modal-window-footer">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}

// Alias for matching lowercase component naming request
export { ModalWindow as modalWindow };
