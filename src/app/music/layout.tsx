import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sam Clement — Music',
  description: 'Press kit — mixes, bookings. Melodic, afro, deep & tech house. New York.',
};

// Pass-through layout: sets route metadata without wrapping the page in any
// extra DOM (the fixed-overlay page must remain a direct child of <body>).
export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
