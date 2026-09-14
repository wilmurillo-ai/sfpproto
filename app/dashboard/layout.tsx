import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Line Dashboard',
  description: 'Line Dashboard — real-time KPIs, timeline, equipment status, and production execution.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
