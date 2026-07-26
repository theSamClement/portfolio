/**
 * Tests for the /music press-kit route (Keinemusik-inspired redesign).
 * Verifies the 3-section structure (Demo Sets / Releases / Contact), the
 * SoundCloud players, the Spotify releases catalog, contact links, and that the
 * page reuses the homepage's EXACT global `.char` hop effect.
 */
import { render, screen, fireEvent } from '@testing-library/react'
import MusicPage from '@/app/music/page'

beforeEach(() => {
  ;(window as unknown as { __musicCharEffectApplied?: boolean }).__musicCharEffectApplied = undefined
})

const flat = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()

const RELEASE_TITLES = [
  'stargazing',
  'counting stars',
  'lost',
  'stargirl interlude',
  'can i call you tonight?',
  'what you came for',
  'cha cha',
  'ooouuu',
  'lanele',
]

describe('music page — structure & content', () => {
  it('renders the wordmark, role, and the three section headers', () => {
    const { container } = render(<MusicPage />)
    const whole = flat(container)
    for (const phrase of ['Sam Clement', 'New York', 'Demo Sets', 'Releases', 'Contact']) {
      expect(whole).toContain(phrase)
    }
    // Demo Sets and Releases use <h2> headers; Contact's title is the big faded
    // watermark (KM-style), so only two <h2>s exist.
    const headers = Array.from(container.querySelectorAll('h2')).map(flat)
    expect(headers).toEqual(['Demo Sets', 'Releases'])
    // Contact's watermark carries its title text.
    expect(flat(container.querySelector('#contact'))).toContain('Contact')
  })

  it('does NOT use an <h1> (which would inherit the global heading rule)', () => {
    const { container } = render(<MusicPage />)
    expect(container.querySelector('h1')).toBeNull()
  })

  it('has right-hand nav anchoring to the three sections, Demo Sets first', () => {
    const { container } = render(<MusicPage />)
    const nav = container.querySelector('nav')
    expect(nav).not.toBeNull()
    const anchors = Array.from(nav!.querySelectorAll('a'))
    expect(anchors.map((a) => a.getAttribute('href'))).toEqual(['#sets', '#releases', '#contact'])
    expect(flat(anchors[0])).toBe('Demo Sets')
    // sections exist with those ids
    expect(container.querySelector('section#sets')).not.toBeNull()
    expect(container.querySelector('section#releases')).not.toBeNull()
    expect(container.querySelector('section#contact')).not.toBeNull()
  })
})

describe('music page — demo sets (SoundCloud)', () => {
  it('embeds two visual SoundCloud players (the real performance sets) under #sets', () => {
    const { container } = render(<MusicPage />)
    const frames = container.querySelectorAll('#sets iframe')
    expect(frames.length).toBe(2)
    frames.forEach((f) => {
      const src = f.getAttribute('src') || ''
      expect(src).toContain('w.soundcloud.com/player')
      expect(src).toContain('visual=true')
    })
    const allSrc = Array.from(frames)
      .map((f) => f.getAttribute('src'))
      .join(' ')
    expect(allSrc).toContain('performance-set-1')
    expect(allSrc).toContain('performance-set-2-1')
  })
})

describe('music page — releases catalog (Spotify)', () => {
  it('renders all nine releases with cover art and album links', () => {
    const { container } = render(<MusicPage />)
    const links = Array.from(container.querySelectorAll('#releases a[href^="https://open.spotify.com/album/"]'))
    expect(links.length).toBe(9)

    const whole = flat(container.querySelector('#releases'))
    for (const t of RELEASE_TITLES) expect(whole).toContain(t)

    // every release has a cover image + descriptive alt; the source is either the
    // Spotify CDN (5) or a locally hosted, text-free original under /covers (4).
    const imgs = Array.from(container.querySelectorAll('#releases img'))
    expect(imgs.length).toBe(9)
    imgs.forEach((img) => {
      expect(img.getAttribute('src') || '').toMatch(/^(https:\/\/i\.scdn\.co\/image\/ab67616d0000b273|\/covers\/)/)
      expect(img.getAttribute('alt') || '').toContain('cover')
    })

    // the four covers that previously had baked-in title text are now the clean
    // local versions (lost / what you came for / ooouuu / lanele).
    const srcs = imgs.map((img) => img.getAttribute('src') || '')
    expect(srcs.filter((s) => s.startsWith('/covers/'))).toHaveLength(4)
    expect(srcs.filter((s) => s.includes('i.scdn.co'))).toHaveLength(5)
    expect(srcs).toEqual(
      expect.arrayContaining([
        '/covers/lost.jpg',
        '/covers/whatyoucamefor.jpg',
        '/covers/ooouuu.jpg',
        '/covers/lanele.jpg',
      ]),
    )
  })
})

