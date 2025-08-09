
import type {NextConfig} from 'next';

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
})

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**.healthline.com',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.google.com',
      },
      {
        protocol: 'https',
        hostname: '**.jungseed.com',
      },
      {
        protocol: 'https',
        hostname: '**.apggreenhouse.com',
      },
      {
        protocol: 'https',
        hostname: '**.purepng.com',
      },
      {
        protocol: 'https',
        hostname: '**.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
        'https://*.cloudworkstations.dev',
    ]
  }
};

export default withPWA(nextConfig);
