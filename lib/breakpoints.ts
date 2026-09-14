'use client';

import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktopSm: 1024,
  desktop: 1180, // Key breakpoint: < 1180 is Tablet, >= 1180 is Desktop
  desktopLg: 1440,
  desktopXl: 1920,
} as const;

export type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'desktopLg' | 'desktopXl';

export interface BreakpointState {
  width: number;
  isMobile: boolean;
  isTablet: boolean;       // width < 1180
  isDesktop: boolean;      // width >= 1180
  isDesktopLg: boolean;    // width >= 1440
  currentBreakpoint: BreakpointKey;
  isHydrated: boolean;
}

export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isDesktopLg: false,
    currentBreakpoint: 'desktop',
    isHydrated: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const isMobile = w < BREAKPOINTS.tablet;
      const isTablet = w < BREAKPOINTS.desktop;
      const isDesktop = w >= BREAKPOINTS.desktop;
      const isDesktopLg = w >= BREAKPOINTS.desktopLg;

      let currentBreakpoint: BreakpointKey = 'desktop';
      if (w < BREAKPOINTS.mobile) currentBreakpoint = 'mobile';
      else if (w < BREAKPOINTS.desktop) currentBreakpoint = 'tablet';
      else if (w < BREAKPOINTS.desktopLg) currentBreakpoint = 'desktop';
      else if (w < BREAKPOINTS.desktopXl) currentBreakpoint = 'desktopLg';
      else currentBreakpoint = 'desktopXl';

      setState({
        width: w,
        isMobile,
        isTablet,
        isDesktop,
        isDesktopLg,
        currentBreakpoint,
        isHydrated: true,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}
