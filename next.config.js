/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["goatbolbstorage.blob.core.windows.net"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   appDir: true,
  //   webpackBuildWorker: true,
  // },
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false };

  //   return config;
  // },
  // experimental: {
  //   appDir: true,
  //   async headers() {
  //     return [
  //       {
  //         source: "/api/:path*",
  //         headers: [
  //           { key: "Access-Control-Allow-Origin", value: "*" },
  //           {
  //             key: "Access-Control-Allow-Methods",
  //             value: "GET,POST,PUT,DELETE",
  //           },
  //           {
  //             key: "Access-Control-Allow-Headers",
  //             value: "Content-Type, Authorization",
  //           },
  //         ],
  //       },
  //     ];
  //   },
  // },
};

module.exports = nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//     domains: ["goatbolbstorage.blob.core.windows.net"],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// module.exports = nextConfig;
