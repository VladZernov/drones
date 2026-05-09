import type { NextConfig } from "next";
// import withPWAInit from "next-pwa";
//
// const withPWA = withPWAInit({
//   dest: "public",
// });

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: true,
  reactCompiler: true,
};

export default nextConfig;

//export default withPWA(nextConfig);