import type { ReactNode } from 'react';
import { AlertTriangle, ArrowUpRight, LifeBuoy, Mail } from 'lucide-react';
import { androidPreview, jurisdiction, lastUpdated, owner, supportEmail } from './site';

/** Shared chrome for the long-form pages: title block, table of contents, prose column. */
function Document({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro: ReactNode;
  sections: { id: string; heading: string }[];
  children: ReactNode;
}) {
  return (
    <main id="main-content" className="doc">
      <header className="doc-hero">
        <div className="shell">
          <p className="pill">
            <span className="tiny-pixel" aria-hidden="true" /> Last updated {lastUpdated}
          </p>
          <h1>{title}</h1>
          <div className="lede">{intro}</div>
        </div>
      </header>
      <div className="shell doc-main">
        <div className="doc-layout">
          <nav className="doc-toc" aria-label="On this page">
            <span className="footer-heading">On this page</span>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="doc-body">{children}</article>
        </div>
      </div>
    </main>
  );
}

function Section({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section id={id} className="doc-section">
      <h2>{heading}</h2>
      {children}
    </section>
  );
}

const Mailto = () => <a href={`mailto:${supportEmail}`}>{supportEmail}</a>;

// ─── Privacy Policy ──────────────────────────────────────────────────────────

const PRIVACY_SECTIONS = [
  { id: 'summary', heading: 'The short version' },
  { id: 'controller', heading: 'Who is responsible' },
  { id: 'on-device', heading: 'What stays on your device' },
  { id: 'not-collected', heading: 'What we do not collect' },
  { id: 'backups', heading: 'Backups you create' },
  { id: 'third-parties', heading: 'Updates, testing, and third parties' },
  { id: 'permissions', heading: 'Device permissions' },
  { id: 'website', heading: 'This website' },
  { id: 'legal-bases', heading: 'Legal bases for processing' },
  { id: 'rights', heading: 'Your rights and choices' },
  { id: 'retention', heading: 'Retention' },
  { id: 'security', heading: 'Security' },
  { id: 'children', heading: 'Age requirement' },
  { id: 'changes', heading: 'Changes to this policy' },
  { id: 'contact', heading: 'Contact and grievances' },
];

