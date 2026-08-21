# LWD Research Page

Independent project page for **Learning while Deploying: Fleet-Scale Reinforcement Learning for Generalist Robot Policies**.

The site uses the same warm editorial system as the τ0-VLA research page while keeping the original LWD article copy and publication media. All paper, image, font, and video assets are local; the page has no runtime dependency on the former Finch site.

## Local review

```bash
npm ci
npm test
npm run lint
npm run preview:local
```

Open `http://127.0.0.1:4174/`. The preview server supports byte-range requests for video seeking.

## Publication

The included GitHub Actions workflow builds the static export from `main`. It automatically supports both an account-level `<owner>.github.io` repository and a project-level repository path. Set `NEXT_PUBLIC_SITE_URL` only when a custom domain or explicit canonical URL is required.

Do not commit `out/`, `.next/`, `dist/`, or `node_modules/`.
