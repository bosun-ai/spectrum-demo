# Regression Tests Setup

Installed compatible versions under Node 12:
- jest: 22.4.3 (using existing project resolution)
- @testing-library/react: 10.4.9
- @testing-library/jest-dom: 5.17.0
- msw: 0.27.0
- cross-fetch: 3.2.0

Verified Node/Yarn:
- Node: 12.22.12 via `nvm use && node -v`
- Yarn: 1.22.22 via `nvm use && yarn -v`

Run tests:
- `nvm use && yarn run test:regression`

Notes:
- We used `--ignore-engines` during add to bypass strict engine checks for transient deps while staying on Node 12.
- React version is 16.8.4, compatible with @testing-library/react 10.x.
