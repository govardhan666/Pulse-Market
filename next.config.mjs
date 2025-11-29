/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle fallbacks for node modules
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    
    // External packages that shouldn't be bundled
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Fix for WalletConnect indexedDB issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        indexedDB: false,
      };
    }
    
    return config;
  },
  // Transpile specific packages
  transpilePackages: [
    '@walletconnect/ethereum-provider',
    '@walletconnect/universal-provider',
  ],
};

export default nextConfig;
