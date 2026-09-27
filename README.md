# MoodPixels public site

This is the static public site for `moodpixels.dhruvsaija.in`. It contains the landing page, Privacy Policy, and Terms of Use.

## Publish with GitHub Pages

The `Deploy public site` workflow runs manually or after website changes reach `main`. In the repository’s **Settings → Pages**, select **GitHub Actions** as the publishing source and set the custom domain to `moodpixels.dhruvsaija.in` before changing DNS.

## Connect the GoDaddy subdomain

1. In GoDaddy, open **Domain Portfolio → dhruvsaija.in → DNS**.
2. Add a record with **Type** `CNAME`, **Name** `moodpixels`, **Value** `walkingstatue.github.io`, and the default TTL.
3. Do not use a wildcard record such as `*.dhruvsaija.in`.
4. Return to GitHub Pages and wait for DNS verification, then enable **Enforce HTTPS**.

DNS often updates within an hour but may take up to 48 hours. Create or forward `support@dhruvsaija.in` before publishing because it is the public legal and support contact.