export function Privacy() {
  return (
    <Document
      title="Privacy Policy"
      intro={
        <p>
          MoodPixels is built so that your mood journal never leaves your device. This policy explains the
          small amount of information that is involved anyway — when you install the app, receive an
          update, create a backup, or visit this website.
        </p>
      }
      sections={PRIVACY_SECTIONS}
    >
      <Section id="summary" heading="The short version">
        <ul className="doc-summary">
          <li>
            <strong>Your journal stays on your phone.</strong> Moods, notes, custom mood definitions, and
            settings live in a local database. We never receive them.
          </li>
          <li>
            <strong>There is no account.</strong> No sign-up, no password, no profile on a server.
          </li>
          <li>
            <strong>There is no analytics, advertising, or tracking SDK</strong> in the app, and none on
            this website.
          </li>
          <li>
            <strong>We do not sell, rent, or share personal data</strong> — we do not hold any to sell.
          </li>
          <li>
            <strong>Backups are yours.</strong> You choose whether to make one, whether to encrypt it, and
            where it goes.
          </li>
        </ul>
        <p className="doc-note">
          This summary is provided for convenience. The sections below are the operative terms.
        </p>
      </Section>

      <Section id="controller" heading="Who is responsible">
        <p>
          MoodPixels is an independent app operated by {owner}, based in {jurisdiction}. For the purposes of
          the EU and UK General Data Protection Regulation, {owner} is the data controller for the limited
          processing described here. Under India’s Digital Personal Data Protection Act, 2023, {owner} acts
          as the data fiduciary.
        </p>
        <p>
          You can reach us for any privacy question, request, or complaint at <Mailto />.
        </p>
      </Section>

      <Section id="on-device" heading="What stays on your device">
        <p>
          The following are created by you and stored locally in an app-private SQLite database. They are
          not transmitted to us or to anyone else, and they are removed when you uninstall the app or clear
          its data:
        </p>
        <ul>
          <li>Mood entries: the date, the moods you logged, and the order you put them in.</li>
          <li>Notes you attach to a day.</li>
          <li>
            Mood definitions: labels, colors, faces, sort order, and which built-in moods you have edited or
            archived.
          </li>
          <li>Your profile face and the accent color derived from it.</li>
          <li>
            Preferences: theme, week start, reminder time, backup reminder, and whether the app lock is on.
          </li>
        </ul>
        <p>
          Because there is no cloud journal, there is no server-side copy of any of this for us to access,
          disclose, or be compelled to produce.
        </p>
      </Section>

      <Section id="not-collected" heading="What we do not collect">
        <p>To be unambiguous, MoodPixels does not:</p>
        <ul>
          <li>collect your name, email address, or phone number in the app;</li>
          <li>include an analytics, telemetry, attribution, or crash-reporting SDK;</li>
          <li>display advertising or embed advertising identifiers;</li>
          <li>track you across other apps or websites;</li>
          <li>read your contacts, location, calendar, photos, or files; or</li>
          <li>sell, rent, or trade personal data.</li>
        </ul>
        <p>
          The app makes no network requests to any server operated by us, because we operate no such server.
          Every core feature — logging, notes, statistics, and browsing your history — works with the device
          offline.
        </p>
      </Section>

      <Section id="backups" heading="Backups you create">
        <p>
          You can export your journal as a JSON file. Exporting is always something you initiate; the app
          never backs up on its own or in the background.
        </p>
        <p>
          When you set a passphrase, the file is encrypted on your device before it is written: the key is
          derived with PBKDF2-SHA256 at 100,000 iterations using a random salt, the contents are encrypted
          with AES-256 in CBC mode, and an HMAC-SHA256 tag is stored so tampering is detected on import. The
          passphrase itself is never stored, never transmitted, and never recoverable — if you lose it, that
          backup is permanently unreadable, including by us.
        </p>
        <p>
          You choose the destination through your device’s share sheet. Once the file leaves the app, it is
          governed by whatever service or storage you send it to, and that provider’s own privacy practices
          apply. An unencrypted backup is plain, readable text; we strongly recommend a passphrase if the
          file will pass through cloud storage, email, or a messaging app.
        </p>
      </Section>

      <Section id="third-parties" heading="Updates, testing, and third parties">
        <p>
          MoodPixels itself has no backend, but two services are involved in getting the app onto your phone
          and keeping it current. Neither one receives your journal entries, notes, or mood data.
        </p>
        <h3>Expo Application Services (app updates)</h3>
        <p>
          Installed builds check for over-the-air JavaScript updates from Expo’s update service. To deliver
          an update, that service necessarily processes technical request information such as your IP
          address, app version, and runtime version. This is operated by Expo (650 Industries, Inc.) under
          its own privacy policy.
        </p>
        <h3>Firebase App Distribution (preview testing)</h3>
        <p>
          The Android preview is distributed through Firebase App Distribution, a Google service. If you
          join the preview, you provide an email address to Google in order to be invited and to download
          builds, and Google processes device and installation information to deliver them. That email
          address identifies you as a tester; it is not linked to anything inside your journal, which never
          leaves your device. Google’s handling of that data is governed by its own privacy policy.
        </p>
        <p className="doc-note">
          If you would rather not be identified as a tester, simply do not join the preview programme.
        </p>
      </Section>

      <Section id="permissions" heading="Device permissions">
        <p>Every permission is optional, requested only in context, and refusable without losing core use:</p>
        <ul>
          <li>
            <strong>Notifications</strong> — used only for the optional daily reminder and backup reminder
            you schedule yourself. Reminders are scheduled locally; no push service is involved.
          </li>
          <li>
            <strong>Photos / media library</strong> — requested only at the moment you choose to save a
            generated image of your mood grid to your gallery. The app does not read your existing photos.
          </li>
          <li>
            <strong>Biometrics</strong> — if you enable the app lock, authentication is performed by Android.
            The app receives only a success or failure result; your fingerprint or face data is never
            available to it.
          </li>
        </ul>
      </Section>

      <Section id="website" heading="This website">
        <p>
          <code>moodpixels.dhruvsaija.in</code> is a static site hosted on GitHub Pages. It sets no cookies,
          runs no analytics or advertising scripts, and has no comment system, contact form, or login.
        </p>
        <p>
          As with any web host, GitHub processes standard server request information — including your IP
          address and user agent — in order to serve the page and protect the service. That processing is
          governed by GitHub’s privacy statement. Fonts are bundled and served from this domain, so visiting
          the site does not issue requests to a third-party font provider.
        </p>
      </Section>

      <Section id="legal-bases" heading="Legal bases for processing">
        <p>
          Where the GDPR applies, the limited processing described above rests on our legitimate interests
          (Article 6(1)(f)) in securely distributing and maintaining the app and in operating this website,
          and on performance of our agreement with you (Article 6(1)(b)) where you have asked for the app or
          an update. Where consent is the appropriate basis — device permissions such as notifications —
          consent is requested at the point of use and can be withdrawn at any time in your device settings.
        </p>
        <p>
          Where India’s Digital Personal Data Protection Act, 2023 applies, processing is carried out for the
          specified lawful purposes set out in this notice.
        </p>
      </Section>

      <Section id="rights" heading="Your rights and choices">
        <p>
          Depending on where you live, you may have rights to access, correct, delete, restrict, or object to
          processing of your personal data, to data portability, and to lodge a complaint with a supervisory
          authority.
        </p>
        <p>
          In practice, most of these are exercised directly in the app rather than by asking us, because we
          hold nothing to give you: your entries are on your device, you can edit or delete any of them,
          export them in a portable JSON format, turn reminders and the app lock off, and remove everything
          by clearing the app’s data or uninstalling it.
        </p>
        <p>
          For anything involving the preview programme — for example removing your tester email address —
          write to <Mailto /> and we will action it, and pass on any request that must be handled by Google
          or Expo. We aim to respond within 30 days.
        </p>
      </Section>

      <Section id="retention" heading="Retention">
        <p>
          Journal data is retained on your device for as long as you keep it, and is deleted when you delete
          it or uninstall the app. We do not hold copies, so there is nothing for us to retain or purge.
          Tester records held by Firebase App Distribution persist for as long as you remain enrolled in the
          preview. Support email is kept only as long as needed to resolve your query and to keep a record of
          the exchange.
        </p>
      </Section>

      <Section id="security" heading="Security">
        <p>
          Your journal is stored in app-private storage, which Android isolates from other applications. You
          can add a biometric lock, and you can encrypt any backup you create with a passphrase as described
          above.
        </p>
        <p>
          No system is perfectly secure, and some risks sit outside the app: a rooted or compromised device,
          a device without a screen lock, or an unencrypted backup stored somewhere insecure. Keeping your
          device updated and lock-protected does more for the safety of your journal than anything the app
          can do on its own.
        </p>
      </Section>

      <Section id="children" heading="Age requirement">
        <p>
          MoodPixels is intended for people aged 18 and over. It is not directed at children, and we do not
          knowingly collect personal data from anyone under 18. If you are under 18, please do not use the
          app or join the preview programme.
        </p>
      </Section>

      <Section id="changes" heading="Changes to this policy">
        <p>
          We will update this policy when the app’s data practices change. The current version is always
          posted on this page with a revised date at the top. Where a change materially reduces your
          privacy, we will make it prominent in the app or in the release notes rather than relying on you
          to re-read this page.
        </p>
      </Section>

      <Section id="contact" heading="Contact and grievances">
        <p>
          Privacy questions, requests, and complaints can be sent to <Mailto />. {owner}, of {jurisdiction},
          acts as the point of contact for grievances under applicable Indian data-protection law.
        </p>
        <p>
          If you are in the EEA or the UK and you are not satisfied with our response, you also have the
          right to complain to your local data-protection supervisory authority.
        </p>
      </Section>
    </Document>
  );
}

