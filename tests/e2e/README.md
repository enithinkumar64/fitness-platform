# Navigation tests

Run these commands from the project folder:

```sh
npx playwright install chromium
npm run test
```

Playwright builds the app, starts a production server at `http://127.0.0.1:3100`, runs desktop and mobile Chromium tests, and stops its server afterward. Keep port 3100 available. You can leave your regular development server on port 3000 running.

To watch the browser or view the latest HTML report:

```sh
npm run test -- --headed
npx playwright show-report
```

Reports, failure screenshots, and traces are generated in ignored folders. Layout-specific tests are intentionally skipped in the other profile. Tests use accessible names and waiting assertions, without fixed sleeps.

To add Firefox or WebKit later, install the desired browser with `npx playwright install firefox` or `npx playwright install webkit`, then uncomment its project in `playwright.config.ts`. This setup does not create a GitHub Actions workflow.
