const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force CommonJS resolution to avoid import.meta issues with zustand/reanimated
config.resolver.unstable_conditionNames = [
  'require',
  'react-native',
  'default',
];

module.exports = config;
