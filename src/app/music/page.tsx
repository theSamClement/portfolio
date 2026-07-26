'use client';

import { useEffect, useRef, useState } from 'react';
import { Oswald, Space_Grotesk } from 'next/font/google';
import styles from './music.module.css';

// Bold condensed display face for the KM-style accents (nav, headers, wordmark).
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

// Clean grotesque for all readable text (replaces Times) — character without noise.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// --- Demo sets: real SoundCloud performance sets ---
const SET_URL = 'https%3A%2F%2Fsoundcloud.com%2Fsamcclement%2Fperformance-set-1';
const SET2_URL = 'https%3A%2F%2Fsoundcloud.com%2Fsamcclement%2Fperformance-set-2-1';
function playerSrc(track: string): string {
  return (
    'https://w.soundcloud.com/player/?url=' +
    track +
    '&color=%23f2c14e&visual=true&show_artwork=true&auto_play=false' +
    '&show_user=true&hide_related=true&show_comments=false' +
    '&show_reposts=false&show_teaser=false'
  );
}
// Live demo sets (real SoundCloud performance sets).
const SETS = [
  {
    side: 'performance set 1',
    meta: 'Live set',
    track: SET_URL,
    tracks: [
      'Swedish House Mafia, The Weeknd, Moojo - Moth To A Flame (Moojo Remix)',
      'PLS&TY, Antdot, Sofiya Nzau - Your Love (Antdot Extended Remix) (Original Mix)',
      'Arash, HUGEL, Topic, Daecolm - I Adore You (Extended Mix)',
      'Marten Lou - My Love for You (Yebba’s Heartbreak)',
      'SVNTOS - Relax my eyes (remix)',
      'Adam Port, Monolink - Point Of No Return (Extended Mix)',
      'UNKLE, &ME, Keinemusik - Only You (&ME Remix)',
      'Magnus, JEWELS, YUMA., SOMMA, LE YORA - EVERYTHING IN ITS RIGHT PLACE (Original Mix)',
      '&ME, Rampa, Adam Port, Keinemusik, Sevdaliza - See You Again (Original Mix)',
      'Boys Noize, &ME, Rampa, Adam Port, Keinemusik, Vinson - Crazy For It (feat. Vinson)',
    ],
  },
  {
    side: 'performance set 2',
    meta: 'Live set',
    track: SET2_URL,
    tracks: [], // tracklist to come
  },
];

// --- Releases: pulled from Sam's Spotify artist page (640px cover art) ---
const IMG = 'https://i.scdn.co/image/ab67616d0000b273';
const ALBUM = 'https://open.spotify.com/album/';
const RELEASES = [
  { title: 'stargazing', year: '2026', id: '2cUo41zNS1CJuu5WEQzfCL', art: '7bafa2465e190b0d2ee1cecd' },
  { title: 'counting stars', year: '2026', id: '5gEiKKFMm6hOa90ukzwU4Z', art: 'bb1a61a7e66026d69dfa1394' },
  { title: 'lost', year: '2025', id: '5BzQXhHTXWnSs7Q7d8OjCZ', art: '291ff52a3c88bc6a59c3c750' },
  { title: 'stargirl interlude', year: '2026', id: '3PVaP0zeCBHUBFgS1QSluH', art: '59b98ad695401fe0d2403ed5' },
  { title: 'can i call you tonight?', year: '2026', id: '0K3BlVnmFfNDrdS9vR161k', art: '123f0f10d5b78c292cc72597' },
  { title: 'what you came for', year: '2025', id: '23NjHbRD2LFMeM3I9qtFOJ', art: 'd12df19c028cdc96429db421' },
  { title: 'cha cha', year: '2026', id: '6M3gdIcueb8G1tLiXFEybp', art: 'c38bceea176c9bcdad92dcda' },
  { title: 'ooouuu', year: '2025', id: '6g3SyDwtrL1Blx7qJgnFwF', art: '8fbb1eedc7d0b9a0594d8975' },
  { title: 'lanele', year: '2025', id: '4i6Es7XWZTYKgAm6HbRacT', art: 'dc8f97d72d64959461a8ad38' },
];

/**
 * Replicates the homepage's per-character "hop": wraps each non-space char in
 * <span class="char">; the hop animation comes from the shared global
 * `.char`/`.char:hover` rules. IFRAME/IMG/SCRIPT/STYLE subtrees are skipped.
 */
function applyCharEffect(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue;
    const parent = node.parentNode;
    if (!text || text.trim() === '' || !parent) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        fragment.appendChild(document.createTextNode(' '));
      } else {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i];
        fragment.appendChild(span);
      }
    }
    parent.replaceChild(fragment, node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    // Skip embeds/images and decorative (aria-hidden) text like the watermark.
    if (['SCRIPT', 'STYLE', 'IFRAME', 'IMG'].includes(el.tagName)) return;
    if (el.getAttribute('aria-hidden') === 'true') return;
    Array.from(el.childNodes).forEach(applyCharEffect);
  }
}

