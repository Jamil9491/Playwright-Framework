# Daraz Pakistan login

Add test account credentials to the existing, git-ignored `.env` file:

```dotenv
DARAZ_USERNAME=your-phone-number-or-email
DARAZ_PASSWORD=your-password
```

Run from the project root in Git Bash:

```bash
npm run test:daraz:ui     # Check the login form without credentials
npm run test:daraz:login  # Submit credentials and verify the account menu
npm run test:daraz        # Run both scenarios
```

`src/features/darazLogin.feature` supplies username and password as separate
Scenario Outline columns and step parameters. `env:` values are resolved from
environment variables; literal values also work, but appear in reports.
Use environment references for real credentials. The Daraz steps do not log
credentials. Existing failure screenshots may contain the entered username.

The page objects use an absolute Daraz URL, leaving the Todo base URL unchanged.
Login opens a modal on the homepage. Success requires a visible, nonempty account
menu, a hidden Login link, a visible Logout option after hovering the menu, and
closure of the login form. Closing the modal alone does not count as success.

The homepage link, input placeholders, login button, and account menu IDs were
inspected on the live site on 2026-09-29. Successful authentication still requires
verification with a valid test account. If Daraz requests CAPTCHA or OTP, the
scenario fails its signed-in assertion unless the challenge is completed;
it does not bypass those checks. In the headed browser, a challenge can be
completed manually during the 30-second account-menu wait.
