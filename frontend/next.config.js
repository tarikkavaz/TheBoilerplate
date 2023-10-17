const dotenv = require('dotenv');
dotenv.config();

const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const { CLIENT_BASE_URL } = process.env;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: CLIENT_BASE_URL,
        port: ' ',
        pathname: '/media/images/**',
      },
    ],
  },
  // Other Next.js configuration ...
};

module.exports = withNextIntl(nextConfig);
