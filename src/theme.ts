/**
 * Colour-scheme preference, mirroring the app's Appearance setting:
 * follow the system, or pin light or dark.
 *
 * The resolved scheme is written to `data-theme` on <html>. `styles.css` keys
 * off that attribute, and falls back to `prefers-color-scheme` only when the
 * visitor has expressed no preference — so the two mechanisms can never
 * disagree (the app repo hit exactly that bug; see its TODO.md D7).
 *
 * `index.html` carries an inline copy of `apply()` that runs before first
 * paint, so a dark-mode visitor never sees a flash of light chrome.
 */

export type Scheme = 'system' | 'light' | 'dark';

export const STORAGE_KEY = 'moodpixels-theme';

export const SCHEMES: Scheme[] = ['system', 'light', 'dark'];

/** Reads the stored preference. Returns 'system' when unset or unreadable. */
export function stored(): Scheme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    // Private mode, or storage blocked entirely. The default is still correct.
    return 'system';
  }
}

/** Applies a preference to the document and persists it. */
export function apply(scheme: Scheme): void {
  const root = document.documentElement;
  if (scheme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', scheme);

  try {
    if (scheme === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    // Persisting is a nicety; the current page is already themed correctly.
  }
}
