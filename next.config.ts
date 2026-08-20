import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Rewrites barrel imports to deep paths so only the icons actually used
    // are bundled.
    optimizePackageImports: ["lucide-react"],
  },
};

export default withNextIntl(nextConfig);
