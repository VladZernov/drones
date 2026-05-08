import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
};

export default {
  reactStrictMode: true,
};

//export default withPWA(nextConfig);