describe('music page — contact links', () => {
  it('wires booking email and socials correctly', () => {
    const { container } = render(<MusicPage />)
    const href = (sel: string) => container.querySelector(sel)?.getAttribute('href')
    expect(href('a[href^="mailto:bookings@samcclement.com"]')).toMatch(/^mailto:bookings@samcclement\.com/)
    expect(href('a[href="https://open.spotify.com/artist/6yQhTFWEN9TzGLXna8STLP"]')).toBeTruthy()
    expect(href('a[href="https://soundcloud.com/samcclement"]')).toBeTruthy()
    expect(href('a[href="https://www.instagram.com/samcclement"]')).toBeTruthy()
  })

  it('opens external links safely (rel=noopener)', () => {
    const { container } = render(<MusicPage />)
    container
      .querySelectorAll('a[target="_blank"]')
      .forEach((a) => expect(a.getAttribute('rel') || '').toContain('noopener'))
  })
})

describe('music page — reuses the homepage "hop" effect verbatim', () => {
  it('wraps text in the GLOBAL .char class', () => {
    const { container } = render(<MusicPage />)
    const chars = container.querySelectorAll('span.char')
    expect(chars.length).toBeGreaterThan(50)
    chars.forEach((c) => {
      expect(c.className).toBe('char')
      expect(c.textContent?.length).toBe(1)
    })
  })

  it('never rewrites text inside iframes or images', () => {
    const { container } = render(<MusicPage />)
    container.querySelectorAll('iframe, img').forEach((el) => {
      expect(el.querySelector('span.char')).toBeNull()
    })
  })
})

describe('music page — tracklist pop-out', () => {
  const triggers = (c: HTMLElement) =>
    Array.from(c.querySelectorAll('#sets button[aria-haspopup="dialog"]'))

  it('puts a trigger on each set title and shows no dialog by default', () => {
    const { container } = render(<MusicPage />)
    expect(triggers(container)).toHaveLength(2)
    // both sets have tracklists now; their labels are the triggers
    expect((triggers(container)[0].textContent || '').replace(/\s+/g, '')).toBe('performanceset1')
    expect((triggers(container)[1].textContent || '').replace(/\s+/g, '')).toBe('performanceset2')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the tracklist dialog with the set label, meta and tracks when clicked', () => {
    const { container } = render(<MusicPage />)
    fireEvent.click(triggers(container)[0])
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog.textContent).toContain('performance set 1')
    expect(dialog.textContent).toContain('Live set')
    expect(dialog.textContent).toContain('Moth To A Flame') // a real setlist track
    expect(dialog.querySelectorAll('ol li')).toHaveLength(10) // full 10-track setlist
  })

  it('opens set 2 tracklist (11 tracks) when its label is clicked', () => {
    const { container } = render(<MusicPage />)
    fireEvent.click(triggers(container)[1])
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('performance set 2')
    expect(dialog.textContent).toContain('Summertime Sadness')
    expect(dialog.querySelectorAll('ol li')).toHaveLength(11)
  })

  it('closes on the close button and on Escape', () => {
    const { container } = render(<MusicPage />)

    fireEvent.click(triggers(container)[0])
    fireEvent.click(screen.getByRole('button', { name: /close tracklist/i }))
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(triggers(container)[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
