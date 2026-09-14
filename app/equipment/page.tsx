'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EquipmentMonitor } from '@/components';

export default function EquipmentPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/dashboard');
  };

  return (
    <div className="page-content" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <h2>Equipment Monitor</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          The Equipment Monitor view is displayed as a fullscreen modal window.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'var(--color-interactive-primary, #0662c4)',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Open Equipment Monitor
        </button>
      </div>

      {/* Fullscreen Equipment Monitor Modal */}
      <EquipmentMonitor
        isOpen={isOpen}
        onClose={handleClose}
        lineName="CAN 01"
      />
    </div>
  );
}
