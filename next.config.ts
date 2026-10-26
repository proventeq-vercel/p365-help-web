import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd()),
  async redirects() {
    return [
      {
        // The Bash app-registration script was replaced by the prerequisites script.
        source: "/proventeq365/appendix/entra-app-script",
        destination: "/proventeq365/deployment-prerequisites/run-prerequisites-script",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