// ─── Terms of Use ────────────────────────────────────────────────────────────

const TERMS_SECTIONS = [
  { id: 'agreement', heading: 'Agreement to these terms' },
  { id: 'eligibility', heading: 'Eligibility' },
  { id: 'licence', heading: 'Your licence to use the app' },
  { id: 'preview', heading: 'Preview software' },
  { id: 'acceptable-use', heading: 'Acceptable use' },
  { id: 'not-medical', heading: 'Not medical advice' },
  { id: 'your-content', heading: 'Your content' },
  { id: 'data-loss', heading: 'Backups and data loss' },
  { id: 'third-party', heading: 'Third-party services' },
  { id: 'availability', heading: 'Availability and updates' },
  { id: 'ip', heading: 'Intellectual property' },
  { id: 'feedback', heading: 'Feedback' },
  { id: 'warranties', heading: 'Disclaimer of warranties' },
  { id: 'liability', heading: 'Limitation of liability' },
  { id: 'termination', heading: 'Termination' },
  { id: 'changes', heading: 'Changes to these terms' },
  { id: 'law', heading: 'Governing law' },
  { id: 'contact', heading: 'Contact' },
];

export function Terms() {
  return (
    <Document
      title="Terms of Use"
      intro={
        <p>
          These terms govern your use of the MoodPixels app and this website, both operated by {owner} from{' '}
          {jurisdiction}. Please read the sections on medical advice, data loss, and liability carefully —
          they limit what MoodPixels is for and what we are responsible for.
        </p>
      }
      sections={TERMS_SECTIONS}
    >
      <Section id="agreement" heading="Agreement to these terms">
        <p>
          By installing, accessing, or using MoodPixels, you agree to these Terms of Use. If you do not agree
          with them, please do not use the app. These terms should be read alongside our{' '}
          <a href="/privacy/">Privacy Policy</a>, which forms part of this agreement.
        </p>
      </Section>

      <Section id="eligibility" heading="Eligibility">
        <p>
          MoodPixels is for people aged 18 and over. By using the app you confirm that you are at least 18
          and that you have the legal capacity to enter into this agreement.
        </p>
      </Section>

      <Section id="licence" heading="Your licence to use the app">
        <p>
          We grant you a personal, non-exclusive, non-transferable, revocable licence to install and use
          MoodPixels on devices you own or control, for your own personal, non-commercial reflection.
        </p>
        <p>You may not:</p>
        <ul>
          <li>redistribute, sell, sublicense, or rent the app;</li>
          <li>
            reverse engineer, decompile, or disassemble it, except to the extent that applicable law
            expressly permits this despite this restriction;
          </li>
          <li>remove or obscure any proprietary notices; or</li>
          <li>use the app to build a competing product or to scrape or harvest anything from it.</li>
        </ul>
      </Section>

      <Section id="preview" heading="Preview software">
        <p>
          MoodPixels is currently distributed as an Android preview for testing. Preview builds are
          pre-release software: they may contain defects, behave unpredictably, change significantly between
          releases, or be discontinued. Features present in a preview build may be altered or removed before
          any general release.
        </p>
        <p>
          You should keep an up-to-date backup while using preview builds. Do not rely on a preview build as
          the only record of anything important to you.
        </p>
      </Section>

      <Section id="acceptable-use" heading="Acceptable use">
        <p>
          Use MoodPixels lawfully and for your own personal reflection. You are responsible for the security
          of your device, your screen lock, and any backups you export, and for any content you choose to
          record in the app.
        </p>
      </Section>

      <Section id="not-medical" heading="Not medical advice">
        <div className="doc-callout doc-callout-warn">
          <AlertTriangle size={20} aria-hidden="true" />
          <div>
            <strong>MoodPixels is not a medical device and provides no medical advice.</strong>
            <p>
              It does not diagnose, treat, cure, prevent, or monitor any condition, and it does not provide
              mental-health, crisis, or emergency services. Its statistics describe the moods you logged and
              nothing more — they are not an assessment of your health and must not be used as one.
              MoodPixels is not a substitute for a qualified professional.
            </p>
          </div>
        </div>
        <p>
          Never disregard professional advice or delay seeking it because of something you saw in the app. If
          you may be in immediate danger, or you are thinking about harming yourself,{' '}
          <strong>contact local emergency services or a crisis line now.</strong>
        </p>
        <div className="doc-callout">
          <LifeBuoy size={20} aria-hidden="true" />
          <div>
            <strong>If you need to talk to someone</strong>
            <p>
              In India, Tele-MANAS is available around the clock on <strong>14416</strong>, and the KIRAN
              helpline on <strong>1800-599-0019</strong>. Elsewhere,{' '}
              <a href="https://findahelpline.com" target="_blank" rel="noreferrer">
                findahelpline.com <ArrowUpRight size={13} />
              </a>{' '}
              lists free, confidential services by country. These are independent services, not operated by
              or affiliated with MoodPixels.
            </p>
          </div>
        </div>
      </Section>

      <Section id="your-content" heading="Your content">
        <p>
          You keep full ownership of the entries, notes, and mood definitions you create. Because they are
          stored on your device and never sent to us, we acquire no licence or right over them whatsoever. We
          cannot read, moderate, restore, or produce your content, and we will not be able to help you
          recover it if it is lost.
        </p>
      </Section>

      <Section id="data-loss" heading="Backups and data loss">
        <p>
          Your journal exists only where you keep it. It can be lost if you uninstall the app, clear its
          data, lose or reset the device, or if the device fails. Exporting backups regularly is the only
          protection against this, and doing so is your responsibility.
        </p>
        <p>
          A forgotten backup passphrase cannot be recovered or reset by anyone, including us — the passphrase
          is never stored or transmitted. A backup file you delete, overwrite, or lose is gone. Please store
          passphrases in a password manager and keep backups somewhere you will still have access to later.
        </p>
      </Section>

      <Section id="third-party" heading="Third-party services">
        <p>
          The preview is distributed through Firebase App Distribution (Google) and app updates are delivered
          through Expo Application Services. Your use of those services is governed by their own terms and
          privacy policies, and we are not responsible for them. This website is hosted on GitHub Pages.
        </p>
      </Section>

      <Section id="availability" heading="Availability and updates">
        <p>
          We may add, change, suspend, or discontinue features, builds, or the app as a whole at any time,
          with or without notice. We aim to make updates safe and backward-compatible, but you should keep a
          current backup before installing a new build. We do not guarantee that the app will be available,
          uninterrupted, or error-free.
        </p>
      </Section>

      <Section id="ip" heading="Intellectual property">
        <p>
          The MoodPixels name, logo, mood-face artwork, design, and the app’s software are owned by {owner}{' '}
          and protected by intellectual-property law. Nothing in these terms transfers any of those rights to
          you beyond the limited licence described above.
        </p>
      </Section>

      <Section id="feedback" heading="Feedback">
        <p>
          If you send us suggestions, bug reports, or ideas, you grant us a perpetual, worldwide, royalty-free
          right to use them to improve MoodPixels without obligation, attribution, or compensation. Please do
          not include confidential information, or the contents of your journal, in feedback.
        </p>
      </Section>

      <Section id="warranties" heading="Disclaimer of warranties">
        <p>
          To the fullest extent permitted by law, MoodPixels is provided <strong>“as is”</strong> and{' '}
          <strong>“as available”</strong>, without warranties of any kind, whether express, implied, or
          statutory, including any implied warranties of merchantability, fitness for a particular purpose,
          accuracy, or non-infringement.
        </p>
        <p>
          Some jurisdictions do not allow the exclusion of certain warranties, so parts of this section may
          not apply to you. Nothing here limits any non-excludable statutory rights you have as a consumer.
        </p>
      </Section>

      <Section id="liability" heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, {owner} will not be liable for any indirect, incidental,
          special, consequential, exemplary, or punitive damages, nor for any loss of data, loss of backups,
          loss of profits, loss of goodwill, or device damage arising out of or in connection with your use of
          MoodPixels — whether based in contract, tort, negligence, or any other theory, and even if we have
          been advised of the possibility of such damages.
        </p>
        <p>
          Where liability cannot lawfully be excluded, our total aggregate liability arising out of or
          relating to the app is limited to the greater of the amount you paid us for it in the twelve months
          preceding the claim (which, for a free app, is nil) or INR 1,000.
        </p>
        <p>
          Nothing in these terms excludes or limits liability for death or personal injury caused by
          negligence, for fraud or fraudulent misrepresentation, or for any other liability that cannot be
          excluded under applicable law.
        </p>
      </Section>

      <Section id="termination" heading="Termination">
        <p>
          You may end this agreement at any time by uninstalling the app; nothing further is required, and
          your data goes with it. We may suspend or terminate your access to preview builds, or discontinue
          the preview programme, if you breach these terms or if we stop distributing the app.
        </p>
        <p>
          The sections on your content, data loss, intellectual property, disclaimers, limitation of
          liability, and governing law survive termination.
        </p>
      </Section>

      <Section id="changes" heading="Changes to these terms">
        <p>
          We may revise these terms from time to time by posting an updated version on this page with a new
          date. Material changes will be signalled in the app or in release notes where practical. Continuing
          to use MoodPixels after a change takes effect means you accept the revised terms.
        </p>
      </Section>

      <Section id="law" heading="Governing law">
        <p>
          These terms are governed by the laws of India, without regard to conflict-of-law rules. The courts
          at {jurisdiction} will have exclusive jurisdiction over any dispute arising out of or relating to
          them, except where mandatory consumer-protection law in your country of residence gives you the
          right to bring proceedings locally.
        </p>
      </Section>

      <Section id="contact" heading="Contact">
        <p>
          Questions about these terms can be sent to <Mailto />.
        </p>
      </Section>
    </Document>
  );
}

