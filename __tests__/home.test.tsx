/**
 * REGRESSION LOCK for the portfolio homepage (Sam's resume).
 *
 * Purpose: guarantee that adding the /music press-kit route never alters the
 * homepage's content, links, or its signature per-character "hop" effect.
 * If any of these break, the resume changed — fail loudly.
 */
import { render } from '@testing-library/react'
import HomePage from '@/app/page'

// The char effect sets a one-time global guard; reset it so every test re-runs it.
beforeEach(() => {
  ;(window as unknown as { __charEffectApplied?: boolean }).__charEffectApplied = undefined
})

// Normalize whitespace for text assertions (the effect re-emits spaces as text nodes).
const flat = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()

const PROJECTS: Array<[string, string, string, string]> = [
  ['project1', 'making early-stage hiring more fair', '(kasii.tech)', 'https://kasii.tech'],
  ['project2', 'getting your security deposit back', '(docor.io)', 'https://docor.io'],
  ['project3', 'producing house music when i have a minute', '(soundcloud.com)', 'https://soundcloud.com/samcclement'],
  ['project4', 'automating label outreach for small artists', '(trackpitch.io)', 'https://trackpitch.io'],
  ['project5', 'functioning RISC-V cpu built from 1s and 0s', '(samclement@berkeley.edu)', 'mailto:samclement@berkeley.edu'],
  ['project6', 'helping writers rough draft a little easier', '(getwrito.com)', 'https://getwrito.com'],
  ['project7', 'managing your network systematically', '(netwyrk.me)', 'https://netwyrk.me'],
]

describe('homepage — structure & content', () => {
  it('renders the "portfolio" title', () => {
    const { container } = render(<HomePage />)
    const title = container.querySelector('#title')
    expect(title).not.toBeNull()
    expect(flat(title)).toBe('portfolio')
  })

  it('renders all 7 projects with exact copy and links', () => {
    const { container } = render(<HomePage />)
    const whole = flat(container)
    for (const [id, desc, linkText, href] of PROJECTS) {
      // project label present
      expect(flat(container.querySelector(`#${id}`))).toBe(`PROJECT ${id.slice(-1)}`)
      // description copy present verbatim
      expect(whole).toContain(desc)
      expect(whole).toContain(linkText)
      // link exists with the correct destination and visible label
      const anchor = container.querySelector(`a[href="${href}"]`)
      expect(anchor).toBeTruthy()
      expect(flat(anchor)).toBe(linkText)
    }
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
      ...PROJECTS.map((p) => p[3]),
      'mailto:samclement@berkeley.edu',
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
    // The page has hundreds of letters; a healthy wrap is well over 100.
    expect(chars.length).toBeGreaterThan(100)
    // Each .char holds exactly one visible character.
    chars.forEach((c) => expect(c.textContent?.length).toBe(1))
  })

  it('preserves spacing so words stay legible (title + contact)', () => {
    const { container } = render(<HomePage />)
    // If spaces were dropped, these would collapse to "BUYMEANAMERICANO?" etc.
    expect(flat(container.querySelector('#contact'))).toBe('BUY ME AN AMERICANO?')
    expect(flat(container.querySelector('#project3'))).toBe('PROJECT 3')
  })

  it('does not run the effect twice (idempotency guard honored)', () => {
    ;(window as unknown as { __charEffectApplied?: boolean }).__charEffectApplied = true
    const { container } = render(<HomePage />)
    // Guard already set -> effect skipped -> no char spans created.
    expect(container.querySelectorAll('span.char').length).toBe(0)
    // ...but the raw copy is still intact.
    expect(flat(container.querySelector('#title'))).toBe('portfolio')
  })
})

describe('homepage — full DOM snapshot (byte-for-byte structure lock)', () => {
  it('matches the committed snapshot', () => {
    const { container } = render(<HomePage />)
    expect(container.querySelector('#portfolio-page-container')).toMatchSnapshot()
  })
})