export default function MusicPage() {
  const [openSet, setOpenSet] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const w = window as unknown as { __musicCharEffectApplied?: boolean };
    if (w.__musicCharEffectApplied) return;
    const container = document.getElementById('music-page-container');
    if (container) {
      Array.from(container.childNodes).forEach(applyCharEffect);
      w.__musicCharEffectApplied = true;
    }
  }, []);

  // Tracklist pop-out: Escape closes it; focus moves to the close button on open.
  useEffect(() => {
    if (openSet === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSet(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openSet]);

  const active = openSet !== null ? SETS[openSet] : null;

  return (
    <main
      className={`${styles.root} ${oswald.variable} ${spaceGrotesk.variable}${
        openSet !== null ? ` ${styles.locked}` : ''
      }`}
    >
      <div id="music-page-container" className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.wordmark}>
            <span className={styles.wm}>Sam Clement</span>
          </div>
          <nav className={styles.nav}>
            <a className={styles.navSets} href="#sets">Demo Sets</a>
            <a className={styles.navRel} href="#releases">Releases</a>
            <a className={styles.navCon} href="#contact">Contact</a>
          </nav>
        </div>

        {/* ---------- DEMO SETS ---------- */}
        <section id="sets" className={`${styles.section} ${styles.sets}`}>
          <h2 className={styles.h}>Demo Sets</h2>
          {SETS.map((s, i) => (
            <article className={styles.mix} key={s.side}>
              <div className={styles.cap}>
                {s.tracks.length > 0 ? (
                  <button
                    type="button"
                    className={styles.side}
                    onClick={() => setOpenSet(i)}
                    aria-haspopup="dialog"
                  >
                    {s.side}
                  </button>
                ) : (
                  <span className={styles.side}>{s.side}</span>
                )}
                <span className={styles.meta}>{s.meta}</span>
              </div>
              <div className={styles.player}>
                <iframe
                  height={325}
                  scrolling="no"
                  allow="autoplay"
                  src={playerSrc(s.track)}
                  title={`${s.side} — Sam Clement`}
                />
              </div>
            </article>
          ))}
        </section>

        {/* ---------- RELEASES ---------- */}
        <section id="releases" className={`${styles.section} ${styles.releases}`}>
          <h2 className={styles.h}>Releases</h2>
          <div className={styles.grid}>
            {RELEASES.map((r) => (
              <a
                key={r.id}
                className={styles.release}
                href={`${ALBUM}${r.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.coverWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.cover} src={`${IMG}${r.art}`} alt={`${r.title} cover`} loading="lazy" />
                </div>
                <div className={styles.rtitle}>{r.title}</div>
                <div className={styles.rmeta}>{r.year} · Spotify ↗</div>
              </a>
            ))}
          </div>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section id="contact" className={`${styles.section} ${styles.contact}`}>
          <div className={styles.contactInner}>
            <div className={styles.watermark} aria-hidden="true">Contact</div>
            <div className={styles.cLines}>
              <div className={styles.cLine}>
                <span className={styles.cLabel}>For bookings &amp; demos —&nbsp;</span>
                <a className={styles.cLink} href="mailto:bookings@samcclement.com?subject=Booking%20%E2%80%94%20Sam%20Clement">
                  bookings@samcclement.com
                </a>
              </div>
              <div className={styles.socials}>
                <a href="https://open.spotify.com/artist/6yQhTFWEN9TzGLXna8STLP" target="_blank" rel="noopener noreferrer">Spotify</a>
                <a href="https://soundcloud.com/samcclement" target="_blank" rel="noopener noreferrer">SoundCloud</a>
                <a href="https://www.instagram.com/samcclement" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Sam Clement</span>
          <span>New York · 2026</span>
        </footer>
      </div>

      {active && (
        <div className={styles.backdrop} onClick={() => setOpenSet(null)}>
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.meta} tracklist`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sheetHead}>
              <span className={styles.sheetSide}>{active.side}</span>
              <span className={styles.sheetMeta}>{active.meta}</span>
              <button
                type="button"
                ref={closeRef}
                className={styles.sheetClose}
                onClick={() => setOpenSet(null)}
                aria-label="Close tracklist"
              >
                ×
              </button>
            </div>
            <ol className={styles.tracklist}>
              {active.tracks.map((t, idx) => (
                <li key={idx} className={styles.track}>
                  <span className={styles.ttitle}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </main>
  );
}
