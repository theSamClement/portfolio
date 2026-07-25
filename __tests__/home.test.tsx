/**
 * REGRESSION LOCK for the portfolio homepage (Sam's resume).
 *
 * Locks the CURRENT homepage: title, the four projects (in order), their exact
 * copy + link destinations, the contact block, the per-character "hop" effect,
 * and a full DOM snapshot. If a future change alters any of this, it fails loudly.
 */
import { render } from '@testing-library/react'
import HomePage from '@/app/page'

// The char effect sets a one-time global guard; reset it so every test re-runs it.
beforeEach(() => {
  ;(window as unknown as { __charEffectApplied?: boolean }).__charEffectApplied = undefined
})

// Normalize whitespace for text assertions (the effect re-emits spaces as text nodes).
const flat = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()

// [ id, description copy, link label, href ]
const PROJECTS: Array<[string, string, string, string]> = [
  ['project1', 'making early-stage hiring more fair', '(kasii.tech)', 'https://kasii.tech'],
  ['project2', 'producing house music when i have a minute', '(music site)', '/music'],
  ['project3', 'automating label outreach for small artists', '(trackpitch.io)', 'https://trackpitch.io'],
  [
    'project4',
    'market making for early stage sports entertainment companies',
    '(samclement@berkeley.edu)',
    'mailto:samclement@berkeley.edu',
  ],
]

describe('homepage — structure & content', () => {
  it('renders the "portfolio" title', () => {
    const { container } = render(<HomePage />)
    const title = container.querySelector('#title')
    expect(title).not.toBeNull()
    expect(flat(title)).toBe('portfolio')
  })

  it('renders exactly four projects, in order', () => {
    const { container } = render(<HomePage />)
    const labels = Array.from(container.querySelectorAll('.project .title')).map(flat)
    expect(labels).toEqual(['PROJECT 1', 'PROJECT 2', 'PROJECT 3', 'PROJECT 4'])
  })

  it('renders each project with exact copy and the correct link', () => {
    const { container } = render(<HomePage />)
    const whole = flat(container)
    for (const [id, desc, linkText, href] of PROJECTS) {
      const title = container.querySelector(`#${id}`)
      expect(flat(title)).toBe(`PROJECT ${id.slice(-1)}`)
      expect(whole).toContain(desc)
      expect(whole).toContain(linkText)
      // scope the link lookup to this project's block (hrefs can repeat elsewhere)
      const anchor = title!.closest('.project')!.querySelector('a')
      expect(anchor).toBeTruthy()
      expect(anchor!.getAttribute('href')).toBe(href)
      expect(flat(anchor)).toBe(linkText)
    }
  })

  it('the music bullet points internally at /music (not SoundCloud)', () => {
    const { container } = render(<HomePage />)
    const musicLink = container.querySelector('#project2')!.closest('.project')!.querySelector('a')
    expect(musicLink!.getAttribute('href')).toBe('/music')
    // internal link: no new-tab target so it navigates in place
    expect(musicLink!.getAttribute('target')).toBeNull()
    // the old SoundCloud destination is gone from the whole page
    expect(container.querySelector('a[href*="soundcloud.com"]')).toBeNull()
  })

  it('has removed the deleted projects (docor, RISC-V, getwrito, netwyrk)', () => {
    const { container } = render(<HomePage />)
    const whole = flat(container)
    for (const gone of ['docor.io', 'getwrito.com', 'netwyrk.me', 'RISC-V', 'security deposit']) {
      expect(whole).not.toContain(gone)
    }
    expect(container.querySelector('#project5')).toBeNull()
  })

  it('renders the contact block with exact copy and social links', () => {
    const { container } = render(<HomePage />)
    expect(flat(container.querySelector('#contact'))).toBe('BUY ME AN AMERICANO?')

    const byHref = (href: string) =>
      Array.from(container.querySelectorAll('a')).find((a) => a.getAttribute('href') === href)

    expect(byHref('mailto:samclement@berkeley.edu')).toBeTruthy()
    expect(byHref('https://github.com/theSamClement')).toBeTruthy()
    expect(byHref('https://www.linkedin.com/in/samcclement/')).toBeTruthy()
  })

  it('has exactly the expected set of outbound links (no more, no fewer)', () => {
    const { container } = render(<HomePage />)
    const hrefs = Array.from(container.querySelectorAll('a'))
      .map((a) => a.getAttribute('href'))
      .sort()
    const expected = [
      ...PROJECTS.map((p) => p[3]), // includes project4's mailto
      'mailto:samclement@berkeley.edu', // contact block mailto (duplicate is expected)
      'https://github.com/theSamClement',
      'https://www.linkedin.com/in/samcclement/',
    ].sort()
    expect(hrefs).toEqual(expected)
  })
})

describe('homepage — the per-character "hop" effect', () => {
  it('wraps non-space characters in <span class="char"> after mount', () => {
    const { container } = render(<HomePage />)
    const chars = container.querySelectorAll('span.char')
    expect(chars.length).toBeGreaterThan(100)
    chars.forEach((c) => expect(c.textContent?.length).toBe(1))
  })

  it('preserves spacing so words stay legible (title + contact)', () => {
    const { container } = render(<HomePage />)
    expect(flat(container.querySelector('#contact'))).toBe('BUY ME AN AMERICANO?')
    expect(flat(container.querySelector('#project3'))).toBe('PROJECT 3')
  })

  it('does not run the effect twice (idempotency guard honored)', () => {
    ;(window as unknown as { __charEffectApplied?: boolean }).__charEffectApplied = true
    const { container } = render(<HomePage />)
    expect(container.querySelectorAll('span.char').length).toBe(0)
    expect(flat(container.querySelector('#title'))).toBe('portfolio')
  })
})

describe('homepage — full DOM snapshot (byte-for-byte structure lock)', () => {
  it('matches the committed snapshot', () => {
    const { container } = render(<HomePage />)
    expect(container.querySelector('#portfolio-page-container')).toMatchSnapshot()
  })
})
