"use client";

import Head from 'next/head';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
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
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') {
          return;
        }

        const childNodes = Array.from(el.childNodes);
        for (const child of childNodes) {
          applyCharEffect(child);
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).__charEffectApplied) {
      const bodyElement = document.body;
      const childNodes = Array.from(bodyElement.childNodes);
      for (const child of childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).closest('.__next')) {
        } else {
        }
      }
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

  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>samcclement</title>
      </Head>
      <div id="portfolio-page-container">
        <h1 className="char-effect" id="title">portfolio</h1>

        <div className="container">
          <div className="project">
            <div className="title char-effect" id="project1">PROJECT 1</div>
            <div className="description">
              <div className="project-description-text">making early-stage hiring more fair <a href="https://kasii.tech" target="_blank" rel="noopener noreferrer" className="char-effect">(kasii.tech)</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project2">PROJECT 2</div>
            <div className="description">
              <div className="project-description-text">getting your security deposit back <a href="https://docor.io" target="_blank" rel="noopener noreferrer" className="char-effect">(docor.io)</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project3">PROJECT 3</div>
            <div className="description">
              <div className="project-description-text">producing house music bc i love it <a href="https://soundcloud.com/samcclement" target="_blank" rel="noopener noreferrer" className="char-effect">(soundcloud.com)</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project4">PROJECT 4</div>
            <div className="description">
              <div className="project-description-text">automating label outreach for small but passionate artists <a href="https://trackpitch.io" target="_blank" rel="noopener noreferrer" className="char-effect">(trackpitch.io)</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project5">PROJECT 5</div>
            <div className="description">
              <div className="project-description-text">functioning RISC-V cpu built from 1s and 0s <a href="mailto:samclement@berkeley.edu" className="char-effect">(samclement@berkeley.edu)</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project6">PROJECT 6</div>
            <div className="description">
              <div className="project-description-text">helping writers rough draft a little easier <a href="https://getwrito.com" target="_blank" rel="noopener noreferrer" className="char-effect">(getwrito.com)</a></div>
            </div>
          </div>

          <div className="project">
            <div className="title char-effect" id="project7">PROJECT 7</div>
            <div className="description">
              <div className="project-description-text">managing your network systematically <a href="https://netwyrk.me" target="_blank" rel="noopener noreferrer" className="char-effect">(netwyrk.me)</a></div>
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
      </div>
    </>
  );
}
