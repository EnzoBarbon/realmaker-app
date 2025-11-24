import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      'figma:asset/ff8fa7db48d2e987913ba373a337cc41dbd9c954.png': path.resolve(
        __dirname,
        './src/assets/ff8fa7db48d2e987913ba373a337cc41dbd9c954.png',
      ),
      'figma:asset/f73a3d71097fb7bedda6628dbaf29db47ca843e1.png': path.resolve(
        __dirname,
        './src/assets/f73a3d71097fb7bedda6628dbaf29db47ca843e1.png',
      ),
      'figma:asset/f0e564f01caefd2e9859e47fbff0598190bcc7e8.png': path.resolve(
        __dirname,
        './src/assets/f0e564f01caefd2e9859e47fbff0598190bcc7e8.png',
      ),
      'figma:asset/e56ec1ec72cb5598788a6b0e550174d8df774665.png': path.resolve(
        __dirname,
        './src/assets/e56ec1ec72cb5598788a6b0e550174d8df774665.png',
      ),
      'figma:asset/d4fe5bd3cb1b61e90f7034a8fc2289beae0a6e3f.png': path.resolve(
        __dirname,
        './src/assets/d4fe5bd3cb1b61e90f7034a8fc2289beae0a6e3f.png',
      ),
      'figma:asset/d43018dd79e9a363c1177905127efe215b142bb6.png': path.resolve(
        __dirname,
        './src/assets/d43018dd79e9a363c1177905127efe215b142bb6.png',
      ),
      'figma:asset/cf815f934b1d2251a493a99dbd8c754206e6b392.png': path.resolve(
        __dirname,
        './src/assets/cf815f934b1d2251a493a99dbd8c754206e6b392.png',
      ),
      'figma:asset/c1bb7ea2d8379064bdfbda00c673f8d3e7921905.png': path.resolve(
        __dirname,
        './src/assets/c1bb7ea2d8379064bdfbda00c673f8d3e7921905.png',
      ),
      'figma:asset/bbaf857fa836713be4e22b0b5bff8ba709e5305c.png': path.resolve(
        __dirname,
        './src/assets/bbaf857fa836713be4e22b0b5bff8ba709e5305c.png',
      ),
      'figma:asset/bb54e646750a69c370d5f7a2c99a917d9015904b.png': path.resolve(
        __dirname,
        './src/assets/bb54e646750a69c370d5f7a2c99a917d9015904b.png',
      ),
      'figma:asset/b59659194081848f16ace869057444b3dc81efc5.png': path.resolve(
        __dirname,
        './src/assets/b59659194081848f16ace869057444b3dc81efc5.png',
      ),
      'figma:asset/b05beaf2f103c7f4330595029d0d45f5c0924acd.png': path.resolve(
        __dirname,
        './src/assets/b05beaf2f103c7f4330595029d0d45f5c0924acd.png',
      ),
      'figma:asset/ab64df24f46a006b95a3f65760a2f561093aceeb.png': path.resolve(
        __dirname,
        './src/assets/ab64df24f46a006b95a3f65760a2f561093aceeb.png',
      ),
      'figma:asset/a9c81121cd8ab1b112774daa3bfd9acc23e2bd35.png': path.resolve(
        __dirname,
        './src/assets/a9c81121cd8ab1b112774daa3bfd9acc23e2bd35.png',
      ),
      'figma:asset/a6f2206a839d23c580e1f840cfcbd09e7d9bac99.png': path.resolve(
        __dirname,
        './src/assets/a6f2206a839d23c580e1f840cfcbd09e7d9bac99.png',
      ),
      'figma:asset/97131dc4f6e5ece4b4c8c547a7a9d021c634b308.png': path.resolve(
        __dirname,
        './src/assets/97131dc4f6e5ece4b4c8c547a7a9d021c634b308.png',
      ),
      'figma:asset/8d66240e1f99ecb7bf643c0039282177acf86a94.png': path.resolve(
        __dirname,
        './src/assets/8d66240e1f99ecb7bf643c0039282177acf86a94.png',
      ),
      'figma:asset/82c9b813616f290a2340660e134eb3b40c66a9f1.png': path.resolve(
        __dirname,
        './src/assets/82c9b813616f290a2340660e134eb3b40c66a9f1.png',
      ),
      'figma:asset/819dab0890fe1ea040d1445b2441369e3de3c2fe.png': path.resolve(
        __dirname,
        './src/assets/819dab0890fe1ea040d1445b2441369e3de3c2fe.png',
      ),
      'figma:asset/6c95d24842b03550e437c1371ab9d4302fb935cd.png': path.resolve(
        __dirname,
        './src/assets/6c95d24842b03550e437c1371ab9d4302fb935cd.png',
      ),
      'figma:asset/671616b9032879620ed33f3d4d37bcaef6885ba0.png': path.resolve(
        __dirname,
        './src/assets/671616b9032879620ed33f3d4d37bcaef6885ba0.png',
      ),
      'figma:asset/626043dff63d658c1761b4007eb553fdb99c08cb.png': path.resolve(
        __dirname,
        './src/assets/626043dff63d658c1761b4007eb553fdb99c08cb.png',
      ),
      'figma:asset/5aa75fbbf8213f8ddcc7c2eb5b7384b5caac919b.png': path.resolve(
        __dirname,
        './src/assets/5aa75fbbf8213f8ddcc7c2eb5b7384b5caac919b.png',
      ),
      'figma:asset/5777b3c3ff8e1c3a835413c09507d565dba5b7a1.png': path.resolve(
        __dirname,
        './src/assets/5777b3c3ff8e1c3a835413c09507d565dba5b7a1.png',
      ),
      'figma:asset/501d1f123a44e381a0a4ec629dbb49f8bdc8969f.png': path.resolve(
        __dirname,
        './src/assets/501d1f123a44e381a0a4ec629dbb49f8bdc8969f.png',
      ),
      'figma:asset/3b0fab53dfc667edafd55fba1483de957bd24b02.png': path.resolve(
        __dirname,
        './src/assets/3b0fab53dfc667edafd55fba1483de957bd24b02.png',
      ),
      'figma:asset/32fd521a6ea1b915766863842b035ee3d3f469c6.png': path.resolve(
        __dirname,
        './src/assets/32fd521a6ea1b915766863842b035ee3d3f469c6.png',
      ),
      'figma:asset/27ee6afd0a52d047be183e160fff41d35607933c.png': path.resolve(
        __dirname,
        './src/assets/27ee6afd0a52d047be183e160fff41d35607933c.png',
      ),
      'figma:asset/2479d41dc4417ae5b07a4b33c69b53250c2b99c6.png': path.resolve(
        __dirname,
        './src/assets/2479d41dc4417ae5b07a4b33c69b53250c2b99c6.png',
      ),
      'figma:asset/179d9be609ea876182d381b8c24f2ebbbd405577.png': path.resolve(
        __dirname,
        './src/assets/179d9be609ea876182d381b8c24f2ebbbd405577.png',
      ),
      'figma:asset/076cc0df271b0323c6f2c194910a9e3f89558215.png': path.resolve(
        __dirname,
        './src/assets/076cc0df271b0323c6f2c194910a9e3f89558215.png',
      ),
      'figma:asset/02943cc98ba18d0f4b92b7d7a96257d8023cc5d4.png': path.resolve(
        __dirname,
        './src/assets/02943cc98ba18d0f4b92b7d7a96257d8023cc5d4.png',
      ),
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@realmaker/shared': path.resolve(__dirname, '../packages/shared/src'),
      '@': path.resolve(__dirname, './src'),
      //This is because for local development, vite sometimes takes the shared package version of react, even
      //though it's listed as a peer dependency. With this configuration, it will always take the local version.
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
