/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH ?? "/founder-program";

const nextConfig = {
  reactStrictMode: true,
  // Sub-path in production (e.g. listenlabs.com/founder-program). Empty in
  // .env.development for local dev at /. Keep in sync with asset.ts.
  ...(basePath ? { basePath } : {}),
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
