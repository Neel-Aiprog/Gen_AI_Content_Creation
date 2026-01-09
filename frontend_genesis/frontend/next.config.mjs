import { fileURLToPath } from "url";
import path from "path";

/** ESM-safe __dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,   // 👈 forces correct root
  },
};

export default nextConfig;
