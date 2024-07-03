/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true, // 이 설정을 추가하면 src/app 디렉토리 구조를 사용할 수 있습니다.
  },
  images: {
    domains: ['d2v80xjmx68n4w.cloudfront.net', 'honjaya.s3.ap-northeast-2.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2v80xjmx68n4w.cloudfront.net',
        port: "",
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        port: "", 
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 't1.kakaocdn.net',
        port: "",
        pathname: '/**',
      }
    ]
  },
  output: 'standalone', // standalone 설정 추가
};

export default nextConfig;

