import type { NextConfig } from "next";

const [githubOwner = "", githubRepository = ""] =
  process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isRootPagesRepository =
  githubRepository.toLowerCase() === `${githubOwner.toLowerCase()}.github.io`;
const basePath =
  process.env.GITHUB_ACTIONS === "true" && !isRootPagesRepository
    ? `/${githubRepository}`
    : "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.GITHUB_ACTIONS === "true" && githubOwner
    ? `https://${githubOwner}.github.io${basePath}`
    : "http://localhost:4174");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
