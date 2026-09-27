/**
 * FAQ content, shared by the page and the prerenderer.
 *
 * The prerenderer emits these as FAQPage structured data, so Google can show
 * them as expandable rich results. Schema.org requires the answer text to match
 * what a visitor actually sees, which is why there is one source, not two.
 */
export const FAQ: [string, string][] = [
  [
    'Is it free?',
    'Yes. MoodPixels is free during the Android preview, with no ads, no subscription, and no paid tier today.',
  ],
  [
    'Do I need an account?',
    'No. There is no sign-up, no password, and no profile on a server. Install it and your first check-in takes a couple of seconds.',
  ],
  [
    'Where is my journal stored?',
    'In a SQLite database on your own device. It is not synced anywhere and it is not readable by us, because we never receive it.',
  ],
  [
    'Can I log more than one mood a day?',
    'Yes, and that is rather the point. Log as many as apply and order them by what dominated — the first becomes the day’s primary color.',
  ],
  [
    'Does it work offline?',
    'Completely. The only things that need a connection are downloading the app, receiving app updates, and emailing support.',
  ],
  [
    'How do I move to a new phone?',
    'Export a backup from Settings → Backup, move the file across however you like, then import it on the new device. Use a passphrase if the file will pass through cloud storage on the way.',
  ],
  [
    'What if I forget my backup passphrase?',
    'That file cannot be recovered — not by you and not by us. The passphrase is never stored or transmitted, which is precisely what makes the encryption worth anything. Keep it in a password manager.',
  ],
  [
    'Is this a therapy or mental-health app?',
    'No. MoodPixels is a personal reflection tool for adults aged 18 and over. It does not diagnose, treat, or provide crisis support, and its insights describe what you logged — they are not medical advice.',
  ],
  [
    'Is there an iPhone version?',
    'Not yet. The preview is Android-only, and an iOS build is not currently scheduled.',
  ],
];
