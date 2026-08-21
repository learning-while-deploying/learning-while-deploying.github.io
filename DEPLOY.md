# GitHub Pages handoff

1. Create or select the final GitHub repository.
2. Add this directory as the repository contents and review the first commit.
3. Run `npm ci`, `npm test`, and `npm run lint` locally.
4. Push to `main` only after visual review.
5. In GitHub Pages settings, choose **GitHub Actions** as the source.
6. Confirm the **Deploy project page** workflow succeeds, then verify the paper, figures, and representative video seeking.

The workflow derives the correct base path from `GITHUB_REPOSITORY`; no URL edit is needed for ordinary GitHub Pages hosting.
