const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(__dirname, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders || []), path.join(monorepoRoot, 'packages')];

config.resolver = {
  ...(config.resolver || {}),
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    '@realmaker/shared': path.join(monorepoRoot, 'packages', 'shared'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
