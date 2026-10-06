'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui';

export interface TVMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TVMonitorModal({ isOpen, onClose }: TVMonitorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="tv-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-modal-title"
    >
      <div className="tv-modal-container" ref={modalRef} data-node-id="29193:14821">
        {/* Header with Title and Close Button */}
        <div className="tv-modal-header" data-node-id="29193:15284">
          <div className="tv-modal-title-group" data-node-id="29193:15087">
            <div className="tv-modal-title-row" data-node-id="29193:17722">
              <Icon name="screen_share" size="large" className="tv-modal-icon" />
              <h2 id="tv-modal-title" className="tv-modal-title" data-node-id="29193:15088">
                TV Monitor
              </h2>
            </div>
            <p className="tv-modal-subtitle" data-node-id="29193:15089">
              Select the visualization type
            </p>
          </div>

          <button
            type="button"
            className="tv-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal window"
            data-node-id="29193:15285"
            title="Close"
          >
            <Icon name="close" size="medium" />
          </button>
        </div>

        {/* Action Selection Options */}
        <div className="tv-modal-options" data-node-id="29193:14834">
          {/* Live Plant Status -> /tv/plant */}
          <Link
            href="/tv/plant"
            className="tv-modal-option-btn"
            id="tv-modal-plant-btn"
            data-node-id="29193:14839"
            onClick={onClose}
          >
            <span className="tv-modal-option-label" data-node-id="29193:15745">
              Live Plant Status
            </span>
            <Icon name="chevron_right" size="large" className="tv-modal-chevron" />
          </Link>

          {/* Live Line Monitor -> /tv/line */}
          <Link
            href="/tv/line"
            className="tv-modal-option-btn"
            id="tv-modal-line-btn"
            data-node-id="29193:17713"
            onClick={onClose}
          >
            <span className="tv-modal-option-label" data-node-id="29193:17714">
              Live Line Monitor
            </span>
            <Icon name="chevron_right" size="large" className="tv-modal-chevron" />
          </Link>
        </div>
      </div>
    </div>
  );
}
