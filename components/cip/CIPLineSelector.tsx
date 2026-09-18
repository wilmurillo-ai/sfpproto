'use client';

import React, { useRef } from 'react';
import { Icon } from '@/components/ui';
import { CIPLine, CIP_LINES } from './mockData';

interface CIPLineSelectorProps {
  selectedLines: CIPLine[];
  onChange: (lines: CIPLine[]) => void;
}

export default function CIPLineSelector({ selectedLines, onChange }: CIPLineSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -100 : 100, behavior: 'smooth' });
  };

  const toggleLine = (line: CIPLine) => {
    if (selectedLines.includes(line)) {
      // Don't allow deselecting all lines if only 1 is left, or allow toggle
      const next = selectedLines.filter((l) => l !== line);
      onChange(next);
    } else {
      onChange([...selectedLines, line]);
    }
  };

  return (
    <div className="cip-line-selector" role="group" aria-label="CIP Line Selection">
      {/* Left scroll / prev arrow */}
      <button
        type="button"
        className="cip-line-nav-btn"
        onClick={() => scroll('left')}
        aria-label="Previous lines"
      >
        <Icon name="chevron_left" size="medium" />
      </button>

      {/* Chip list */}
      <div ref={scrollRef} className="cip-line-chips">
        {CIP_LINES.map((line) => {
          const isSelected = selectedLines.includes(line);

          return (
            <button
              key={line}
              type="button"
              className={`cip-line-chip ${isSelected ? 'is-selected' : ''}`}
              onClick={() => toggleLine(line)}
              aria-pressed={isSelected}
            >
              {line}
            </button>
          );
        })}
      </div>

      {/* Right scroll / next arrow */}
      <button
        type="button"
        className="cip-line-nav-btn"
        onClick={() => scroll('right')}
        aria-label="Next lines"
      >
        <Icon name="chevron_right" size="medium" />
      </button>
    </div>
  );
}
