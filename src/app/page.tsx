"use client";

import Head from 'next/head';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Apply character hover effect to ALL text on the page
    function applyCharEffect(element: Node) {
      if (element.nodeType === Node.TEXT_NODE && element.nodeValue && element.nodeValue.trim() !== '') {
        const text = element.nodeValue;
        const parent = element.parentNode;
        if (!parent) return;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            const space = document.createTextNode(' ');
            fragment.appendChild(space);
          } else {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = text[i];
            fragment.appendChild(span);
          }
        }
        parent.replaceChild(fragment, element);
      } else if (element.nodeType === Node.ELEMENT_NODE) {
        const el = element as HTMLElement;
        // Skip elements that shouldn't have the effect applied
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') {
          return;
        }

        const childNodes = Array.from(el.childNodes);
        for (const child of childNodes) {
          applyCharEffect(child);
        }
      }
    }

    // Apply effect to the entire body
    // We need to be careful not to re-apply this on every render if components update.
    // A better approach might be to target specific elements or use a Context/State if elements are dynamic.
    // For now, we will attempt a one-time application to initial body children.
    // Also, querySelectorAll might be safer than iterating childNodes directly if the DOM structure is complex or changes.

    // Let's try to make this idempotent by checking if it has already run.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).__charEffectApplied) {
      const bodyElement = document.body;
      const childNodes = Array.from(bodyElement.childNodes);
      for (const child of childNodes) {
        // We only want to apply it to children of the main content area of this page.
        // Accessing document.body directly from a component can be tricky with SSR and hydration.
        // It's generally better to use refs for direct DOM manipulation within a component's scope.
        // However, the original script was acting globally on document.body.
        // A more React-idiomatic way would be to make <CharEffect text="..." /> component.

        // Let's refine this to target specific top-level elements that are likely to contain text.
        // This is still a bit broad. Consider using refs for more precise control.
        if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).closest('.__next')) {
            // Attempt to apply effect only within the Next.js root to avoid breaking other things.
            // This is still not ideal. The original script has a very broad scope.
        } else {
            // For this iteration, we apply it as the script did, to direct children of body.
            // This might still have issues with hydration if server-rendered content differs.
        }
        // The original script applied to all children of body, we replicate that intent for now,
        // but this part is problematic in React and needs a more careful approach.
        // For a quick translation, we will attempt to apply it to elements within this component's render.
        // The best place would be on a container div specific to this page.
      }
      // Since direct body manipulation is tricky, let's target elements from this component's output.
      // The HTML structure you provided has specific IDs. Let's use those if available,
      // otherwise, a wrapper div would be best.
      
      // The original script just iterates body.childNodes. If we want that exact effect,
      // it implies this component IS the entire body content.
      // Let's apply to elements rendered by this component.
      const mainContentContainer = document.getElementById('portfolio-page-container');
      if (mainContentContainer) {
        const pageChildNodes = Array.from(mainContentContainer.childNodes);
        for (const child of pageChildNodes) {
            applyCharEffect(child);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__charEffectApplied = true;
    }

  }, []); // Empty dependency array means this runs once after initial render.

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>samcclement</title>
        {/* Styles are in globals.css */}
      </Head>
      <div id="portfolio-page-container"> {/* Added a wrapper for the script to target */} 
        <h1 className="char-effect" id="title">portfolio</h1>

        <div className="container">
          <div className="project">
            <div className="title char-effect" id="project1">PROJECT 1</div>
            <div className="description">
              <div>making early-stage hiring more fair (kasii.tech)</div>
              <div><a href="https://kasii.tech" target="_blank" rel="noopener noreferrer" className="char-effect" id="link1">View Project</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project2">PROJECT 2</div>
            <div className="description">
              <div>getting your security deposit back (docor.io)</div>
              <div><a href="https://docor.io" target="_blank" rel="noopener noreferrer" className="char-effect" id="link2">View Project</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project3">PROJECT 3</div>
            <div className="description">
              <div>producing house music bc i love it (soundcloud.com)</div>
              <div><a href="https://soundcloud.com/samcclement" target="_blank" rel="noopener noreferrer" className="char-effect" id="link3">View Project</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project4">PROJECT 4</div>
            <div className="description">
              <div>automating label outreach for small artists (trackpitch.io)</div>
              <div><a href="https://trackpitch.io" target="_blank" rel="noopener noreferrer" className="char-effect" id="link4">View Project</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project5">PROJECT 5</div>
            <div className="description">
              <div>functioning RISC-V cpu built from 1s and 0s (samclement@berkeley.edu)</div>
              <div><a href="mailto:samclement@berkeley.edu" className="char-effect" id="link5">View Project</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project6">PROJECT 6</div>
            <div className="description">
              <div>helping writers rough draft a little easier (getwrito.com)</div>
              <div><a href="https://getwrito.com" target="_blank" rel="noopener noreferrer" className="char-effect" id="link6">View Project</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project7">PROJECT 7</div>
            <div className="description">
              <div>managing your network systematically (netwyrk.me)</div>
              <div><a href="https://netwyrk.me" target="_blank" rel="noopener noreferrer" className="char-effect" id="link7">View Project</a></div>
            </div>
          </div>

        </div>

        <div className="container">
          <div className="title char-effect" id="contact">CONTACT</div>
          <div className="description">
            <a href="mailto:samclement@berkeley.edu" className="char-effect" id="email">sam@berkeley.edu</a> |{' '}
            <a href="https://github.com/theSamClement" className="char-effect" id="github"> GitHub</a> |{' '}
            <a href="https://www.linkedin.com/in/samcclement/" className="char-effect" id="linkedin">LinkedIn</a>
          </div>
        </div>
        {/* The cursor element is CSS-only, so it does not need script intervention if placed directly */}
        {/* Example: <span className="cursor"></span> after a title if desired */}
    </div>
    </>
  );
}