// ─── Support ─────────────────────────────────────────────────────────────────

const SUPPORT_SECTIONS = [
  { id: 'preview', heading: 'Joining the Android preview' },
  { id: 'install', heading: 'Installation problems' },
  { id: 'move', heading: 'Moving to a new phone' },
  { id: 'reminders', heading: 'Reminders not arriving' },
  { id: 'lock', heading: 'App lock and biometrics' },
  { id: 'lost', heading: 'Lost data or passphrase' },
  { id: 'contact', heading: 'Contacting a human' },
];

export function Support() {
  return (
    <Document
      title="Support"
      intro={
        <p>
          MoodPixels is made by one person, and support is a real inbox rather than a ticket system. Most
          questions are answered below; anything that isn’t, send over and you will get a reply.
        </p>
      }
      sections={SUPPORT_SECTIONS}
    >
      <Section id="preview" heading="Joining the Android preview">
        <p>
          MoodPixels is currently an Android-only preview, distributed through Firebase App Distribution.
          It is free, and there is no waitlist.
        </p>
        <ol className="doc-steps">
          <li>
            Open the{' '}
            <a href={androidPreview} target="_blank" rel="noreferrer">
              preview invite link <ArrowUpRight size={13} />
            </a>{' '}
            on the Android phone you want to install on.
          </li>
          <li>Sign in with a Google account so Firebase can register you as a tester.</li>
          <li>Accept the invitation, then download and install the APK it offers.</li>
          <li>
            You will be notified when new builds ship. There is no iOS build, and no Play Store listing yet.
          </li>
        </ol>
        <p className="doc-note">
          Joining means sharing an email address with Google as the distribution provider. See the{' '}
          <a href="/privacy/#third-parties">privacy policy</a> for what that involves.
        </p>
      </Section>

      <Section id="install" heading="Installation problems">
        <p>
          Because the preview is distributed outside the Play Store, Android will ask for permission before
          installing. If the install is blocked, allow your browser or the App Tester app to install unknown
          apps when prompted, then try again.
        </p>
        <p>
          If you see a signature or “app not installed” error, it usually means an older build with a
          different signature is still present. Export a backup first if you have entries you care about,
          uninstall the old version, then install the new one and import the backup.
        </p>
      </Section>

      <Section id="move" heading="Moving to a new phone">
        <p>
          Because nothing syncs to a server, moving devices is a manual export and import — and it is
          quick:
        </p>
        <ol className="doc-steps">
          <li>On the old phone, go to Settings → Backup and export your journal.</li>
          <li>
            Set a passphrase if the file will travel through cloud storage, email, or a messaging app. Store
            that passphrase in a password manager.
          </li>
          <li>Move the file to the new phone however you like.</li>
          <li>Install MoodPixels there, then use Settings → Backup to import the file.</li>
        </ol>
        <p>
          Importing validates the file before it touches your data, so a corrupted or tampered-with backup
          is rejected rather than half-applied.
        </p>
      </Section>

      <Section id="reminders" heading="Reminders not arriving">
        <p>
          Reminders are scheduled locally on your device, so they are almost always blocked by an Android
          setting rather than by the app. Check, in order:
        </p>
        <ul>
          <li>Notification permission is granted to MoodPixels in Android settings.</li>
          <li>
            Battery optimisation is not restricting the app — aggressive power saving on some manufacturers’
            phones will silently delay or drop scheduled notifications.
          </li>
          <li>Do Not Disturb is not covering the reminder time you chose.</li>
          <li>The reminder is actually enabled, with a time set, in Settings → Reminder.</li>
        </ul>
      </Section>

      <Section id="lock" heading="App lock and biometrics">
        <p>
          The app lock uses your device’s own biometric authentication, so it requires a screen lock and at
          least one enrolled fingerprint or face. If the option is unavailable, set those up in Android
          settings first.
        </p>
        <p>
          The lock deliberately does not re-prompt when you come back from the share sheet or a file picker,
          and it allows a short grace period when you switch away briefly — so exporting a backup is not
          punished with a biometric prompt on the way back.
        </p>
      </Section>

      <Section id="lost" heading="Lost data or passphrase">
        <p>
          We cannot recover either. There is no server-side copy of your journal, and backup passphrases are
          never stored or transmitted — which is exactly what makes an encrypted backup meaningful, and also
          what makes it unrecoverable.
        </p>
        <p>
          If a backup file still exists and you remember the passphrase, importing it will restore
          everything in it. If the passphrase is gone, the file cannot be decrypted by any means available to
          us. The practical protection is to export regularly and keep passphrases in a password manager.
        </p>
      </Section>

      <Section id="contact" heading="Contacting a human">
        <div className="doc-callout">
          <Mail size={20} aria-hidden="true" />
          <div>
            <strong>
              <Mailto />
            </strong>
            <p>
              Please include your Android version, phone model, and the app version from Settings, plus what
              you expected to happen and what happened instead. Never include your backup passphrase, and
              there is no need to send journal contents.
            </p>
          </div>
        </div>
        <p className="doc-note">
          This is a personal project, so replies are usually within a few days rather than a few minutes.
          Support is offered in English.
        </p>
      </Section>
    </Document>
  );
}

// ─── 404 ─────────────────────────────────────────────────────────────────────

export function NotFound() {
  return (
    <main id="main-content" className="notfound">
      <div className="shell">
        <p className="pill">
          <span className="tiny-pixel" aria-hidden="true" /> 404
        </p>
        <h1>This page wandered off.</h1>
        <p className="lede">
          The link may be old, or slightly mistyped. The grid is still where you left it.
        </p>
        <div className="hero-actions">
          <a className="button" href="/">
            Back to the start
          </a>
          <a className="text-link" href="/support/">
            Get support <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </main>
  );
}
