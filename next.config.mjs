/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // App is served under this sub-path. Keep in sync with BASE_PATH in
  // src/lib/asset.ts (which prefixes plain <img>/CSS url() assets).
  basePath: "/founder-program",
};
export default nextConfig;
