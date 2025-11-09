import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: ["app"],
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svg/webpack"],
    })

    return config
  },
  // Optional: If you are using Turbopack, you might also add this for explicit loader configuration
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
}

export default nextConfig
